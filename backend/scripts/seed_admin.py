from app.db.session import SessionLocal
from app.models.user import User
from app.models.enums import UserRole
from app.core.security import hash_password

db = SessionLocal()

admin = db.query(User).filter(
    User.email == "admin@justin.com"
).first()

if not admin:

    admin = User(
        email="admin@justin.com",
        password_hash=hash_password("Admin@123"),
        role=UserRole.ADMIN,
        is_active=True,
    )

    db.add(admin)
    db.commit()

    print("✅ Admin created")

else:

    print("Admin already exists")

db.close()