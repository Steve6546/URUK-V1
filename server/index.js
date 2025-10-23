require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
];

const parseOrigins = (originsEnv) => {
  if (!originsEnv) {
    return DEFAULT_ALLOWED_ORIGINS;
  }
  return originsEnv
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const allowedOrigins = parseOrigins(process.env.CORS_ALLOWED_ORIGINS);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(
        new Error(`Origin ${origin} not allowed by CORS configuration`)
      );
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'URUK backend is running',
    docs: '/api',
  });
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});
