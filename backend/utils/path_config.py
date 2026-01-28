from pathlib import Path

# Absolute project root (D:/AISMADV)
PROJECT_ROOT = Path(__file__).resolve().parents[1]

# Data directories
DATA_DIR = PROJECT_ROOT / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PRICE_DATA_DIR = RAW_DATA_DIR / "prices"
METADATA_DIR = DATA_DIR / "metadata"

# Create directories if they do not exist
DATA_DIR.mkdir(exist_ok=True)
RAW_DATA_DIR.mkdir(exist_ok=True)
PRICE_DATA_DIR.mkdir(parents=True, exist_ok=True)
METADATA_DIR.mkdir(parents=True, exist_ok=True)
