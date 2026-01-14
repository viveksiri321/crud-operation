
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/studentDB');

const studentSchema = new mongoose.Schema({
    rollNo: Number,
    name: String,
    degree: String,
    city: String
});

const Student = mongoose.model('Student', studentSchema);

// Home Page
app.get('/', async (req, res) => {
    const students = await Student.find();
    res.render('index', { students, student: null });
});

// Save or Update
app.post('/save', async (req, res) => {
    const { id, rollNo, name, degree, city } = req.body;

    if (id) {
        await Student.findByIdAndUpdate(id, { rollNo, name, degree, city });
    } else {
        const newStudent = new Student({ rollNo, name, degree, city });
        await newStudent.save();
    }

    res.redirect('/');
});

// Edit
app.get('/edit/:id', async (req, res) => {
    const student = await Student.findById(req.params.id);
    const students = await Student.find();
    res.render('index', { students, student });
});

// Delete
app.get('/delete/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
