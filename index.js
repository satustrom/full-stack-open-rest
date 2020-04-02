const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3001;

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

// Initial person data
let persons = [
  {
    name: "B. Virtanen",
    number: "040 123 4567",
    date: "2017-12-10T17:30:31.098Z",
    id: 1
  },
  {
    name: "Matti Meikäläinen",
    number: "040 765 4321",
    date: "2017-12-10T18:39:34.091Z",
    id: 2
  },
  {
    name: "Homer Simpson",
    number: "040 124 1234",
    date: "2017-12-10T19:20:14.298Z",
    id: 3
  }
];

const generateId = () => {
  const maxId =
    persons.length > 0
      ? persons
          .map(p => p.id)
          .sort((a, b) => a - b)
          .reverse()[0]
      : 0;

  return maxId + 1;
};

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const sum = persons.length;
  res.send(`
    <h2>Phonebook has info for ${sum} people</h2>
    <br/>
    <h4>Date of request: ${new Date()}</h4>
  `);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(p => p.id === id);

  person ? res.json(person) : res.status(404).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (body.name === undefined) {
    return res.status(400).json({ error: "name must be unique" });
  } else if (body.number === undefined) {
    return res.status(400).json({ error: "number must be unique" });
  } else {
    const nameCheck = persons.find(p => p.name === body.name);

    if (nameCheck) {
      return res.status(400).json({ error: "name already exists" });
    }
  }

  const person = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: generateId()
  };

  persons = persons.concat(person);

  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(p => p.id !== id);

  res.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
