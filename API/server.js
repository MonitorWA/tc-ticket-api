const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const moment = require('moment');
const localisation = require('moment/locale/en-au');

// Set locale for moment date conversion
moment.updateLocale('en-au', localisation);

const errorHandler = require('./middleware/error');

//Load ENV vars
dotenv.config({ path: './config/config.env' });

// Set moment locale
moment.locale;

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Set security headers
app.use(helmet());
// Prevent XSS attacks
app.use(xss());
// Enable CORS
app.use(cors({ origin: true }));
// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 1000, // Max requests
});
app.use(limiter);
// Prevent http param pollution
app.use(hpp());
// File uploading
app.use(fileUpload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const eventsRouter = require('./routes/events');
const ticketsRouter = require('./routes/tickets');
const transactionsRouter = require('./routes/transactions');
const cardsRouter = require('./routes/cards');

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/events', eventsRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/cards', cardsRouter);

// Error Handling (must be after mounting routers)
app.use(errorHandler);

module.exports = app;
