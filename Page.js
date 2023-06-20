const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true }, // Reference to the parent Topic
  pageNumber: { type: Number, required: true }, // Page number
  title: { type: String }, // Optional title of the page
  description: { type: String }, // Optional description of the page
  image: { type: String } // File path or URL to the image (you can store the file name or URL)
});

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;