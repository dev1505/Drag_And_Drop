import { useEffect, useState } from 'react';
import Login from './Components/Login';
import Logout from './Components/Logout';

const STATUSES = ["OPEN", "IN_PROGRESS", "ClOSED"];

function App() {

  const [issues, setIssues] = useState([]);

  // [
  //   { id: 1, title: "Fix login bug", status: "OPEN" },
  //   { id: 2, title: "Design UI", status: "IN_PROGRESS" },
  //   { id: 3, title: "Write tests", status: "ClOSED" },
  // ]

  const [user, setUser] = useState({ currentUser: "", allUsers: [], selectedUser: "" });
  const [login, setLogin] = useState(localStorage.getItem("token") ? true : false);
  const [draggedIssueId, setDraggedIssueId] = useState(null);

  const handleDragStart = (id) => {
    setDraggedIssueId(id);
  };

  async function changeStatus(status) {
    try {
      const response = await fetch("http://127.0.0.1:8000/changestatus", {
        method: "POST",
        body: JSON.stringify({
          id: draggedIssueId,
          status: status,
        }),
        headers: {
          "Content-Type": "application/json"
        },
      })
      const data = await response.json();
      if (data?.statusChanged) {
        return true;
      }
      else {
        alert("Task Not Added");
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  const handleDrop = (status) => {
    if (changeStatus(status)) {
      setIssues((prev) =>
        prev.map((issue) => {
          const returnData = issue.id === draggedIssueId ? { ...issue, status } : issue;
          return returnData;
        }
        )
      );
      setDraggedIssueId(null);
    }
  };

  async function addNewTask() {
    try {
      const response = await fetch("http://127.0.0.1:8000/addnewtask", {
        method: "POST",
        body: JSON.stringify({
          user: user?.currentUser,
          title: document.getElementById("addTask").value,
        }),
        headers: {
          "Content-Type": "application/json"
        },
      })
      const data = await response.json();
      if (data?.taskAdded && !data?.alreadyAdded) {
        setIssues([...issues, data?.newTask]);
        alert("Task Added Successfully");
      }
      else if (data?.alreadyAdded) {
        alert("Task Already Exists");
      }
      else {
        alert("Task Not Added");
      }
      document.getElementById("addTask").value = "";
    } catch (error) {
      console.log(error);
    }
  }

  async function getUsers() {
    const response = await fetch("http://127.0.0.1:8000/getusers", {
      method: "GET",
    });

    const data = await response.json();
    if (data?.allUsers?.length > 0) {
      console.log(data, "jdbfjdf")
      setUser({ ...user, allUsers: data?.allUsers, currentUser: JSON.parse(localStorage.getItem("token"))?.name, selectedUser: JSON.parse(localStorage.getItem("token"))?.name });
    }
  }

  async function getAllTasks() {
    const response = await fetch("http://127.0.0.1:8000/getalltasks", {
      method: "GET",
    });

    const data = await response.json();
    if (data?.tasks?.length > 0) {
      setIssues(data?.tasks)
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch("http://127.0.0.1:8000/deletetask", {
        method: "POST",
        body: JSON.stringify({
          id: id
        }),
        headers: {
          "Content-Type": "application/json"
        },
      })
      const data = await response.json();
      if (data?.deletedTask) {
        setIssues(data?.tasks);
        alert("Task Deleted Successfully");
      }
      else {
        alert("Task Not Deleted");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (login) {
      getUsers();
      getAllTasks();
    }
  }, [login])

  const allowDrop = (e) => e.preventDefault();

  return (
    <>
      {
        localStorage?.getItem("token") ? (
          <>
            <h2 style={{ marginInlineStart: "3%" }}>DashBoard</h2>
            <div style={{ display: "flex", justifyContent: "center", padding: "20px", gap: "10px", scale: "1.2" }}>
              <input type="text" id="addTask" />
              <button
                onClick={(e) => {
                  if (document.getElementById("addTask").value !== "") {
                    addNewTask();
                  }
                }}
              >Add Task</button>
            </div>
            {
              user?.allUsers?.length > 0 && (
                <div style={{ display: "flex", justifyContent: "center", padding: "20px", gap: "10px", scale: "1.2" }}>
                  User - <select
                    name="user"
                    id="user"
                    onChange={(e) => {
                      setUser({ ...user, selectedUser: e?.target?.value })
                    }}>
                    <option value="all">all</option>
                    {
                      user?.allUsers?.map((data, index) => {
                        return (
                          <option value={data?.name} key={index} selected={data?.name === user?.currentUser ? true : false}>{data?.name}</option>
                        )
                      })
                    }
                  </select>
                </div>
              )
            }
            < div style={{ display: "flex", justifyContent: "space-around", padding: "20px" }
            }>
              {
                STATUSES.map((status) => (
                  <div
                    key={status}
                    onDrop={() => handleDrop(status)}
                    onDragOver={allowDrop}
                    style={{
                      width: "30%",
                      minHeight: "400px",
                      padding: "10px",
                      backgroundColor: "#f4f4f4",
                      border: "2px dashed #ccc",
                      borderRadius: "8px"
                    }}
                  >
                    <h3>{status.replace("_", " ")}</h3>
                    {issues?.length > 0 && issues?.filter((i) => i?.status === status)?.map((issue, index) => {
                      if (issue?.user === user?.selectedUser || user?.selectedUser === "all") {
                        return (
                          < div
                            key={index}
                            draggable={(issue?.user === user?.currentUser) ? true : false}
                            onDragStart={() => handleDragStart(issue?.id)}
                            style={{
                              padding: "10px",
                              marginBottom: "10px",
                              backgroundColor: "white",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              cursor: (issue?.user === user?.currentUser) ? "grab" : "not-allowed",
                              display: "flex",
                              justifyContent: "space-between"
                            }}
                          >
                            {issue?.title} - user({issue?.user})
                            {issue?.user === user?.currentUser &&
                              (<button onClick={() => { deleteTask(issue?.id) }}> Delete</button>)
                            }
                          </div>
                        )
                      }
                    })}
                  </div>
                ))
              }
            </div >
          </>) : (
          <Login login={login} setLogin={setLogin} user={user} setUser={setUser} />)
      }
      {login && <Logout login={login} setLogin={setLogin} />}
    </>
  );
}

export default App;
