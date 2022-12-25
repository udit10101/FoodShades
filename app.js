const fs = require('fs')
const http = require('http')
const url = require('url')
const bodyParser = require('body-parser')
const express = require('express')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const { pool } = require('./dbConfig')
require('dotenv').config()
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
app.use(express.static(`${__dirname}/public`))
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.text())

const initializePassport = require('./passportConfig')

const replacedishtemplate = require('./replaceFunctions/replacedishtemplate')
const replaceTemplate = require('./replaceFunctions/replaceTemplate')
const replaceOrderTemplate = require('./replaceFunctions/replaceOrderTemplate')
const { connected } = require('process')

const PORT = process.env.PORT || 8000
console.log(`Db is ${process.env.DB_DATABASE}`)
//To read Templates and other Files
const tempCard = fs.readFileSync(`${__dirname}/templates/temp-res-card.html`, 'utf-8')
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempResPage = fs.readFileSync(`${__dirname}/templates/restaurant.html`, 'utf-8')
const tempDishCard = fs.readFileSync(`${__dirname}/templates/temp-dish-card.html`, 'utf-8')
const tempDishOverview = fs.readFileSync(`${__dirname}/templates/temp-overview-dishes.html`, 'utf-8')
const tempForm = fs.readFileSync(`${__dirname}/templates/temp-form.html`, 'utf-8')
const resAuth = fs.readFileSync(`${__dirname}/templates/resauth.html`, 'utf-8')
const dishform = fs.readFileSync(`${__dirname}/templates/template-dish-form.html`, 'utf-8')
const orderPlacedDishes = fs.readFileSync(`${__dirname}/templates/orderPlacedDishes.html`, 'utf-8')
const orderPlaced = fs.readFileSync(`${__dirname}/templates/orderPlaced.html`, 'utf-8')
const orderPlacedBill = fs.readFileSync(`${__dirname}/templates/orderPlacedBill.html`, 'utf-8')
const pastOrderTemplate = fs.readFileSync(`${__dirname}/templates/temp-past-order.html`, 'utf-8')
const pastOrderOverviewTemplate = fs.readFileSync(`${__dirname}/templates/temp-pastorders-overview.html`, 'utf-8')

app.set('view engine', 'ejs')

initializePassport(passport)

// Middleware

// Parses details from a form
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')

app.use(
  session({
    // Key we want to keep secret which will encrypt all of our information
    secret: process.env.SESSION_SECRET,
    // Should we resave our session variables if nothing has changes which we dont
    resave: false,
    // Save empty value if there is no value which we do not want to do
    saveUninitialized: false,
  })
)
// Funtion inside passport which initializes passport
app.use(passport.initialize())
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session())
app.use(flash())

//Getting Restaurant Names
const resNamesObj = []
async function getNames() {
  const rn = await pool.query(`Select * from resnames`)
  for (let i = 0; i < rn.rows.length; i++) {
    resNamesObj.push(rn.rows[i])
  }
}
getNames()
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/home')
  }
  next()
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/users/login')
}
//Routes
app.get('/', (req, res) => {
  res.render('index2')
})
app.get('/users/register', checkAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.get('/users/login', checkAuthenticated, (req, res) => {
  // flash sets a messages variable. passport sets the error message
  // console.log(req.session.flash.error)
  res.render('login.ejs')
})

app.get('/users/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect('/users/login')
  })
})

