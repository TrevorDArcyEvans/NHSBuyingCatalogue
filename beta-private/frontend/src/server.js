require('dotenv').config()

const path = require('path')

const { PORT = 8000 } = process.env

const express = require('express')
const expresshbs = require('express-handlebars')

const app = express()

app.enable('strict routing')

const session = require('express-session')
app.use(session({
  secret: process.env.SESSION_SECRET ||
            Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36),
  resave: false,
  saveUninitialized: false
}))

app.use(require('body-parser').urlencoded({ extended: true }))

if (process.env.NODE_ENV === 'development') {
  app.get('/styles.css', require('node-sass-middleware')({
    src: path.join(__dirname, 'styles'),
    response: true
  }))
}

app.use(require('serve-static')(path.join(__dirname, 'static'), {
  index: false
}))

const viewPath = path.join(__dirname, 'views')
app.engine('html', expresshbs({
  layoutsDir: path.join(viewPath, 'layouts'),
  defaultLayout: 'layout.html',
  extname: '.html',
  partialsDir: path.join(viewPath, 'partials')
}))
app.set('view engine', 'html')
app.set('views', viewPath)

const { authentication, authorisation } = require('catalogue-authn-authz')

authentication(app).then(() => {
  // middleware to set global template context variables
  app.use('*', (req, res, next) => {
    res.locals.user = req.user
    res.locals.meta = {}
    next()
  })

  app.get('/', (req, res) => {
    const redirectTo = req.session.redirectTo
    req.session.redirectTo = null

    if (redirectTo) {
      res.redirect(redirectTo)
    } else if (req.user && req.user.org && req.user.org.isSupplier) {
      res.redirect('/suppliers')
    } else if (req.user && req.user.org && req.user.org.isNHSDigital) {
      res.redirect('/assessment')
    } else {
      res.render('index')
    }
  })

  app.get('/about', (req, res) => {
    res.locals.meta.title = 'About'
    res.render('about')
  })

  app.use('/suppliers/', authorisation.suppliersOnly, require('./routes/supplier'))
//  app.use('/assessment', authorisation.assessmentTeamOnly, require('./routes/assessment'))

  // automatically redirect to canonical path (with or without trailing slash)
  // routes mostly use trailing slashes to enable path-relative URLs
  app.use(require('express-slash')())

  // generic error handler
  app.use((err, req, res, next) => {
    res.status(500)
    res.render('error', { error: err })
  })

  app.listen(PORT)
})