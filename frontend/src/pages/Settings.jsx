import "./Main.css";
import { useNavigate } from "react-router-dom";

function Settings() {
    const navigate = useNavigate();

        const handleLogout = async () => {
            await fetch("https://turbo-doodle-q7jx96v5wp7whxwpx-3000.app.github.dev/logout", {
                method: "POST",
                credentials: "include",
            });

            navigate("/");
        };

    return (
        <div className="main-page">
            <div className="main-container">
                <h1> Settings </h1>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </div> 
        </div>
        );
}

export default Settings;