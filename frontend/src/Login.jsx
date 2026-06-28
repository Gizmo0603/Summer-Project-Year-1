import { useState } from "react"; //stores changing vlaues inside component.
import { Link } from "react-router-dom"; //Clickable link, doesn ot reload page.
import { useNavigate } from "react-router-dom"; //Redirect in code.
import "./Style.css"; //Looks at style.css

function Login() { //Defines component.
    const [email, setEmail] = useState(''); //First is cucrent value. Second updates it.
    const [password, setPassword] = useState(''); //same as before.
    const [error, setError] = useState(''); //error messages.

    const navigate = useNavigate();
    const handleLogin = async (e) => { //Runs when user cliks "login"
        e.preventDefault(); //stops page reloading (something I sorely needed last time :wilted_rose:)
        setError(''); //clears errors.

        const res = await fetch('/api/login', { //sends request to backend, with vite works.
            method: 'POST', //sending data
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            }, //sending json data specifically.
            body: JSON.stringify({ email, password })
        });

        const data = await res.json(); //turns data into js object.

        if (!data.success) {
            setError(data.error);
            return; //error checks. If it fails, shows error and stops.
        }

        console.log('Logged in user:', data.user);

        navigate("/home"); //successful login.
    };

    return (
        <div className="login-container">
            <form className="login-box" onSubmit={handleLogin}>

                {error && <p className="error">{error}</p>} 

                <input
                    type="email" //Says what the info should be.
                    placeholder="Email" //Placeholder text inside bar
                    value={email} //input controlled by react.
                    onChange={(e) => setEmail(e.target.value)} //updates state when typing.
                /> 

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Login</button> 

                <p>
                No account? <Link to="/register">Register here</Link>
                </p> 

            </form>
        </div>
    );
}

export default Login;