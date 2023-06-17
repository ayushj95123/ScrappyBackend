const express = require('express');
const topicRouter = express.Router();
const Topic = require('./Topic');
const authenticateToken = require('./tokenVerification');
const mongo = require('mongoose');
const ScrapBook = require('./ScrapBook');
const Page = require('./Page');

topicRouter.post('/addTopic', authenticateToken, async (req, res) => {
  try {
    const { scrapBookId, title, createdOn } = req.body;

    // Find the corresponding ScrapBook document
    const scrapBook = await ScrapBook.findById(scrapBookId);

    if (!scrapBook) {
      return res.status(404).json({ error: 'ScrapBook not found' });
    }

    // Create a new Topic instance
    const newTopic = new Topic({
      scrapBookId: scrapBook._id, // Associate the topic with the ScrapBook
      title,
      createdOn,
    });

    // Save the Topic to the database
    const savedTopic = await newTopic.save();

    // Update the ScrapBook's topics array with the new topic
    scrapBook.topics.push(savedTopic);
    await scrapBook.save();
    console.log("Successfully added topic")
    res.status(201).json(savedTopic);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Internal Server Error
  }
});

// Get all topics for a scrapbook
topicRouter.get('/:scrapBookId', authenticateToken, async (req, res) => {
  try {
    const { scrapBookId } = req.params;

    // Find the topics for the specified scrapbook and populate the pages
    const topics = await Topic.find({ scrapBookId }).populate('pages');
    res.json(topics);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Internal Server Error
  }
});

topicRouter.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the topic to be deleted
    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    // Remove the topic from the associated ScrapBook's topics array
    const scrapBookId = topic.scrapBookId;
    const scrapBook = await ScrapBook.findById(scrapBookId);
    if (scrapBook) {
      scrapBook.topics = scrapBook.topics.filter(topicId => topicId.toString() !== id);
      await scrapBook.save();
    }

    // Delete the topic
    await Topic.deleteOne({ _id: id });

    res.sendStatus(204); // No Content
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Internal Server Error
  }
});

// Update a topic
topicRouter.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    // Find the topic to be updated
    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    // Update the topic's title
    topic.title = title;
    await topic.save();

    res.json(topic);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Internal Server Error
  }
});

module.exports = topicRouter;
