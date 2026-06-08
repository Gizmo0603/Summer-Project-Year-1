import "./Main.css"; //loading css for styling.
import { useNavigate } from "react-router-dom"; //React Router stuff. Hnadles navigation

function Main() { //React component begins. 
    const navigate = useNavigate(); //Navigation function, used for the onclick stuff below. Allows them to naviagte to specific pages.

    return ( //content to be displayed.
        <div className="main-page">
            <div className="main-container"> 

                <nav className="tab-bar"> 
                    <button onClick={() => navigate("/home")}>Home</button> 
                    <button onClick={() => navigate("/upload")}>Upload</button>
                    <button onClick={() => navigate("/settings")}>Settings</button>
                </nav>

                <h1>TEST WORK</h1> 

            </div>
        </div>
    ); //nav says its navigation links. (Didn't let me comment further up I fear)
}

export default Main;