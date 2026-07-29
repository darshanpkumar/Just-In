from pydantic import BaseModel


class AttendanceResponse(BaseModel):
    message: str
    employee: str