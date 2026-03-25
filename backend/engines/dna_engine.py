import json
import logging
from typing import Dict, Optional, List
from datetime import datetime
from services.database_service import db_service

logger = logging.getLogger(__name__)

class DNAEngine:
    @staticmethod
    async def get_profile(tenant_id: str, user_id: str) -> Optional[Dict]:
        """Get existing DNA profile or return None for new user"""
        return await db_service.get_dna_profile(tenant_id, user_id)

    @staticmethod
    def compute_match_score(profile: Optional[Dict], features: Dict, metadata: Dict) -> Dict:
        """
        Compare current login against DNA profile.
        Returns match score 0-100 (100 = perfect match), wrapped in a dictionary for consumers.
        """
        if profile is None:
            return {"dna_match": 50.0, "is_new_user": True, "deductions": []}

        score = 100.0
        deductions = []

        if features.get("new_device", 0) == 1:
            score -= 20
            deductions.append({"reason": "new_device", "points": 20})

        if features.get("country_change", 0) == 1:
            score -= 25
            deductions.append({"reason": "country_change", "points": 25})

        if features.get("impossible_travel", 0) == 1:
            score -= 30
            deductions.append({"reason": "impossible_travel", "points": 30})

        hour_dev = features.get("hour_deviation", 0)
        hour_penalty = hour_dev * 15
        score -= hour_penalty
        if hour_penalty > 2:
            deductions.append({"reason": "unusual_hour", "points": round(hour_penalty, 1)})

        ip_change = metadata.get("ip_change", False)
        country_change_flag = features.get("country_change", 0)
        if ip_change and not country_change_flag:
            score -= 8
            deductions.append({"reason": "new_ip_same_country", "points": 8})

        failed = features.get("failed_attempts", 0)
        fail_penalty = min(failed * 10, 30)
        score -= fail_penalty
        if fail_penalty > 0:
            deductions.append({"reason": "failed_attempts", "points": fail_penalty})

        return {
            "dna_match": max(0.0, min(100.0, score)),
            "is_new_user": False,
            "deductions": deductions
        }

    @staticmethod
    async def update_profile(tenant_id: str, user_id: str, metadata: Dict, features: Dict):
        """Update the DNA profile with new login data."""
        existing = await db_service.get_dna_profile(tenant_id, user_id)
        today = datetime.utcnow().strftime("%Y-%m-%d")

        if existing is None:
            day_of_week = metadata.get("day_of_week", 0)
            initial_weekday_counts = [0] * 7
            initial_weekday_counts[day_of_week] = 1
            profile = {
                "known_devices_json": json.dumps([metadata.get("device_fp", "")]),
                "known_countries_json": json.dumps([metadata.get("country", "Unknown")]),
                "known_cities_json": json.dumps([metadata.get("city", "Unknown")]),
                "known_ips_json": json.dumps([metadata.get("ip", "")]),
                "avg_login_hour": float(metadata.get("hour", 12)),
                "login_hours_json": json.dumps([metadata.get("hour", 12)]),
                "hour_min": -1.0,
                "hour_max": -1.0,
                "weekday_login_counts_json": json.dumps(initial_weekday_counts),
                "typical_weekend": False,
                "session_count_today": 1,
                "last_login_date": today,
                "login_count": 1,
                "days_active": 1,
                "first_seen": datetime.utcnow().isoformat(),
                "last_login_ip": (metadata.get("ip", "") or "")[:45],
                "last_login_country": (metadata.get("country", "Unknown") or "")[:100],
                "last_login_timestamp": datetime.utcnow().isoformat(),
                "common_resources_json": json.dumps([metadata.get("resource", "general")])
            }
        else:
            profile = existing.copy()

            devices = json.loads(profile.get("known_devices_json", "[]"))
            device = metadata.get("device_fp", "")
            if device and device not in devices:
                devices.append(device)
            profile["known_devices_json"] = json.dumps(devices[-10:])

            countries = json.loads(profile.get("known_countries_json", "[]"))
            country = metadata.get("country", "Unknown")
            if country and country not in countries:
                countries.append(country)
            profile["known_countries_json"] = json.dumps(countries)

            known_ips = json.loads(profile.get("known_ips_json", "[]"))
            current_ip = metadata.get("ip", "")
            if current_ip and current_ip not in known_ips:
                known_ips.append(current_ip)
            profile["known_ips_json"] = json.dumps(known_ips[-10:])

            cities = json.loads(profile.get("known_cities_json", "[]"))
            city = metadata.get("city", "Unknown")
            if city and city not in cities:
                cities.append(city)
            profile["known_cities_json"] = json.dumps(cities[-20:])

            old_avg = float(profile.get("avg_login_hour", 12.0))
            count = int(profile.get("login_count", 1))
            new_hour = float(metadata.get("hour", 12.0))
            profile["avg_login_hour"] = (old_avg * count + new_hour) / (count + 1)

            login_hours = json.loads(profile.get("login_hours_json", "[]"))
            login_hours.append(new_hour)
            login_hours = login_hours[-20:]
            profile["login_hours_json"] = json.dumps(login_hours)

            if len(login_hours) >= 3:
                profile["hour_min"] = float(max(0, min(login_hours) - 1))
                profile["hour_max"] = float(min(23, max(login_hours) + 1))
            else:
                profile["hour_min"] = -1.0
                profile["hour_max"] = -1.0

            profile["login_count"] = count + 1

            day_of_week = metadata.get("day_of_week", 0)
            weekday_counts = json.loads(profile.get("weekday_login_counts_json", "[0,0,0,0,0,0,0]"))
            if len(weekday_counts) == 7:
                weekday_counts[day_of_week] += 1
            else:
                weekday_counts = [0] * 7
                weekday_counts[day_of_week] = 1
            profile["weekday_login_counts_json"] = json.dumps(weekday_counts)

            weekend_logins = weekday_counts[5] + weekday_counts[6]
            profile["typical_weekend"] = weekend_logins >= 2

            last_date = profile.get("last_login_date", "")
            if last_date == today:
                profile["session_count_today"] = int(profile.get("session_count_today", 1)) + 1
            else:
                profile["session_count_today"] = 1
            profile["last_login_date"] = today

            profile["last_login_ip"] = (metadata.get("ip", "") or "")[:45]
            profile["last_login_country"] = (metadata.get("country", "Unknown") or "")[:100]
            profile["last_login_timestamp"] = datetime.utcnow().isoformat()

            resources = json.loads(profile.get("common_resources_json", "[]"))
            resource = metadata.get("resource", "general")
            if resource and resource not in resources:
                resources.append(resource)
            profile["common_resources_json"] = json.dumps(resources)
            
            # Clean up Appwrite internal keys before saving back just in case
            for k in ["$id", "$collectionId", "$databaseId", "$createdAt", "$updatedAt", "$permissions", "tenant_id", "user_id"]:
                profile.pop(k, None)

        await db_service.save_dna_profile(tenant_id, user_id, profile)