const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({// Unique ID for the topic
  scrapBookId: { type: mongoose.Schema.Types.ObjectId, ref: 'ScrapBook', required: true }, // Reference to the parent ScrapBook
  title: { type: String, required: true }, // Title of the topic
  createdOn: { type: Date, default: Date.now }, // Date when the topic was created
  pages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Page' }] // Array of Page model references
});

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;