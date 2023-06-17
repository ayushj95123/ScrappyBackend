const express = require('express');
const scrapbookRouter = express.Router();
const ScrapBook = require('./ScrapBook');
const authenticateToken  = require('./tokenVerification');
const Page = require('./Page')
const Topic = require('./Topic')

scrapbookRouter.post('/addScrapBook', authenticateToken, async (req, res) => {
  console.log('Trying to create Scrapbook:'+req.user);
  try {
    const userId  = req.user._id;
    const {title} = req.body;
    const createdOn = Date.now()

    // Create a new ScrapBook instance
    const newScrapBook = new ScrapBook({
      userId: userId,
      title,
      createdOn,
    });

    // Save the ScrapBook to the database
    const savedScrapBook = await newScrapBook.save();

    res.status(201).json(savedScrapBook);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      const duplicateField = Object.keys(error.keyPattern)[0];
      console.log(`Duplicate key error on field: ${duplicateField}`);
    }
    console.error("There was error savinf scrapbook", error);
    res.sendStatus(500); // Internal Server Error
  }
});

scrapbookRouter.get('/getScrapBooks', authenticateToken, async (req, res) => {
  try {
    const userId  = req.user._id;

    const scrapbooks = await ScrapBook.find({ userId })
      .populate({
        path: 'topics',
        populate: {
          path: 'pages',
          model: 'Page',
        },
      })
      .exec();

    res.json(scrapbooks);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Internal Server Error
  }
});
  
  // API to get all scrapbooks without underlying topics and pages for a particular user
  scrapbookRouter.get('/nodetails', authenticateToken, async (req, res) => {
    try {
      const userId  = req.user._id;
      const scrapbooks = await ScrapBook.find({ userId });
      res.json(scrapbooks);
    } catch (error) {
      console.error(error);
      res.sendStatus(500); // Internal Server Error
    }
  });
  
  // API to delete a scrapbook and its underlying topics and pages
  scrapbookRouter.delete('/:id', authenticateToken, async (req, res) => {
    console.log("Trying to delete scrapboook")
    try {
      const { id } = req.params;
      // Check if the scrapbook belongs to the current user
      console.log("Trying to find scrapbook ID:", id)
      const scrapbook = await ScrapBook.findOne({ _id: id});
      if (!scrapbook) {
        return res.status(404).json({error: "Scrapbook not found"}); // Not Found
      }
   
      // Delete the scrapbook, its topics, and pages
      await ScrapBook.deleteOne({ _id: id });
      await Topic.deleteMany({ scrapBookId: id });
      await Page.deleteMany({ topicId: { $in: scrapbook.topics } });
  
      res.sendStatus(200).json({message: "Deleted the scrapbook successfully"}); 
    } catch (error) {
      console.error(error);
      res.sendStatus(500); // Internal Server Error
    }
  });
  
  // API to update a scrapbook
  scrapbookRouter.put('/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
  
      // Check if the scrapbook belongs to the current user
      const scrapbook = await ScrapBook.findOne({ _id: id});
      if (!scrapbook) {
        return res.sendStatus(404); // Not Found
      }
  
      // Update the scrapbook fields
      Object.assign(scrapbook, updates);
      await scrapbook.save();
  
      res.json(scrapbook);
    } catch (error) {
      console.error(error);
      res.sendStatus(500); // Internal Server Error
    }
  });


module.exports = scrapbookRouter;
  