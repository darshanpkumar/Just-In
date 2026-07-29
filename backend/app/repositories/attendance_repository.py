from sqlalchemy.orm import Session

from app.models.attendance import Attendance

from datetime import date

from sqlalchemy import func
from datetime import date

from sqlalchemy import extract


class AttendanceRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, attendance: Attendance):
        self.db.add(attendance)
        self.db.commit()
        self.db.refresh(attendance)
        return attendance

    def get_today(self, employee_id: int):

        return (
            self.db.query(Attendance)
            .filter(
                Attendance.employee_id == employee_id,
                Attendance.date == date.today()
            )
            .first()
        )

    def update(self, attendance):

        self.db.commit()

        self.db.refresh(attendance)

        return attendance

    def get_by_employee(self, employee_id: int):

        return (
            self.db.query(Attendance)
            .filter(Attendance.employee_id == employee_id)
            .order_by(Attendance.date.desc())
            .all()
        )

    def total_attendance_today(self):

        return (
            self.db.query(Attendance)
            .filter(Attendance.date == date.today())
            .count()
        )

    def total_present(self):

        return (
            self.db.query(Attendance)
            .filter(Attendance.status == "Present")
            .count()
        )

    def monthly_report(self, employee_id: int, month: int, year: int):

        return (
            self.db.query(Attendance)
            .filter(
                Attendance.employee_id == employee_id,
                extract("month", Attendance.date) == month,
                extract("year", Attendance.date) == year,
            )
            .all()
        )

    