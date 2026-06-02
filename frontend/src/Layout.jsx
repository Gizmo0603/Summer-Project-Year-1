import { Outlet, useNavigate } from "react-router-dom";

function Layout() {
    const navigate = useNavigate();

    return (
        <div className="app-layout">
            <nav className="navbar">
                <button onClick={() => navigate("/home")}>Home</button>
                <button onClick={() => navigate("/upload")}>Upload</button>
                <button onClick={() => navigate("/settings")}>Settings</button>
            </nav>

            <div className="page-content">
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;