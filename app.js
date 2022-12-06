const { query } = require('express')
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

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurantData = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurants: restaurantData, keyword: keyword })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant =>
    restaurant.id.toString() === req.params.restaurant_id)
  console.log('request', req.params)
  res.render('show', { restaurant: restaurant })
})

app.listen(port, () => {
  console.log(`working on ${port}`)
})