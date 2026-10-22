"""Load the i18n apply helper as a module from a driver script.

import importlib.util, sys
spec = importlib.util.spec_from_file_location("i18n_apply", "scripts/i18n-apply.py")
ia = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = ia
spec.loader.exec_module(ia)
"""

from __future__ import annotations

import importlib.util
import pathlib
import sys

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent


def load_i18n_apply():
    spec = importlib.util.spec_from_file_location("i18n_apply", REPO_ROOT / "scripts" / "i18n-apply.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module
