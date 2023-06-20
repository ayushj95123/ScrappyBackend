const express = require('express');
const app = express();
const port = 8000;
const auth = require('./auth.js')
const topicRouter = require('./topicAPI');
const scrapbookRouter = require('./scrapbookAPI')
const { connectDB, closeDB } = require('./db');
const cors = require('cors');
const cheerio = require('cheerio');

app.use(cors());

// Connect to MongoDB
connectDB("mongodb+srv://Ayush:Secret@cluster0.nli63wp.mongodb.net/?retryWrites=true&w=majority")

app.use(express.json());
app.get('/', async(req,res)=>{
  res.send("Welcome to Scrappy Backend Service. Hope you have an amazing experience!!")
})

app.post('/parse-html', (req, res) => {
  const { html } = req.body;
  console.log("From backend:", html)
  // Use Cheerio to parse the HTML string
  const $ = cheerio.load(html);
  
  // Customize the rendering of link tags
$('a').each((index, element) => {
        const $link = $(element);
        const url = $link.attr('href');

        // Replace <a> with <button> and add onClick method
        const $button = $('<button>')
          .text($link.text())
          .attr('type', 'button')
          .attr('class', 'link-button')
        $link.replaceWith($button);
      });

  // Return the modified HTML as the response
  const modifiedHtml = $.html();
  console.log(modifiedHtml)
  res.send(modifiedHtml);
});


app.use('/auth', auth);
app.use('/topics', topicRouter);
app.use('/scrapbooks', scrapbookRouter);


app.listen(port);

// Close the database connection when the app is shutting down
process.on('SIGINT', async () => {
  await closeDB();
  process.exit();
});