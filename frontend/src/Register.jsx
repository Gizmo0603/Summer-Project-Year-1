import { useState } from "react";
import { Link } from "react-router-dom";
import "./Style.css";

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        console.log("register button clicked");
        setError('');

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();

        if (!data.success) {
            setError(data.error);
            return;
        }

        console.log('Registered:', data.message);

        window.location.href = "/";
    };

    return (
        <div className="login-container">
            <form className="login-box" onSubmit={handleRegister}>

                {error && <p className="error">{error}</p>}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Register</button>

                <p>
                    Got an account? <Link to="/">Login here</Link>
                </p>

            </form>
        </div>
    );
}

export default Register;