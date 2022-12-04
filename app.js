const express = require('express')
const app = express()
const port = 4000

const exphbs = require('express-handlebars')
//載入express-handlebars
const restaurantList = require('./restaurant.json')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
//把引琴設定成hbs

//setting static files
app.use(express.static('public'))


// app.get('/', (req, res) => {
//   // res.send(`hi hello`)
//   res.render('index')
// })
app.get('/', (req, res) => {

  // past the movie data into 'index' partial template
  res.render('index', { restaurants: restaurantList.results });
})

app.get('/', (req, res) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8]
  res.render('index', { number: numbers })
})

app.listen(port, () => {
  console.log(`working on ${port}`)
})