app.post('/users/register', async (req, res) => {
  let { name, email, password, password2 } = req.body

  let errors = []

  if (!name || !email || !password || !password2) {
    errors.push({ message: 'Please enter all fields' })
  }

  if (password.length < 6) {
    errors.push({ message: 'Password must be a least 6 characters long' })
  }

  if (password !== password2) {
    errors.push({ message: 'Passwords do not match' })
  }

  if (errors.length > 0) {
    res.render('register', { errors, name, email, password, password2 })
  } else {
    hashedPassword = await bcrypt.hash(password, 10)

    // Validation passed
    pool.query(
      `SELECT * FROM users
        WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          console.log(err)
        }

        if (results.rows.length > 0) {
          return res.render('register', {
            message: 'Email already registered',
          })
        } else {
          pool.query(
            `INSERT INTO users (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING id, password`,
            [name, email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err
              }

              req.flash('success_msg', 'You are now registered. Please log in')
              res.redirect('/users/login')
            }
          )
        }
      }
    )
  }
})

app.post(
  '/users/login',
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/users/login',
    failureFlash: true,
  })
)

app.get('/home', checkNotAuthenticated, async (req, res) => {
  let resObjs = []
  for (var i = 0; i < resNamesObj.length; i++) {
    const data = await pool.query(`Select * from additionalinfo where resname='${resNamesObj[i].resname}'`)

    resObjs.push(data.rows[0])
  }
  const cardsHtml = resObjs.map((el) => replaceTemplate(el, tempCard)).join('')
  let output = tempOverview.replace('{%res-cards%}', cardsHtml)
  output = output.replace('{%nav-color-all%}', 'nav-color-all')
  res.send(output)
})
app.get('/useraccount', checkNotAuthenticated, async (req, res) => {
  const user = req.user
  res.render('account', { user })
})
app.get('/VegOnly', checkNotAuthenticated, async (req, res) => {
  let resObjs = []

  const data = await pool.query(`Select * from additionalinfo where category='V'`)
  for (let i = 0; i < data.rows.length; i++) {
    resObjs.push(data.rows[i])
  }
  const cardsHtml = resObjs.map((el) => replaceTemplate(el, tempCard)).join('')
  let output = tempOverview.replace('{%res-cards%}', cardsHtml)
  output = output.replace('{%nav-color-vegonly%}', 'nav-color-vegonly')
  res.send(output)
})
app.get('/ByRating', checkNotAuthenticated, async (req, res) => {
  let resObjs = []
  for (var i = 0; i < resNamesObj.length; i++) {
    const data = await pool.query(`Select * from additionalinfo where resname='${resNamesObj[i].resname}'`)

    resObjs.push(data.rows[0])
  }
  resObjs.sort((a, b) => b.totrating - a.totrating)
  const cardsHtml = resObjs.map((el) => replaceTemplate(el, tempCard)).join('')
  let output = tempOverview.replace('{%res-cards%}', cardsHtml)
  output = output.replace('{%nav-color-rating%}', 'nav-color-rating')
  res.send(output)
})
app.get('/ByDeliveryTime', checkNotAuthenticated, async (req, res) => {
  let resObjs = []
  for (var i = 0; i < resNamesObj.length; i++) {
    const data = await pool.query(`Select * from additionalinfo where resname='${resNamesObj[i].resname}'`)

    resObjs.push(data.rows[0])
  }
  resObjs.sort((a, b) => a.deliverytime - b.deliverytime)
  const cardsHtml = resObjs.map((el) => replaceTemplate(el, tempCard)).join('')
  let output = tempOverview.replace('{%res-cards%}', cardsHtml)
  output = output.replace('{%nav-color-deliverytime%}', 'nav-color-deliverytime')

  res.send(output)
})
app.get('/Category=:dish', checkNotAuthenticated, async (req, res) => {
  let resObjs = []

  const data = await pool.query(`Select * from additionalinfo where typefood='${req.params.dish}'`)
  for (let i = 0; i < data.rows.length; i++) {
    resObjs.push(data.rows[i])
  }
  const cardsHtml = resObjs.map((el) => replaceTemplate(el, tempCard)).join('')
  let output = tempOverview.replace('{%res-cards%}', cardsHtml)
  output = output.replace('{%nav-color-c%}', 'nav-color-c')

  res.send(output)
})
app.get('/Restaurants', checkNotAuthenticated, async (req, res) => {
  let resObjs = []
  const data = await pool.query(`Select * from additionalinfo where resname='${req.query.rname}'`)

  resObjs.push(data.rows[0])

  const output = resObjs.map((el) => replaceTemplate(el, tempResPage)).join('')

  const data2 = await pool.query(`Select * from "${req.query.rname}"`)
  const dishesHtml = data2.rows.map((el) => replacedishtemplate(el, tempDishCard)).join('')

  const output2 = output.replace('{%dishes%}', dishesHtml)

  // console.log(output2)
  res.send(output2)
})
app.get('/form=:restname', async (req, res) => {
  let resObjs = []
  const data = await pool.query(`Select * from additionalinfo where resname='${req.params.restname}'`)
  resObjs.push(data.rows[0])

  const output = resObjs.map((el) => replaceTemplate(el, tempForm)).join('')
  const data2 = await pool.query(`Select * from "${req.params.restname}"`)
  const dishesHtml = data2.rows.map((el) => replacedishtemplate(el, dishform)).join('')
  const output2 = output.replace('{%dishes%}', dishesHtml)
  res.send(output2)
})
app.get('/resAuth', async (req, res) => {
  res.send(resAuth)
})
app.post('/resAuth', urlencodedParser, async (req, res) => {
  let flag = 0
  for (var i = 0; i < resNamesObj.length; i++) {
    const data = await pool.query(`Select * from additionalinfo where resname='${resNamesObj[i].resname}'`)
    if (data.rows[0].resname == req.body.resnameinp) {
      if (data.rows[0].respassword == req.body.respassinp) {
        flag = 1

        res.redirect(`/form=${req.body.resnameinp}`)
      } else {
        flag = 2
        res.send('INCORRECT details')
      }
    }
  }
  if (flag === 0) {
    res.send('INCORRECT details')
  }
})
app.post('/resUpdate=:restname', urlencodedParser, async (req, res) => {
  let { olddishname, dishname, imglink, price, descr, category } = req.body

  const flag = await pool.query(`select dishid from "${req.params.restname}" where dishname='${olddishname}'`)
  if (flag.rows[0]) {
    await pool.query(`UPDATE "${req.params.restname}" SET dishname='${dishname}',price=${price},dishimglink='${imglink}',category='${category}' where dishname='${olddishname}' `)
  } else {
    let dishid = await pool.query(`select dishid from "${req.params.restname}"`)
    const len = dishid.rows.length + 1
    await pool.query(`insert into "${req.params.restname}" VALUES(${len},'${req.body.dishname}',${req.body.price},'${req.body.category}','${req.body.descr}','${req.body.imglink}') `)
  }
  res.redirect(`/form=${req.params.restname}`)
})
app.post('/updateUserInfo', checkNotAuthenticated, urlencodedParser, async (req, res) => {
  let { accountName, email, accountAddress } = req.body

  pool.query(`UPDATE users SET name='${accountName}',address='${accountAddress}' WHERE id = ${req.user.id}  `, (err, results) => {
    if (err) {
      throw err
    }

    req.flash('success_msg', 'INFO UPDATED SUCCESSFULLY')
    res.redirect('/useraccount')
  })
})
app.post('/updateUserPassword', checkNotAuthenticated, urlencodedParser, async (req, res) => {
  let errors = []
  let { accountOldPassword, accountNewPassword, accountConfirmNewPassword } = req.body
  if (!accountOldPassword || !accountNewPassword || !accountConfirmNewPassword) {
    req.flash('err_msg_password', 'Please enter all fields')
    res.redirect('/useraccount')
  } else if (accountNewPassword.length < 6) {
    req.flash('err_msg_password', 'Password must be at least 6 characters long')
    res.redirect('/useraccount')
  } else {
    const userpassword = req.user.password
    const hashedPassword = await bcrypt.hash(accountNewPassword, 10)
    bcrypt.compare(accountOldPassword, userpassword, (err, isMatch) => {
      if (err) {
        console.log(err)
      } else {
        if (isMatch) {
          if (accountNewPassword === accountConfirmNewPassword) {
            pool.query(`UPDATE users SET password='${hashedPassword}' WHERE id = ${req.user.id}  `, (err, results) => {
              if (err) {
                throw err
              }

              req.flash('success_msg_password', 'PASSWORD UPDATED SUCCESSFULLY')
              res.redirect('/useraccount')
            })
          } else {
            req.flash('err_msg_password', 'New password and Confirm Password does not match')
            res.redirect('/useraccount')
          }
        } else {
          req.flash('err_msg_password', 'Old Password is incorrect')

          res.redirect('/useraccount')
        }
      }
    })
  }
})
app.post('/cartItems', checkNotAuthenticated, async (req, res) => {
  const data = JSON.parse(req.body)
  let dishnames = data.dishnames
  let quantity = data.quantity
  let dishtotal = data.dishtotal
  let totalprice = data.totalprice
  let resname = data.resname
  let date = data.date

  let transId
  for (var i = 0; i < dishnames.length; i++) {
    if (i == 0) {
      transId = await pool.query(`INSERT INTO "Past Orders" (userid,dishname,quantity,dishtotal,resname,date) Values(${req.user.id},'${dishnames[i]}',${quantity[i]},${dishtotal[i]},'${resname}','${date}') RETURNING transId`)
    } else {
      await pool.query(`INSERT INTO "Past Orders" (transid,userid,dishname,quantity,dishtotal,resname,date) Values(${transId.rows[0].transid},${req.user.id},'${dishnames[i]}',${quantity[i]},${dishtotal[i]},'${resname}','${date}')`)
    }
  }
})
app.get('/orderDetails', checkNotAuthenticated, async (req, res) => {
  const dishesData = []
  const quantity = []
  const dishtotal = []
  let subtotal = 0

  const data = await pool.query(`SELECT * FROM "Past Orders" where userid=${req.user.id} and transid=(SELECT MAX(transid) from "Past Orders" where userid=${req.user.id})`)

  for (var i = 0; i < data.rows.length; i++) {
    quantity.push(data.rows[i].quantity)
    dishtotal.push(data.rows[i].dishtotal)
    const data1 = await pool.query(`SELECT * FROM "${data.rows[i].resname}" where dishname='${data.rows[i].dishname}'`)
    subtotal += data.rows[i].dishtotal
    dishesData.push(data1.rows[0])
  }

  let cardsHtml = dishesData.map((el) => replacedishtemplate(el, orderPlacedDishes)).join('')

  let cardsHtml2 = dishesData.map((el) => replacedishtemplate(el, orderPlacedBill)).join('')
  let output = orderPlaced.replace('{%dishesordered%}', cardsHtml)
  output = output.replace('{%billdetailscart%}', cardsHtml2)

  //For 2 templates Hence 2 times for loop
  for (let i = 0; i < quantity.length; i++) {
    output = output.replace('{%quantity%}', quantity[i])
  }
  for (let i = 0; i < quantity.length; i++) {
    output = output.replace('{%quantity%}', quantity[i])
  }
  for (let i = 0; i < quantity.length; i++) {
    output = output.replace('{%dish-total%}', dishtotal[i])
  }
  output = output.replace('{%res-name%}', data.rows[0].resname)
  output = output.replace('{%subtotal%}', subtotal)
  output = output.replace('{%total%}', subtotal + 40)

  res.send(output)
})
app.post('/ratingUpdate', async (req, res) => {
  let data = JSON.parse(req.body)
  let data1 = await pool.query(`SELECT numrating,totrating FROM additionalinfo WHERE resname='${data.resname}' `)
  let newnumrating = data1.rows[0].numrating + 1
  let newtotrating = (data1.rows[0].numrating * data1.rows[0].totrating + data.ratings) / newnumrating
  await pool.query(`UPDATE additionalinfo SET numrating=${newnumrating},totrating=${newtotrating} where resname='${data.resname}'`)
})
app.get('/pastOrders', checkNotAuthenticated, async (req, res) => {
  const userId = req.user.id
  const maxTransIdArrayObj = await pool.query(`SELECT max(transid)  FROM "Past Orders" where userid=${userId}`)
  const minTransIdArrayObj = await pool.query(`SELECT min(transid)  FROM "Past Orders" where userid=${userId}`)

  let ordersHtml = ''
  const maxTransId = maxTransIdArrayObj.rows[0].max - 0
  const minTransId = minTransIdArrayObj.rows[0].min - 0
  // console.log(maxTransId)
  // console.log(minTransId)
  for (let i = maxTransId; i >= minTransId; i--) {
    let orders = await pool.query(`SELECT * FROM "Past Orders" where transid=${i} AND userid=${userId}`)
    if (orders.rows.length > 0) {
      ordersHtml += replaceOrderTemplate(orders.rows, pastOrderTemplate)
      let data = await pool.query(`SELECT resimglink,location from additionalinfo where resname='${orders.rows[0].resname}'`)
      ordersHtml = ordersHtml.replace(/{%res-img%}/g, data.rows[0].resimglink)
      ordersHtml = ordersHtml.replace(/{%location%}/g, data.rows[0].location)
    }
  }
  let output = pastOrderOverviewTemplate.replace('{%pastorders%}', ordersHtml)
  res.send(output)
})
app.listen(PORT, () => {
  console.log(`Listening to requests on port ${PORT}`)
})
