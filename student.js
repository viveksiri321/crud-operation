const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // change if needed
    password: '12345',       // your mysql password
    database: 'studentDB'
});

db.connect(err => {
    if (err) {
        console.log(err);
    } else {
        console.log('MySQL Connected');
    }
});

// Home page
app.get('/', (req, res) => {
    db.query("SELECT * FROM students", (err, results) => {
        res.render('index', { students: results, student: null });
    });
});

// Save / Update Student
app.post('/save', (req, res) => {
    const { id, rollNo, name, degree, city } = req.body;

    if (id) {
        // Update
        const sql = "UPDATE students SET rollNo=?, name=?, degree=?, city=? WHERE id=?";
        db.query(sql, [rollNo, name, degree, city, id], () => {
            res.redirect('/');
        });
    } else {
        // Insert
        const sql = "INSERT INTO students (rollNo, name, degree, city) VALUES (?, ?, ?, ?)";
        db.query(sql, [rollNo, name, degree, city], () => {
            res.redirect('/');
        });
    }
});

// Edit student
app.get('/edit/:id', (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM students WHERE id=?", [id], (err, result) => {
        db.query("SELECT * FROM students", (err, students) => {
            res.render('index', { student: result[0], students });
        });
    });
});

// Delete student
app.get('/delete/:id', (req, res) => {
    db.query("DELETE FROM students WHERE id=?", [req.params.id], () => {
        res.redirect('/');
    });
});

// Server
app.listen(3000, () => {
    console.log('`Server running on http://localhost:3000`');
});

