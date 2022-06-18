require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

let db, dbName = 'expense-exhibit';

MongoClient.connect(MONGODB_URI)
  .then(client => {
    console.log('Connected to database');
    db = client.db(dbName);
  })
  .catch(error => {
    console.error(`Internal server error: ${error}`)
  });

app.set('view engine', 'ejs');
app.use( cors() );
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );
app.use( express.static('public') );

app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.get('/dashboard', (req, res) => {
  res.render('dashboard.ejs')
})

app.post('/user', async (req, res) => {
  const { username } = req.body;

  if (username.length < 4) {
    return res.status(400).json({
      error: 'Invalid username'
    })
  }

  const newUser = {
    uid: uuidv4(),
    username,
  }

  try {
    const result = await db.collection('user').insertOne(newUser);
    const user = await db.collection('user').findOne({ _id: result.insertedId });
  
    res.status(201).json({ 
      uid: user.uid,
      username: user.username
    })
  } catch(err) {
    console.error(`Error: ${err}`)
  }
})

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})