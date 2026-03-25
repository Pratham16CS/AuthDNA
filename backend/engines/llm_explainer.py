import logging
import asyncio
from config.settings import settings

logger = logging.getLogger(__name__)


class LLMExplainer:
    def __init__(self):
        self._client = None

    def _get_client(self):
        if self._client is None and settings.mistral_api_key:
            try:
                from mistralai import Mistral
                self._client = Mistral(api_key=settings.mistral_api_key)
            except Exception:
                pass
        return self._client

    async def explain(self, score, decision, risk_factors, country, city, hour, dna_match, is_new_user):
        c = self._get_client()
        if c:
            try:
                ft = "; ".join(f"{f['factor']}(+{f['contribution']})" for f in risk_factors[:5])
                prompt = (f"Security analyst: ONE sentence, max 30 words. Score:{score}/100 Decision:{decision} "
                          f"Country:{country} Hour:{hour} DNA:{dna_match}% New:{is_new_user} Factors:{ft}")
                def call():
                    return c.chat.complete(model="mistral-tiny", messages=[{"role": "user", "content": prompt}],
                                           max_tokens=60, temperature=0.3).choices[0].message.content.strip()
                return await asyncio.wait_for(asyncio.to_thread(call), timeout=5.0)
            except Exception as e:
                logger.warning(f"LLM failed: {e}")
        level = "Low" if score < 30 else "Medium" if score < 60 else "High"
        parts = [f"{level}-risk login"]
        names = [f["factor"] for f in risk_factors]
        if is_new_user: parts.append("first-time user")
        if "new_device" in names: parts.append("unknown device")
        if "new_country" in names: parts.append(f"from {country}")
        if "impossible_travel" in names: parts.append("impossible travel")
        if "off_hours" in names: parts.append(f"at {hour}:00")
        if dna_match > 80: parts.append(f"DNA {dna_match}%")
        return ": ".join([parts[0], ", ".join(parts[1:]) or "no anomalies"]) + "."