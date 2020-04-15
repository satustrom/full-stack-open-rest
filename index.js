// This is needed in order to get environment variables into use
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const Person = require("./models/person");

const PORT = process.env.PORT;

// This is needed in order to get into the request data
app.use(express.json());

// Custom token for request body
morgan.token("body", function(req, res) {
  return JSON.stringify(req.body);
});

// Logging the requests
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
// Make express to show static content
app.use(express.static("build"));

// Remove all the CORS issues for now with this
app.use(cors());
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Get from mongo db
// {} ins find means importing everything
app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  Person.find({})
    .then(persons => {
      response.send(`
      <h2>Phonebook has info for ${persons.length} people</h2>
      <br/>
      <h4>Date of request: ${new Date()}</h4>
    `);
    })
    .catch(error => {
      console.log(error);
      response
        .status(400)
        .send({ error: "something went wrong with fetching persons" });
    });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(erros => {
      console.log(error);
      response.status(400).send({ error: "malformatted id" });
    });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (body.name === undefined) {
    return response.status(400).json({ error: "name must be unique" });
  } else if (body.number === undefined) {
    return response.status(400).json({ error: "number must be unique" });
  }
  // FIXME: Update to Mongo DB
  // else {
  //   const nameCheck = persons.find(p => p.name === body.name);

  //   if (nameCheck) {
  //     return response.status(400).json({ error: "name already exists" });
  //   }
  // }

  // create new Person schema in order to push to MongoDb
  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date()
  });

  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON());
  });
});

// FIXME: Update to MongoDb
// app.delete("/api/persons/:id", (req, res) => {
//   const id = Number(req.params.id);
//   persons = persons.filter(p => p.id !== id);

//   res.status(204).end();
// });

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
