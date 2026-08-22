"""Configuration handling for ApiSpy."""

import json
import os
from dataclasses import dataclass, field


@dataclass
class Config:
 name: str = "ApiSpy"
 enabled: bool = True
 verbose: bool = False
 timeout: int = 30
 retries: int = 3
 extra: dict = field(default_factory=dict)

 @classmethod
 def from_file(cls, path):
 with open(path, "r", encoding="utf-8") as fh:
 data = json.load(fh)
 return cls(**{k: v for k, v in data.items() if k in cls.__dataclass_fields__})

 @classmethod
 def from_env(cls):
 cfg = cls()
 cfg.verbose = os.getenv("VERBOSE", "0") == "1"
 cfg.timeout = int(os.getenv("TIMEOUT", "30"))
 cfg.retries = int(os.getenv("RETRIES", "3"))
 return cfg