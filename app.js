const express = require('express')
const app = express()
const port = 4000

const exphbs = require('express-handlebars')
//載入express-handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
//把引琴設定成hbs

//setting static files
app.use(express.static('public'))


app.get('/', (req, res) => {
  // res.send(`hi hello`)
  res.render('index')
})

app.listen(port, () => {
  console.log(`working on ${port}`)
})