import os
import shutil
from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException, status

from app.core.security import hash_password
from app.models.department import Department
from app.models.employee import Employee
from app.models.enums import UserRole
from app.models.user import User
from app.repositories.employee_repository import EmployeeRepository
from app.repositories.user_repository import UserRepository
from app.schemas.employee import EmployeeCreate
from app.ai.face_service import save_face_encoding


class EmployeeService:

    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.employee_repo = EmployeeRepository(db)

    def create_employee(self, request: EmployeeCreate):

        # 1. Check existing email
        existing_user = self.user_repo.get_by_email(request.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists."
            )

        # 2. Check existing department
        dept = self.db.get(Department, request.department_id)
        if not dept:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Department with ID {request.department_id} does not exist."
            )

        # 3. Create User
        user = User(
            email=request.email,
            password_hash=hash_password(request.password),
            role=UserRole.EMPLOYEE,
            is_active=True,
        )

        self.db.add(user)
        self.db.flush()

        # 4. Create Employee
        employee = Employee(
            user_id=user.id,
            employee_code=request.employee_code,
            full_name=request.full_name,
            phone=request.phone,
            designation=request.designation,
            department_id=request.department_id,
            joining_date=request.joining_date,
            is_active=True,
        )

        self.db.add(employee)
        self.db.commit()
        self.db.refresh(employee)

        return employee

    def get_all(self):
        return self.employee_repo.get_all()

    def get_by_id(self, employee_id: int):
        return self.employee_repo.get_by_id(employee_id)

    def update_employee(self, employee_id: int, request):
        employee = self.employee_repo.get_by_id(employee_id)
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found"
            )

        employee.full_name = request.full_name
        employee.phone = request.phone
        employee.designation = request.designation
        employee.department_id = request.department_id

        return self.employee_repo.update(employee)

    def delete_employee(self, employee_id: int):
        employee = self.employee_repo.get_by_id(employee_id)
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found"
            )

        self.employee_repo.soft_delete(employee)
        return {"message": "Employee deleted successfully"}

    def register_face(self, employee_id: int, image: UploadFile):
        employee = (
            self.db.query(Employee)
            .filter(Employee.id == employee_id)
            .first()
        )

        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found"
            )

        # Ensure upload folders exist
        profiles_dir = os.path.join("uploads", "profiles")
        encodings_dir = os.path.join("uploads", "encodings")
        os.makedirs(profiles_dir, exist_ok=True)
        os.makedirs(encodings_dir, exist_ok=True)

        image_path = os.path.join(profiles_dir, f"{employee.employee_code}.jpg")
        encoding_path = os.path.join(encodings_dir, f"{employee.employee_code}.pkl")

        # Save image file to disk
        image.file.seek(0)
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        # Process face encoding
        success = save_face_encoding(
            image_path=image_path,
            encoding_path=encoding_path,
        )

        if not success:
            if os.path.exists(image_path):
                os.remove(image_path)

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Face detection failed. Ensure the image contains exactly one clear face.",
            )

        # Save updates to database
        employee.face_registered = True
        employee.profile_image = image_path
        employee.face_encoding = encoding_path

        self.db.commit()
        self.db.refresh(employee)

        return {
            "message": f"Face registered successfully for {employee.full_name}",
            "employee_id": employee.id,
            "face_registered": True,
            "profile_image": image_path,
        }