const mongoose = require("mongoose");

// This is for updating mongoDB database with commandline
if (process.argv.length < 3) {
  console.log("please give password as argument");
  process.exit();
}

const password = process.argv[2];
// This url defines the database where to store schema
const url = `mongodb+srv://fullstack:${password}@cluster0-giyb2.mongodb.net/phone-numbers?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personsSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date
});

const Person = mongoose.model("Person", personsSchema);

// If needed details for new phone number is found, create a new, otherwise fetch existing ones
if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
    date: new Date()
  });

  person.save().then(response => {
    console.log(`added ${response.name} ${response.number} to phone numbers`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then(result => {
    console.log("Phone numbers:");
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
