from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Get database path from Railway volume or use local
DB_PATH = os.environ.get("RAILWAY_VOLUME_MOUNT_PATH", "./")
DATABASE_URL = f"sqlite:///{DB_PATH}/tasks.db"

# Create engine with SQLite settings
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()