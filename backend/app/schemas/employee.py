from datetime import date
from pydantic import BaseModel


class EmployeeCreate(BaseModel):
    email: str
    password: str
    employee_code: str
    full_name: str
    phone: str
    designation: str
    department_id: int
    joining_date: date


class EmployeeUpdate(BaseModel):
    full_name: str
    phone: str
    designation: str
    department_id: int


class EmployeeResponse(BaseModel):
    id: int
    employee_code: str
    full_name: str
    phone: str
    designation: str

    class Config:
        from_attributes = True