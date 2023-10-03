const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const journalEntrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  body: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 5000,
  },
  mood: {
    type: Number,
    min: 0,
    max: 4,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

// Define a function that validates journal entry input using Joi
function validateJournalEntry(journalEntry) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    body: Joi.string().min(3).max(5000).required(),
    mood: Joi.number().integer().min(0).max(4).required(),
    user: Joi.objectId().required(),
  });
  return schema.validate(journalEntry);
}

module.exports.JournalEntry = JournalEntry;
module.exports.validateJournalEntry = validateJournalEntry;