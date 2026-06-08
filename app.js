const express = require('express'); //Hnadles routes.
const { DatabaseSync } = require('node:sqlite'); //SQLite stuff.
const md5 = require('md5'); //hashes passwords.
const session = require('express-session'); //stores login state.
const cors = require('cors'); //allows frontend to talk to back
const app = express(); //server instance.

const allowedOrigins = [
    'http://localhost:5173',
    'https://turbo-doodle-q7jx96v5wp7whxwpx-5173.app.github.dev'
]; //allowed frontends.

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); //Runs on all requests.

        if (allowedOrigins.includes(origin)) {
            return callback(null, true); //if frontend matches, is allowed.
        }

        return callback(null, true); // //allow everything regardless.
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json()); //lets it read json.
app.use(express.urlencoded({ extended: true })); //form style dataallowed.

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
})); //encrypts session data

const db = new DatabaseSync(process.env.DB_PATH || 'database.sqlite');
//creates dbs
db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)
`);

app.get('/', (req, res) => {
    res.send('API running');
}); //test endpoint. Not used anymore.

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
//front end calls this + input.
    if (!email || !password) { //validation. Stops empty requests.
        return res.status(400).json({
            success: false,
            error: 'Missing email or password'
        }); 
    }

    const user = db.prepare( //FInds matching users.
        'SELECT * FROM users WHERE email = ? AND password = ?'
    ).get(email, md5(password));

    if (!user) {
        return res.status(401).json({ //shows if none.
            success: false,
            error: 'Invalid credentials'
        });
    }

    req.session.userId = user.id;

    return res.json({
        success: true,
        user: {
            id: user.id,
            username: user.username //logs user in.
        }
    });
});

app.post('/api/register', (req, res) => { //register route.
    const { username, email, password } = req.body; //if anything missing, fails into next.

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Missing fields'
        });
    }

    const existing = db.prepare( //checks db for info.
        'SELECT * FROM users WHERE email = ?'
    ).get(email);

    if (existing) { //if it exists, does this.
        return res.status(409).json({
            success: false,
            error: 'Email already exists'
        });
    }

    db.prepare( //inserts username and such into users db
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
    ).run(username, email, md5(password));

    return res.json({
        success: true,
        message: 'User registered' //succesfully registered.
    });
});

app.get('/main', (req, res) => { //protected, requires login.
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not logged in' });
    } //if not logged in, gives error back.

    res.send('Logged in');
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
}); //starts backend.