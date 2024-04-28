require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('payload', (req, res) => ( JSON.stringify(req.body) ))
const app = express()
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :payload'))
app.use(cors())
app.use(express.static('dist'))

/*let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]*/

app.get('/info', (request, response) => {
  const currentDate = Date()
  Person.find({}).then(result => {
    response.send(`<p>Phonebook has info for ${result.length} people</p><p>${currentDate}</p>`)
  })
  //response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${currentDate}</p>`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

app.get('/api/persons/:id', (request, response) => {
  //const person = persons.find(p => p.id === Number(request.params.id))
  const person = Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'Malformatted id' })
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => response.status(204).end())
    .catch(error => next(error))
  //persons = persons.filter(p => p.id !== Number(request.params.id))
  //response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  // For simplicity, no uuid is used
  const body = request.body
  //const randomId = Math.floor(Math.random() * 1000000)
  //const newPerson = {'id': randomId, 'name': body.name, 'number': body.number}
  const newPerson = new Person({
    name: body.name,
    number: body.number
  })
  if (!(newPerson.name && newPerson.number)) {
    response.status(400).json({'error': 'Name or number missing'})
  //} else if (persons.find(p => p.name.toLowerCase() === newPerson.name.toLowerCase())) {
  //  response.status(409).json({'error': 'Name already exists'})
  } else {
    newPerson.save().then(result => {
      response.json(result)
    })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})