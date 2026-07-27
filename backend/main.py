from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os

import models
from database import engine, get_db
from schemas import TaskCreate, TaskUpdate, TaskResponse
import crud

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Task Manager API",
    version="1.0.0",
    description="A simple task management API"
)

# CORS middleware - Allow all origins (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
def root():
    return {
        "message": "Task Manager API is running!",
        "status": "healthy",
        "database": os.environ.get("RAILWAY_VOLUME_MOUNT_PATH", "local")
    }

# Create a new task
@app.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    # Validate: title cannot be empty
    if not task.title or not task.title.strip():
        raise HTTPException(
            status_code=400,
            detail="Task title cannot be empty"
        )
    return crud.create_task(db, task)

# Get all tasks
@app.get("/tasks", response_model=List[TaskResponse])
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tasks = crud.get_tasks(db, skip=skip, limit=limit)
    return tasks

# Get a single task by ID
@app.get("/tasks/{task_id}", response_model=TaskResponse)
def read_task(task_id: int, db: Session = Depends(get_db)):
    db_task = crud.get_task(db, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

# Update a task
@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db)):
    db_task = crud.update_task(db, task_id, task_update)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

# Delete a task
@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = crud.delete_task(db, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return None