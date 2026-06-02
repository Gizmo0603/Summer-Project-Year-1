import "./Main.css";
import { useNavigate } from "react-router-dom";

function Main() {
    const navigate = useNavigate();

    return (
        <div className="main-page">
            <div className="main-container">
                <h1>TEST WORK</h1>

                <div className="layout">
                    <nav>
                        <button onClick={() => navigate("/home")}>Home</button>
                        <button onClick={() => navigate("/upload")}>Upload</button>
                        <button onClick={() => navigate("/settings")}>Settings</button>
                    </nav>
                </div>
                
            </div>
        </div>
    );
}

export default Main;