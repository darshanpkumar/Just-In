from datetime import date, datetime
from sqlalchemy import ForeignKey, Date, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base_model import BaseModel


class Attendance(BaseModel):

    __tablename__ = "attendance"

    employee_id: Mapped[int] = mapped_column(
        ForeignKey("employees.id")
    )

    date: Mapped[date] = mapped_column(Date)

    check_in: Mapped[datetime] = mapped_column(DateTime)

    check_out: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="Present"
    )

    employee = relationship("Employee")