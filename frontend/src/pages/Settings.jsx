import "./Main.css";
import { useNavigate } from "react-router-dom";

function Settings() {
    const navigate = useNavigate();

        const handleLogout = async () => {
            await fetch("https://miniature-spoon-g4jp56xvgxgqfwvj-3000.app.github.dev/logout", {
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