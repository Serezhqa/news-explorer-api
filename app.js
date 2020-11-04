require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');
const errorHandler = require('./middlewares/error-handler');
const { PORT, DATABASE } = require('./config');
const limiter = require('./middlewares/ratelimiter');

const app = express();

mongoose.connect(`mongodb://localhost:27017/${DATABASE}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://www.diploma.students.nomoreparties.co',
    'https://www.diploma.students.nomoreparties.co',
    'http://diploma.students.nomoreparties.co',
    'https://diploma.students.nomoreparties.co',
  ],
  credentials: true,
}));
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
