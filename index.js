const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json())

// All About Courses_________________________

// course database 1
const course_db_1 = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'course_db_1',
});

// course database 2
const course_db_2 = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'course_db_2',
});



// Connect with server
course_db_1.connect(err => {
  if (err) throw err;
  console.log('course database 1 Connected...');
});

course_db_2.connect(err => {
  if (err) throw err;
  console.log('course database 2 connected');
});



// Course Related API
// Get course
app.get('/courses', (req, res) => {
  const query = 'SELECT * FROM course';
  course_db_1.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});



// Post course
app.post('/courses', (req, res) => {
  const { title, thumbnailUrl, description, price, category } = req.body;

  let targetDatabase;
  if (parseInt(price) === 0) {
    targetDatabase = course_db_1;
  } else {
    targetDatabase = course_db_2;
  }

  const query = 'INSERT INTO course (title, thumbnailUrl, description, price, category) VALUES (?, ?, ?, ?, ?)';

  targetDatabase.query(query, [title, thumbnailUrl, description, price, category], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to add course' });
    }
    res.status(201).json({ message: 'Course added successfully', courseId: result.insertId });
  });
});









// All About Users_________________________
// user database 1
const user_db_1 = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'user_db_1',
});

// user database 2
const user_db_2 = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'user_db_2',
});



// Connect with server
user_db_1.connect(err => {
  if (err) throw err;
  console.log('user database 1 Connected...');
});

user_db_2.connect(err => {
  if (err) throw err;
  console.log('user database 2 connected');
});



// Get users
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  user_db_1.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


app.get('/', (req, res) => {
  res.send('Server running')
});


app.listen(5000, () => console.log('Server running on port 5000'));
