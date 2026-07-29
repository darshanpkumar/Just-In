from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.attendance import AttendanceResponse
from app.services.attendance_service import AttendanceService

router = APIRouter()


@router.post(
    "/{employee_id}/check-in",
    response_model=AttendanceResponse
)
def check_in(
    employee_id: int,
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    service = AttendanceService(db)

    return service.check_in(employee_id, image)

@router.put("/{employee_id}/check-out")
def check_out(
    employee_id: int,
    db: Session = Depends(get_db)
):

    service = AttendanceService(db)

    return service.check_out(employee_id)


@router.get("/{employee_id}/history")
def get_employee_history(
    employee_id: int,
    db: Session = Depends(get_db)
):

    service = AttendanceService(db)

    return service.get_employee_history(employee_id)


@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db)
):

    service = AttendanceService(db)

    return service.dashboard()


@router.get("/{employee_id}/monthly-report")
def monthly_report(
    employee_id: int,
    month: int,
    year: int,
    db: Session = Depends(get_db)
):

    service = AttendanceService(db)

    return service.monthly_report(
        employee_id,
        month,
        year,
    )