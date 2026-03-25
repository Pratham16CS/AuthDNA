import logging
import numpy as np
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)


class ShapExplainer:
    def __init__(self, ml_engine):
        self._ml = ml_engine
        self._exp = None

    def explain(self, features, feature_names):
        try:
            if self._exp is None and self._ml.is_loaded:
                import shap
                self._exp = shap.TreeExplainer(self._ml.xgboost_model)
            if self._exp is None:
                return None
            X = self._ml.scaler.transform(features.reshape(1, -1))
            sv = self._exp.shap_values(X)
            if isinstance(sv, list):
                sv = sv[1]
            return {n: round(float(v), 4) for n, v in zip(feature_names, sv[0])}
        except Exception:
            return None