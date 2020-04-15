const mongoose = require("mongoose");

// This url defines the database where to store schema
const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => console.log("connected to MongoDB"))
  .catch(error => {
    console.log("error connecting to MongoDB: ", error.message);
  });

const personsSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date
});

// Edit some of the fields in response
personsSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Person", personsSchema);
