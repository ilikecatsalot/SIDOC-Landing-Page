const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/chatbox', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chatbox.html'));
});

//live user count
let userCount = 0;

io.on('connection', (socket) => {
  userCount++;
  io.emit('userCountUpdated', userCount);

  socket.on('disconnect', () => {
    userCount--;
    io.emit('userCountUpdated', userCount);
  });
});
//button clicker database
const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'click_tracking';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let db;

MongoClient.connect(MONGODB_URI, { useUnifiedTopology: true })
  .then((client) => {
    db = client.db(DB_NAME);
    server.listen(PORT, () => { // Use server.listen() instead of app.listen()
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

  app.post('/api/clicks/:answer', (req, res) => {
  const { answer } = req.params;

  // Increment the click count for the given answer
  db.collection('clicks')
    .updateOne({ _id: answer }, { $inc: { count: 1 } }, { upsert: true })
    .then(() => {
      // Get the total click count for both answers
      db.collection('clicks')
        .aggregate([{ $group: { _id: null, total: { $sum: '$count' } } }])
        .toArray()
        .then((result) => {
          const total = result[0] ? result[0].total : 0;

          // Update the sum in the database
          db.collection('clicks').updateOne(
            { _id: 'sum' },
            { $set: { sum: total } },
            { upsert: true }
          )
          .then(() => {
            // Get the click counts for both answers
            db.collection('clicks')
              .find({})
              .toArray()
              .then((results) => {
                const clickCounts = {};
                results.forEach((item) => (clickCounts[item._id] = item.count));

                // Send click counts and total to the client
                res.json({
                  ...clickCounts,
                  total,
                });
              })
              .catch((error) => {
                console.error('Error fetching click counts:', error);
                res.status(500).json({ error: 'Internal Server Error' });
              });
          })
          .catch((error) => {
            console.error('Error updating total sum:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          });
        })
        .catch((error) => {
          console.error('Error fetching total clicks:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        });
    })
    .catch((error) => {
      console.error('Error updating click count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});
app.get('/api/totalSum', (req, res) => {
  db.collection('clicks')
    .findOne({ _id: 'sum' })
    .then((result) => {
      const totalSum = result ? result.sum : 0;
      res.json({ totalSum });
    })
    .catch((error) => {
      console.error('Error fetching total sum:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});
