const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const path = require('path');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// const hbs = exphbs.create();
const hbs = exphbs.create({
  layoutsDir: path.join(__dirname, 'views/layouts'),
  helpers: { withAuth: require('./auth')}
});

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));
app.set('view engine', 'handlebars');
app.engine('handlebars', hbs.engine);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Set MIME type for CSS file
app.get('/public/Stylesheets/main.css', (req, res) => {
  res.type('text/css');
  res.sendFile(__dirname + '/public/Stylesheets/main.css');
});

app.set('views', path.join(__dirname, 'views'));

// Set the template engine to render views from the views directory with our routes defined in /controllers.
app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on ${PORT}`));
});

