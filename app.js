require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const theRoutes = require('./routes/routes')
const compression = require('compression');
const cors = require('cors');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));
app.use(cors());
app.use(compression());

app.set("view engine", "ejs");
app.set('views', './views')
// Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/', theRoutes)

app.listen(process.env.PORT,
    () => console.log(`Example app listening at http://localhost:${process.env.PORT}`));

