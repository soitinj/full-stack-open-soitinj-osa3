const mongoose = require('mongoose')

if ((process.argv.length !== 3) && (process.argv.length !== 5)) {
  console.log("Run program as 'node mongo.js <db_password> <name> <number>' or 'node mongo.js <db_password>'")
  process.exit(1)
}
const password = process.argv[2]
const dbUrl = `mongodb+srv://soitinj:${password}@fso-cluster.2fctdpu.mongodb.net/?retryWrites=true&w=majority&appName=fso-cluster`

mongoose.set('strictQuery', false)
mongoose.connect(dbUrl)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', phonebookSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  const addPerson = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  addPerson.save().then(result => {
    console.log(`added ${addPerson.name} number ${addPerson.number} to phonebook`)
    mongoose.connection.close()
  })
}
