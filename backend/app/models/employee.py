from datetime import date

from sqlalchemy import (
    Boolean,
    Date,
    ForeignKey,
    String,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.models.base_model import BaseModel


class Employee(BaseModel):

    __tablename__ = "employees"

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        unique=True,
    )

    employee_code: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        index=True,
    )

    full_name: Mapped[str] = mapped_column(
        String(100),
    )

    phone: Mapped[str] = mapped_column(
        String(20),
    )

    designation: Mapped[str] = mapped_column(
        String(100),
    )

    department_id: Mapped[int] = mapped_column(
        ForeignKey("departments.id"),
    )

    joining_date: Mapped[date] = mapped_column(
        Date,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
    )

    face_registered: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    profile_image: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    face_encoding: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    user = relationship("User")

    department = relationship("Department")