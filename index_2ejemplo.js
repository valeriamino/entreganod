const express = require("express")
const app = express()
const port = 3000

app.get('/', (req, res) => {
  let animalfav = "perro";
  res.send('Mi animal favorito es: ' + animalfav )
});

app.post('/', (req, res) => {
  res.send('Hello World! desde post')
});

app.put('/', (req, res) => {
  res.send('Hello World! desde put')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})