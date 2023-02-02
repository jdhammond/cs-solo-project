const mongoose = require('mongoose');

const MONGO_URI =
  'mongodb+srv://jdhammond:codesmith@cluster0.1ald32x.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'icebreakers',
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

const Schema = mongoose.Schema;

// schema for questions

// schema for people
const personSchema = new Schema({
  name: String,
  admin: Boolean,
  anonymous: Boolean,
  avatar: String,
});

const Person = mongoose.model('person', personSchema);

const questionSchema = new Schema({
  text: String,
  answers: [
    {
      answer: Number,
      respondent: { type: Schema.Types.ObjectId, ref: 'person' },
    },
  ],
});

const Question = mongoose.model('question', questionSchema);

module.exports = { Person, Question };
