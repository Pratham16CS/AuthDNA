import networkx as nx
from typing import Dict, Any, List

ROLE_CLEARANCE = {"viewer": 1, "analyst": 2, "developer": 3, "hr": 3, "manager": 4, "admin": 5}
RESOURCE_SENS = {"general": 1, "dashboard": 1, "profile": 1, "reports": 2, "settings": 3,
                 "billing": 3, "user_management": 4, "api_keys": 4, "financial_data": 4, "admin_panel": 5}
PERMS = {
    "viewer": ["general", "dashboard", "profile"],
    "analyst": ["general", "dashboard", "profile", "reports"],
    "developer": ["general", "dashboard", "profile", "reports", "settings", "api_keys"],
    "hr": ["general", "dashboard", "profile", "reports", "user_management"],
    "manager": ["general", "dashboard", "profile", "reports", "settings", "billing", "user_management"],
    "admin": list(RESOURCE_SENS.keys()),
}


class GraphEngine:
    def __init__(self):
        self.graph = nx.DiGraph()
        for role, resources in PERMS.items():
            for res in resources:
                self.graph.add_edge(role, res, permission="granted")

    def evaluate(self, role, resource, user_history=None):
        role = (role or "viewer").lower()
        resource = (resource or "general").lower()
        user_history = user_history or []
        score = 0.0
        signals = []
        has_perm = self.graph.has_edge(role, resource)
        if not has_perm:
            score += 20
            signals.append(f"No permission for '{resource}'")
            gap = max(0, RESOURCE_SENS.get(resource, 1) - ROLE_CLEARANCE.get(role, 1))
            if gap > 0:
                score += gap * 5
        if resource not in user_history and not has_perm:
            score += 5
            if user_history:
                mx = max(RESOURCE_SENS.get(r, 1) for r in user_history)
                if RESOURCE_SENS.get(resource, 1) - mx >= 2:
                    score += 10
                    signals.append("Lateral movement")
        return {"graph_score": round(min(score, 25.0), 2), "has_permission": has_perm,
                "privilege_gap": max(0, RESOURCE_SENS.get(resource, 1) - ROLE_CLEARANCE.get(role, 1)),
                "lateral_movement": "Lateral movement" in str(signals), "risk_signals": signals}