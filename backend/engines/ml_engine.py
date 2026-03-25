import os
import json
import logging
import numpy as np
import joblib

logger = logging.getLogger(__name__)
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "models")


class MLEngine:
    def __init__(self):
        self.isolation_forest = self.xgboost_model = self.random_forest = self.scaler = None
        self.meta = {}
        self._loaded = False

    def load_models(self):
        try:
            self.scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))
            self.isolation_forest = joblib.load(os.path.join(MODEL_DIR, "iso_forest.pkl"))
            self.xgboost_model = joblib.load(os.path.join(MODEL_DIR, "xgb_model.pkl"))
            self.random_forest = joblib.load(os.path.join(MODEL_DIR, "rf_model.pkl"))
            mp = os.path.join(MODEL_DIR, "model_meta.json")
            if os.path.exists(mp):
                with open(mp) as f:
                    self.meta = json.load(f)
            self._loaded = True
            logger.info("✅ ML models loaded (version=%s)", self.meta.get("version", "?"))
        except Exception as e:
            logger.error(f"❌ Model loading error: {e}")
            self._loaded = False

    @property
    def is_loaded(self):
        return self._loaded

    def predict(self, features):
        if not self._loaded:
            return {"xgboost_score": 50.0, "random_forest_score": 50.0,
                    "isolation_forest_score": 50.0, "ensemble_score": 50.0}
        X = self.scaler.transform(features.reshape(1, -1))
        raw_if = self.isolation_forest.decision_function(X)[0]
        if_score = float(np.clip((0.5 - raw_if) * 100, 0, 100))
        xgb = round(float(self.xgboost_model.predict_proba(X)[0][1]) * 100, 2)
        rf = round(float(self.random_forest.predict_proba(X)[0][1]) * 100, 2)
        ens = xgb * 0.60 + rf * 0.20 + if_score * 0.20
        return {"xgboost_score": xgb, "random_forest_score": rf,
                "isolation_forest_score": round(if_score, 2), "ensemble_score": round(ens, 2)}