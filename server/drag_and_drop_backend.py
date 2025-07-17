from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


default_login_members = [
    {"name": "abc", "email": "abc@gmail.com", "id": 1},
    {"name": "dev", "email": "dev@gmail.com", "id": 2},
]


class User(BaseModel):
    name: str
    email: str


@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "query": q}


def getAllUsers():
    with open("./DataBaseJson/UserLogin.json", "w") as f:
        json.dump(default_login_members, f, indent=4)


@app.post("/login")
def login(user: User):
    with open("./DataBaseJson/UserLogin.json", "r+") as f:
        data = json.load(f)
    for users in range(0, len(data)):
        if (data[users]["name"] == user.name) & (data[users]["email"] == user.email):
            return {
                "message": "User",
                "loginUser": user,
                "login": True,
            }
        elif users == len(data) - 1:
            return {"message": "Wrong User", "login": False}


@app.get("/getusers")
def getAllUsers():
    with open("./DataBaseJson/UserLogin.json", "r+") as f:
        data = json.load(f)
    if len(data) != 0:
        return {
            "message": "User",
            "login": True,
            "allUsers": data,
        }
    else:
        return {"allUsers": []}


@app.get("/getalltasks")
def getAllTasks():
    with open("./DataBaseJson/UserBoards.json", "r+") as f:
        data = json.load(f)
    if len(data) != 0:
        return {"message": "User", "login": True, "tasks": data}
    else:
        return {"tasks": []}


class NewTask(BaseModel):
    title: str
    user: str


@app.post("/addnewtask")
def addNewTask(task: NewTask):
    with open("./DataBaseJson/UserBoards.json", "r+") as f:
        data = json.load(f)
        alreadyAdded = False
        for i in range(0, len(data)):
            if data[i]["title"] == task.title:
                alreadyAdded = True
        if alreadyAdded == False:
            data.append(
                {
                    "id": len(data) + 1,
                    "status": "OPEN",
                    "title": task.title,
                    "user": task.user,
                }
            )
            f.seek(0)
            f.truncate()
            json.dump(data, f, indent=4)
            alreadyAdded = False

    if alreadyAdded == False:
        return {
            "taskAdded": True,
            "newTask": {
                "id": len(data) + 1,
                "status": "OPEN",
                "title": task.title,
                "user": task.user,
            },
            "alreadyAdded": False,
        }
    elif alreadyAdded == True:
        return {"taskAdded": False, "alreadyAdded": True}
    else:
        return {"taskAdded": False, "alreadyAdded": False}


class ChangeStatus(BaseModel):
    status: str
    id: int


@app.post("/changestatus")
def changeStatus(status: ChangeStatus):
    with open("./DataBaseJson/UserBoards.json", "r+") as f:
        data = json.load(f)
        data[status.id - 1] = {
            "id": status.id,
            "status": status.status,
            "title": data[status.id - 1]["title"],
            "user": data[status.id - 1]["user"],
        }
        f.seek(0)
        f.truncate()
        json.dump(data, f, indent=4)

    if len(data) > 0:
        return {
            "statusChanged": True,
            "newStatus": {
                "id": status.id,
                "status": status.status,
                "title": data[status.id - 1]["title"],
                "user": data[status.id - 1]["user"],
            },
        }
    else:
        return {"statusChanged": False}


class DeleteTask(BaseModel):
    id: int


@app.post("/deletetask")
def deleteTask(task: DeleteTask):
    with open("./DataBaseJson/UserBoards.json", "r+") as f:
        data = json.load(f)
        newData = []
        deleted = False
        new_id = 1

        for item in data:
            if item["id"] != task.id:
                item["id"] = new_id
                newData.append(item)
                new_id += 1
            else:
                deleted = True

        f.seek(0)
        f.truncate()
        json.dump(newData, f, indent=4)

    if deleted:
        return {"deletedTask": True, "tasks": newData}
    else:
        return {"deletedTask": False}
