const express = require('express');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const md5 = require('md5');
const session = require('express-session');

const app = express(); //creates the instance of it.

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use(express.urlencoded({ extended: true })); //reads data, allows reqbody to work.

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));

const db = new DatabaseSync(process.env.DB_PATH || 'database.sqlite');

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

} catch (err) {
  console.error("DB init error:", err);
}

// show login page
app.get('/login', (req, res) => {
  res.render('Login', { error: null });
});


app.post('/login', (req, res) => {
    const {email, password } = req.body;
    if (!email || !password) {
        return res.render ('Login', {error: 'Email/password are required.'});
    }
    try {
        const row = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, md5(password));
    
        if (!row) {
        return res.render('Login', {error: 'Invalid email/passowrd'});
    }

    req.session.userid = row.id;
    req.session.username = row.username;
    res.redirect('/main');

    } catch (err) {
        console.error(err);
        return res.status(500).send('database error');
    }
});

app.post('/register', (req, res) => {
    const {username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.render('Register', {error: 'All fields needed'});
    }
    try { //checks if user exists in users table. 
        const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (existing) {
        return res.render('Register', {error: 'Email in use'});
    }
    //insert new user here
    const new_user = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');

    new_user.run(username, email, md5(password));
    res.redirect('/login'); //sends to login after.
    } catch (err) {
        console.error(err);
        return res.status(500).send('database error')
    }
});

// default route
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/register', (req, res) => {
    res.render('Register', {error: null });
});

app.get('/main', (req, res) => {
  res.render('main', { error: null });
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

