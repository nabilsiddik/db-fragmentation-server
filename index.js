const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json())

// Database1 connection
const database1 = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'database_1',
});

// Database2 connection
const database2 = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'database_2',
  });

database1.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

database2.connect(err => {
    if (err) throw err;
    console.log('Connected to database_2');
});



// Course Related API
// Get course
app.get('/courses', (req, res) => {
  const query = 'SELECT * FROM courses';
  database1.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Post course
app.post('/courses', (req, res) => {
    const { title, thumbnailUrl, description, price, category } = req.body;

    let targetDatabase;
    if(price <= 5000){
        targetDatabase = database1;
    }else{
        targetDatabase = database2;
    }
  
    const query = 'INSERT INTO courses (title, thumbnailUrl, description, price, category) VALUES (?, ?, ?, ?, ?)';
    targetDatabase.query(query, [title, thumbnailUrl, description, price, category], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to add course' });
      }
      res.status(201).json({ message: 'Course added successfully', courseId: result.insertId });
    });
  });



app.get('/', (req, res) => {
    res.send('Server running')
});


app.listen(5000, () => console.log('Server running on port 5000'));
