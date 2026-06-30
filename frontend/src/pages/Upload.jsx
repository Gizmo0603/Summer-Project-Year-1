import "./Main.css"; //imports styling
import { useState } from "react"; // stores value that can change.

function Upload() { //returns User Interface/UI
    const [file, setFile] = useState(null); //Variables (selected file object)
    const [preview, setPreview] = useState(null); //Temp link to display image.
    const [message, setMessage] = useState(""); //success/error text later.

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]; //gets first selected file and stores it in state.

        if (!selectedFile) return;

        setFile(selectedFile);

        const previewUrl = URL.createObjectURL(selectedFile); //temp browser url
        setPreview(previewUrl);//stores for display.
    };

    const handleUpload = async () => { //runs when "upload" is pressed
        if (!file) { //stops if no file selected.
            setMessage("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file); //format

        try {
            const res = await fetch("/api/upload", {
                method: "POST", //sends data
                body: formData, //contains uploaded file
                credentials: "include" //session cookies/login info
            });

            const data = await res.json();

            if (data.success) { //success/failure.
                setMessage("Upload successful: " + data.filename);
            } else {
                setMessage("Upload failed.");
            }

        } catch (err) {
            console.error(err);
            setMessage("Upload error.");
        }
    };

    return (
        <div className="main-page">
            <div className="main-container">

                <h1>Upload File</h1>

                <input
                    type="file"
                    onChange={handleFileChange} //runs when user selects file.
                />

                {preview && (
                    <div style={{ marginTop: "20px" }}>
                        <p>Preview:</p>

                        {}
                        {file.type.startsWith("image/") ? (
                            <img
                                src={preview} //shows preview if it exists.
                                alt="preview"
                                style={{
                                    maxWidth: "300px",
                                    borderRadius: "8px"
                                }}
                            />
                        ) : (
                            <p>{file.name}</p>
                        )}
                    </div>
                )}

                <button onClick={handleUpload}>
                    Upload
                </button>

                {message && <p>{message}</p>}

            </div>
        </div>
    );
}

export default Upload; //lets component be used elsewhere.