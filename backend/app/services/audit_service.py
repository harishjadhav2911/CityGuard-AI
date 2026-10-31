from sqlalchemy.orm import Session
from datetime import datetime
from app.models.audit_log import AuditLog

class AuditService:
    @staticmethod
    def log_event(
        db: Session,
        actor: str,
        action: str,
        category: str = "SYSTEM",
        details: str = "",
        severity: str = "INFO"
    ) -> AuditLog:
        log_entry = AuditLog(
            category=category,
            actor=actor,
            action=action,
            details=details,
            severity=severity,
            timestamp=datetime.utcnow()
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        return log_entry
