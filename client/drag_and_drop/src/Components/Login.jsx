import { useState } from "react";

const Login = ({ login, setLogin, user, setUser }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: ""
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data?.login) {
                setLogin(data?.login);
                localStorage.setItem("token", JSON.stringify(data?.loginUser));
                alert("User " + data?.loginUser?.name + " Logged in Successfully");
            }
            else {
                setLogin(data?.login);
                alert(data?.message);
            }
        } catch (error) {
            alert("Some Error");
        }
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f5f5f5"
        }}>
            <form onSubmit={handleSubmit} style={{
                padding: "30px",
                borderRadius: "10px",
                backgroundColor: "#fff",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                width: "300px"
            }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>

                <div style={{ marginBottom: "15px" }}>
                    <label>Name:</label><br />
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                            borderRadius: "5px",
                            border: "1px solid #ccc"
                        }}
                        required
                    />
                </div>

                <div style={{ marginBottom: "20px" }}>
                    <label>Email:</label><br />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                            borderRadius: "5px",
                            border: "1px solid #ccc"
                        }}
                        required
                    />
                </div>

                <button type="submit" style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Login;
