const express = require('express'); //Imports express (framewrk)
const { DatabaseSync } = require('node:sqlite'); //imports sqlite
const md5 = require('md5'); //hashes passwords.
const session = require('express-session'); //stores login state/allows server to remember
const cors = require('cors'); //allows frontend to talk to back
const app = express(); //server instance.
const multer = require("multer");//file uploads.
const path = require("path"); //built in path, returns things such as .png/.jpg.
const fs = require("fs");

const allowedOrigins = [ //Array
    'http://localhost:5173',
    'https://turbo-doodle-q7jx96v5wp7whxwpx-5173.app.github.dev'
]; //allowed frontends.

app.use(cors({
    origin: "https://turbo-doodle-q7jx96v5wp7whxwpx-5173.app.github.dev",
    credentials: true
})); //Cookies and such. Saying it is allowed.

app.use(express.json()); //lets it read json.
app.use(express.urlencoded({ extended: true })); //form style dataallowed.

app.use(session({ //used to store data, and allows to see who is logged in.
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: "lax"
    }
}));

const db = new DatabaseSync(process.env.DB_PATH || 'database.sqlite'); //new db. One for users/files
//creates dbs
db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)
`);
db.exec(`
CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    filename TEXT NOT NULL,
    original_name TEXT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`)

app.get('/', (req, res) => {
    res.send('API running');
}); //test endpoint. Not used anymore.

app.post('/api/login', (req, res) => { //Runs when it gets POST /routes
    const { email, password } = req.body;
    if (!email || !password) { //stops empty boxes
        return res.status(400).json({
            success: false,
            error: 'Missing email or password'
        }); 
    }

    const user = db.prepare( //FInds matching users. ? are placeholder
        'SELECT * FROM users WHERE email = ? AND password = ?'
    ).get(email, md5(password));

    if (!user) {
        return res.status(401).json({ //shows if none.
            success: false,
            error: 'Invalid credentials'
        });
    }

 req.session.userId = user.id;
    req.session.username = user.username;

    return res.json({
        success: true,
        user: {
            id: user.id,
            username: user.username
        }
    });
});

app.get("/api/me", (req, res) => { //tells server is user is logged in or not.
    if (!req.session.userId) {
        return res.json({ loggedIn: false });
    }

    res.json({
        loggedIn: true,
        username: req.session.username
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

app.post("/api/logout", (req, res) => {
    res.clearCookie("connect.sid", { path: "/" });
    req.session?.destroy(() => {});
    res.json({ success: true });
});

const storage = multer.diskStorage({ //tells it where to put received file. 
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9) //Gives random file name so no overwriting.
            + path.extname(file.originalname); //Keeps .png/jpg

        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), (req, res) => { //stores images in uploads folder.
    if (!req.file) {
        return res.status(400).json({ success: false });
    }

    db.prepare(
        "INSERT INTO files (user_id, filename, original_name) VALUES (?, ?, ?)"
    ).run(req.session.userId, req.file.filename, req.file.originalname);

    res.json({
        success: true,
        filename: req.file.filename
    });
});

app.get("/api/files", (req, res) => {
    const files = db.prepare(
        "SELECT * FROM files ORDER BY uploaded_at DESC" //gets every file (newest first)
    ).all();

    res.json(files);
});

app.delete("/api/files/:id", (req, res) => {
    const file = db.prepare(
        "SELECT * FROM files WHERE id = ?"
    ).get(req.params.id);

    if (!file) {
        return res.status(404).json({
            success: false,
            error: "File not found"
        });
    }

    // delete from disk
    const filePath = path.join(__dirname, "uploads", file.filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error("File delete error:", err);
        }
    });

    // delete from DB
    db.prepare(
        "DELETE FROM files WHERE id = ?"
    ).run(req.params.id);

    res.json({ success: true });
});

app.use("/uploads", express.static("uploads"));



app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
}); //starts backend.