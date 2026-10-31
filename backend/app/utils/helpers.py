from datetime import datetime, timezone
from typing import Optional

def get_utc_now() -> datetime:
    """Returns timezone-aware UTC datetime."""
    return datetime.now(timezone.utc)

def format_iso_timestamp(dt: Optional[datetime] = None) -> str:
    """Formats a datetime into ISO 8601 string, defaulting to current UTC time."""
    target = dt or get_utc_now()
    return target.isoformat()

def categorize_risk_score(score: int) -> str:
    """Translates numeric composite score (0-100) into alert category."""
    if score >= 75:
        return "Critical"
    elif score >= 55:
        return "High"
    elif score >= 35:
        return "Elevated"
    return "Normal"
