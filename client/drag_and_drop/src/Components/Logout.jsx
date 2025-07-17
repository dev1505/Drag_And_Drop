
const Logout = ({ login, setLogin }) => {

    let userData;
    const handleLogout = async () => {
        console.log("Logged out!");
        if (login) {
            localStorage.removeItem("token");
            await setLogin(false);
            alert("User Logged Out Successfully");
        }
    };

    if (login) {
        userData = JSON.parse(localStorage.getItem("token"));
    }

    return (
        <div style={{
            position: "fixed",
            top: "10px",
            right: "20px",
            zIndex: 1000
        }}>
            <button
                onClick={handleLogout}
                style={{
                    padding: "8px 16px",
                    backgroundColor: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
            >
                Logout - {userData?.name}
            </button>
        </div>
    );
};

export default Logout;
