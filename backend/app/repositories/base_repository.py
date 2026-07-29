from typing import Generic, TypeVar

from sqlalchemy.orm import Session

ModelType = TypeVar("ModelType")


class BaseRepository(Generic[ModelType]):

    def __init__(self, model, db: Session):
        self.model = model
        self.db = db

    def get(self, id: int):

        return self.db.get(
            self.model,
            id,
        )

    def get_all(self):

        return self.db.query(
            self.model
        ).all()

    def create(self, obj):

        self.db.add(obj)

        self.db.commit()

        self.db.refresh(obj)

        return obj

    def update(self):

        self.db.commit()

    def delete(self, obj):

        self.db.delete(obj)

        self.db.commit()