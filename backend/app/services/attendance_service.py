from datetime import date, datetime
import os
import shutil

from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session

from app.ai.comparator import compare_faces
from app.models.attendance import Attendance
from app.repositories.attendance_repository import AttendanceRepository
from app.repositories.employee_repository import EmployeeRepository


class AttendanceService:

    def __init__(self, db: Session):
        self.db = db
        self.employee_repo = EmployeeRepository(db)
        self.attendance_repo = AttendanceRepository(db)

    def check_in(self, employee_id: int, image: UploadFile):

        # 1. Fetch employee
        employee = self.employee_repo.get_by_id(employee_id)

        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Employee not found"
            )

        # 🔒 STEP 4: DUPLICATE CHECK-IN PROTECTION
        # Prevent check-in if attendance was already marked today
        today = self.attendance_repo.get_today(employee.id)
        if today:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Attendance already marked today"
            )

        # Ensure temp upload folder exists
        os.makedirs("uploads/profiles", exist_ok=True)

        # Save temporary image file for face comparison
        image_path = f"uploads/profiles/temp_{employee.employee_code}.jpg"

        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        encoding_path = f"uploads/encodings/{employee.employee_code}.pkl"

        # Check face matching
        matched = compare_faces(image_path, encoding_path)

        # Always cleanup temp image file after comparison
        if os.path.exists(image_path):
            os.remove(image_path)

        if not matched:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Face does not match"
            )

        # Create new attendance record
        attendance = Attendance(
            employee_id=employee.id,
            date=date.today(),
            check_in=datetime.now(),
            status="Present"
        )

        self.attendance_repo.create(attendance)

        return {
            "message": "Attendance marked",
            "employee": employee.full_name
        }

    def check_out(self, employee_id: int):

        attendance = self.attendance_repo.get_today(employee_id)

        if not attendance:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No attendance found for today"
            )

        if attendance.check_out:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Already checked out"
            )

        attendance.check_out = datetime.now()

        self.attendance_repo.update(attendance)

        return {
            "message": "Checked out successfully"
        }

    def get_employee_history(self, employee_id: int):

        employee = self.employee_repo.get_by_id(employee_id)

        if not employee:
            raise HTTPException(
                status_code=404,
                detail="Employee not found"
            )

        return self.attendance_repo.get_by_employee(employee_id)


    def dashboard(self):

        return {
            "attendance_today": self.attendance_repo.total_attendance_today(),
            "present": self.attendance_repo.total_present()
        }


    def monthly_report(self, employee_id: int, month: int, year: int):

        employee = self.employee_repo.get_by_id(employee_id)

        if not employee:
            raise HTTPException(
                status_code=404,
                detail="Employee not found"
            )

        return self.attendance_repo.monthly_report(
            employee_id,
            month,
            year,
        )

    
    
    