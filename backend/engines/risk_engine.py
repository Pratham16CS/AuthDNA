W_XGB, W_RF, W_IF, W_DNA, W_GRAPH = 0.35, 0.30, 0.15, 0.15, 0.05


class RiskEngine:
    def evaluate(self, ml_scores, dna_match, graph_score, flags, failed_attempts, feature_dict):
        xgb = ml_scores.get("xgboost_score", 50)
        rf = ml_scores.get("random_forest_score", 50)
        iso = ml_scores.get("isolation_forest_score", 50)
        dr = 100 - dna_match
        raw = xgb * W_XGB + rf * W_RF + iso * W_IF + dr * W_DNA + graph_score * W_GRAPH
        overrides = []
        if flags.get("impossible_travel"):
            raw = max(raw, 70); overrides.append("impossible_travel→70")
        fn = feature_dict.get("failed_norm", 0)
        if fn >= 0.5:
            raw = max(raw, 80); overrides.append("5+failed→80")
        elif fn >= 0.3:
            raw = max(raw, 50); overrides.append("3+failed→50")
        if flags.get("multi_attack_flag"):
            raw = max(raw, 75); overrides.append("multi_attack→75")
        score = round(min(max(raw, 0), 100), 1)
        if score < 30: dec = "ALLOW"
        elif score < 60: dec = "OTP"
        elif score < 80: dec = "STEPUP"
        else: dec = "BLOCK"
        factors = []
        if xgb > 30: factors.append({"factor": "ml_xgboost", "contribution": round(xgb*W_XGB,1), "description": f"XGBoost: {xgb}%"})
        if rf > 30: factors.append({"factor": "ml_rf", "contribution": round(rf*W_RF,1), "description": f"RF: {rf}%"})
        if dr > 20: factors.append({"factor": "dna_mismatch", "contribution": round(dr*W_DNA,1), "description": f"DNA match: {dna_match}%"})
        elif dna_match > 80: factors.append({"factor": "known_behavior", "contribution": round(-dna_match*W_DNA,1), "description": f"DNA: {dna_match}%"})
        if graph_score > 0: factors.append({"factor": "privilege", "contribution": round(graph_score*W_GRAPH,1), "description": f"Graph: {graph_score}"})
        if flags.get("new_device"): factors.append({"factor": "new_device", "contribution": 15.0, "description": "New device"})
        if flags.get("country_change"): factors.append({"factor": "new_country", "contribution": 20.0, "description": "New country"})
        if flags.get("impossible_travel"): factors.append({"factor": "impossible_travel", "contribution": 25.0, "description": "Impossible travel"})
        if flags.get("is_offhours"): factors.append({"factor": "off_hours", "contribution": 5.0, "description": "Off-hours"})
        if flags.get("multi_attack_flag"): factors.append({"factor": "multi_attack", "contribution": 15.0, "description": "3+ signals"})
        for o in overrides: factors.append({"factor": "override", "contribution": 0, "description": o})
        factors.sort(key=lambda x: abs(x["contribution"]), reverse=True)
        return {"score": score, "decision": dec, "risk_factors": factors}