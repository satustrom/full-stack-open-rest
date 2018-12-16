const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

let persons = [
  {
    name: "Rasmus Virtanen",
    number: "044 123 4567",
    date: '2017-12-10T17:30:31.098Z',
    id: 1
  },
  {
    name: "Satu Koivisto",
    number: "050 333 4567",
    date: '2017-12-10T18:39:34.091Z',
    id: 2
  },
  {
    name: "Kaarle Majamaa",
    number: "040 221 1234",
    date: '2017-12-10T19:20:14.298Z',
    id: 3
  }
];

const generateId = () => {
  const maxId = persons.length > 0
  ? persons.map(p => p.id).sort((a,b) => a - b).reverse()[0]
  : 0;

  return maxId + 1;
}

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  const sum = persons.length;

  res.send(`
    <h2>There is ${sum} phonenumbers in total</h2>
    <br/>
    <h4>Date of request: ${new Date()}</h4>
  `)
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(p => p.id === id);

  person ? res.json(person) : res.status(404).end();
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(p => p.id !== id);

  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (body.name === undefined) {
    return res.status(400).json({ error: 'Name is missing'});
  } else if (body.number === undefined) {
    return res.status(400).json({ error: 'Number is missing'})
  } else {
    const nameCheck = persons.find(p => p.name === body.name);
    console.log('nameCheck', nameCheck);
    if (nameCheck) {
      return res.status(400).json({ error: "Name already exists" });
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



