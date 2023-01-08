const { query } = require('express')
const express = require('express')
const mongoose = require('mongoose')
const port = 4000
const exphbs = require('express-handlebars')
//載入express-handlebars
const app = express()
const RestaurantList = require('./models/restaurants')
const restaurantList = require('./restaurant.json')
const bodyParser = require('body-parser')

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
//connect to mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

//把引琴設定成hbs
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))

//setting static files
app.use(express.static('public'))

// search & sort 
app.get('/', (req, res) => {
  // res.render('index', { restaurants: restaurantList.results });
  RestaurantList.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

// create new page
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', (req, res) => {
  console.log(req.body)
  return RestaurantList.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


// show page
app.get('/restaurants/:restaurant_id', (req, res) => {
  const _id = req.params.restaurant_id
  console.log(_id)
  return RestaurantList.findById(_id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))

})

// edit page
app.get('/restaurants/:restaurant_id/edit', (req, res) => {
  const _id = req.params.restaurant_id
  return RestaurantList.findById(_id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.post('/restaurants/:restaurant_id/edit', (req, res) => {
  const _id = req.params.restaurant_id
  const body = req.body
  console.log(body)
  return RestaurantList.findById(_id)
    .then(data => {
      data.body = body
      return data.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurantData = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurants: restaurantData, keyword: keyword })
})

app.listen(port, () => {
  console.log(`working on ${port}`)
})