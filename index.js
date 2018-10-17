//app.js
require('dotenv').config();
const express = require('express');

const bodyParser = require('body-parser');

const router = require('./routes');

const { errorHandler } = require('./middlewares');

const app = express();

const path = require('path');
const http = require('http');
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

app.use(errorHandler);



app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});

/*

app.listen(process.env.PORT, () => console.log('App listening on port 3000'));

*/
