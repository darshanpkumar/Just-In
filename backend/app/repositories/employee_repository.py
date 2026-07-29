from sqlalchemy.orm import Session

from app.models.employee import Employee
from app.repositories.base_repository import BaseRepository


class EmployeeRepository(BaseRepository[Employee]):

    def __init__(self, db: Session):
        super().__init__(Employee, db)

    def get_by_code(self, code: str):
        return (
            self.db.query(Employee)
            .filter(Employee.employee_code == code)
            .first()
        )

    def get_all(self):
        return (
            self.db.query(Employee)
            .filter(Employee.is_active == True)
            .all()
        )

    def get_by_id(self, employee_id: int):
        return (
            self.db.query(Employee)
            .filter(Employee.id == employee_id)
            .first()
        )

    def update(self, employee: Employee):
        self.db.commit()
        self.db.refresh(employee)
        return employee


    def soft_delete(self, employee: Employee):
        employee.is_active = False
        self.db.commit()