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

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(result => {
    response.json(result)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  //const person = persons.find(p => p.id === Number(request.params.id))
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(person => response.status(204).end())
    .catch(error => next(error))
  //persons = persons.filter(p => p.id !== Number(request.params.id))
  //response.status(204).end()
})

app.post('/api/persons', (request, response, next) => {
  // For simplicity, no uuid is used
  const body = request.body
  //const randomId = Math.floor(Math.random() * 1000000)
  //const newPerson = {'id': randomId, 'name': body.name, 'number': body.number}
  const newPerson = new Person({
    name: body.name,
    number: body.number
  })
  if (!(newPerson.name && newPerson.number)) {
    response.status(400).json({ 'error': 'Name or number missing' })
  //} else if (persons.find(p => p.name.toLowerCase() === newPerson.name.toLowerCase())) {
  //  response.status(409).json({'error': 'Name already exists'})
  } else {
    Person.findOne( { name: newPerson.name })
      .then(person => {
        if (person) response.status(409).json({ 'error': 'Name already exists' })
        else {
          newPerson.save().then(result => {
            response.json(result)
          }).catch(error => next(error))
        }
      })
      .catch(error => next(error))
  }
})

app.put('/api/persons/:id', (request, response, next) => {
  const newNumber = request.body.number
  if (!(newNumber)) response.status(400).json({ 'error': 'Updated number missing' })
  Person.findByIdAndUpdate(request.params.id, { $set: { number: newNumber } }, { new: true, runValidators: true, context: 'query' })
    .then(person => {
      if (person) response.json(person)
      else response.status(404).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: '404 unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformed id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})