const mongoose = require('mongoose');

const scrapbookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String },
  createdOn: { type: Date, required: true },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }]
});

const ScrapBook = mongoose.model('ScrapBook', scrapbookSchema);

module.exports = ScrapBook;