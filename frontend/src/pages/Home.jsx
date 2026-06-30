import "./Main.css";
import { useEffect, useState } from "react";

function Home() {
    const [username, setUsername] = useState(null);
    const [files, setFiles] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/me", {
                    credentials: "include"
                });

                const data = await res.json();

                if (data.loggedIn) {
                    setUsername(data.username);
                }
            } catch (err) {
                console.error(err);
            }
        };

        const fetchFiles = async () => {
            try {
                const res = await fetch("/api/files", {
                    credentials: "include"
                });

                const data = await res.json();
                setFiles(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUser();
        fetchFiles();
    }, []);

    return (
        <div className="main-page">
            <div className="main-container">

                <h1>
                    {username ? `Hello ${username}` : "Loading..."}
                </h1>

                {/* FILE GRID */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: "10px",
                    marginTop: "20px"
                }}>
                    {files.map(file => (
                        <div
                            key={file.id}
                            onClick={() => setSelected(file)}
                            style={{
                                border: "1px solid #ccc",
                                padding: "5px",
                                cursor: "pointer"
                            }}
                        >
                            <img
                                src={`/uploads/${file.filename}`}
                                style={{
                                    width: "100%",
                                    height: "100px",
                                    objectFit: "cover"
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* FULLSCREEN MODAL */}
                {selected && (
                    <div
                        onClick={() => setSelected(null)}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "rgba(0,0,0,0.8)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <img
                            onClick={(e) => e.stopPropagation()}
                            src={`/uploads/${selected.filename}`}
                            style={{
                                maxWidth: "90%",
                                maxHeight: "80%"
                            }}
                        />

                        {/* DELETE BUTTON */}
                        <button
                            onClick={async (e) => {
                                e.stopPropagation();

                                try {
                                    await fetch(`/api/files/${selected.id}`, {
                                        method: "DELETE",
                                        credentials: "include"
                                    });

                                    // remove from UI
                                    setFiles(prev =>
                                        prev.filter(f => f.id !== selected.id)
                                    );

                                    // close modal
                                    setSelected(null);

                                } catch (err) {
                                    console.error("Delete failed:", err);
                                }
                            }}
                            style={{
                                marginTop: "15px",
                                padding: "10px 20px",
                                background: "red",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                                borderRadius: "5px"
                            }}
                        >
                            Delete
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Home;