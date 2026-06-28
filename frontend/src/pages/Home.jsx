// import "./Main.css";

// function Home() {

//     return (
//         <div className="main-page">
//             <div className="main-container">
//                 <h1>TEST WORK</h1>      
//             </div>
//         </div>
//     );
// }

// export default Home;

import "./Main.css";
import { useEffect, useState } from "react";

function Home() {
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/me", {
                    credentials: "include"
                });

                const data = await res.json();
                console.log(data);

                if (data.loggedIn) {
                    setUsername(data.username);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="main-page">
            <div className="main-container">
                <h1>
                    {username ? `Hello ${username}` : "Loading..."}
                </h1>
            </div>
        </div>
    );
}

export default Home;