import "./Main.css";
import { useNavigate } from "react-router-dom";

function Settings() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch("/api/logout", {
                method: "POST",
                credentials: "include"
            });

            navigate("/");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <div className="main-page">
            <div className="main-container">
                <h1>Settings</h1>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Settings;