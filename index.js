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
  const query = 'SELECT * FROM free_course';
  course_db_1.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});






// Get both free and premium courses
app.get('/all-courses', (req, res) => {
  const freeCoursesQuery = 'SELECT * FROM free_course';
  const premiumCoursesQuery = 'SELECT * FROM premium_course';

  // Fetch free courses from course_db_1
  course_db_1.query(freeCoursesQuery, (err, freeCourses) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to fetch free courses' });
    }

    // Fetch premium courses from course_db_2
    course_db_2.query(premiumCoursesQuery, (err, premiumCourses) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to fetch premium courses' });
      }

      // Combine both free and premium courses
      const allCourses = [...freeCourses, ...premiumCourses];

      // Send all courses as response
      res.json(allCourses);
    });
  });
});







// Post course
app.post('/courses', (req, res) => {
  const { title, thumbnailUrl, description, price, category } = req.body;


  // Fragmentation condition
  let targetDatabase;
  let targetedTable;
  if (parseInt(price) === 0) {
    targetDatabase = course_db_1;
    targetedTable = 'free_course'
  } else {
    targetDatabase = course_db_2;
    targetedTable = 'premium_course'
  }

  const query = `INSERT INTO ${targetedTable} (title, thumbnailUrl, description, price, category) VALUES (?, ?, ?, ?, ?)`;

  console.log(query)

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





// Post user
app.post('/users', (req, res) => {
  const { name, photoUrl, email, password, userRole } = req.body;


  // Fragmentation condition
  let targetDatabase;
  let targetedTable;
  
  // Check the user role and determine which database and table to use
  if (userRole === 'instructor') {
    targetDatabase = user_db_1;  // Use user_db_1 for instructors
    targetedTable = 'instructors';
  } else {
    targetDatabase = user_db_2;  // Use user_db_2 for students
    targetedTable = 'students';
  }

  const query = `INSERT INTO ${targetedTable} (name, photoUrl, email, password, userRole) VALUES (?, ?, ?, ?, ?)`;


  targetDatabase.query(query, [name, photoUrl, email, password, userRole], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to add user' });
    }
    res.status(201).json({ message: 'User added successfully', userId: result.insertId });
  });
});










app.get('/', (req, res) => {
  res.send('Server running')
});


app.listen(5000, () => console.log('Server running on port 5000'));
