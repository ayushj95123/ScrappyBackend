const express = require('express');
const app = express();
const port = 3001;
const auth = require('./auth.js')
const { connectDB, closeDB } = require('./db');

// Connect to MongoDB
connectDB("mongodb+srv://Ayush:Secret@cluster0.nli63wp.mongodb.net/?retryWrites=true&w=majority")


app.get('/', async(req,res)=>{
  res.send("Welcome to Scrappy Backend Service. Hope you have an amazing experience!!")
})

app.use(express.json());
app.use('/auth', auth)

app.listen(port)

// Close the database connection when the app is shutting down
process.on('SIGINT', async () => {
  await closeDB();
  process.exit();
});