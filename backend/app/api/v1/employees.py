from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.employee import (
    EmployeeCreate,
    EmployeeResponse,
)
from app.services.employee_service import EmployeeService
from app.schemas.employee import EmployeeUpdate

from fastapi import UploadFile, File

router = APIRouter(
    prefix="/employees",
    tags=["Employees"],
)


@router.post(
    "",
    response_model=EmployeeResponse,
)
def create_employee(
    request: EmployeeCreate,
    db: Session = Depends(get_db),
):

    service = EmployeeService(db)

    return service.create_employee(request)


@router.get("", response_model=list[EmployeeResponse])
def get_all_employees(
    db: Session = Depends(get_db),
):
    service = EmployeeService(db)
    return service.get_all()


@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
):
    service = EmployeeService(db)
    return service.get_by_id(employee_id)

@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: int,
    request: EmployeeUpdate,
    db: Session = Depends(get_db),
):
    service = EmployeeService(db)
    return service.update_employee(employee_id, request)


@router.delete("/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
):
    service = EmployeeService(db)
    return service.delete_employee(employee_id)

@router.post("/{employee_id}/register-face")
def register_face(
    employee_id: int,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    service = EmployeeService(db)

    return service.register_face(employee_id, image)