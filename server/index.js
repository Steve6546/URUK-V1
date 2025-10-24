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
  'https://uruk-v1-three.vercel.app',
  'https://*.trycloudflare.com',
  'https://*.cfargotunnel.com',
];

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parseOrigins = (originsEnv) => {
  if (!originsEnv) {
    return DEFAULT_ALLOWED_ORIGINS;
  }
  return originsEnv
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const buildOriginMatchers = (origins) =>
  origins.map((pattern) => {
    if (pattern === '*') {
      return () => true;
    }
    if (pattern.includes('*')) {
      const regex = new RegExp(
        `^${pattern.split('*').map(escapeRegExp).join('.*')}$`
      );
      return (origin) => regex.test(origin);
    }
    return (origin) => origin === pattern;
  });

const allowedOrigins = parseOrigins(process.env.CORS_ALLOWED_ORIGINS);
const allowedOriginMatchers = buildOriginMatchers(allowedOrigins);
const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
const ALLOWED_HEADERS = ['Content-Type', 'Authorization'];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    const isAllowed = allowedOriginMatchers.some((matcher) => {
      try {
        return matcher(origin);
      } catch (err) {
        return false;
      }
    });
    if (isAllowed) {
      return callback(null, true);
    }
    // eslint-disable-next-line no-console
    console.warn(`Blocked CORS request from disallowed origin: ${origin}`);
    return callback(
      new Error(`Origin ${origin} not allowed by CORS configuration`)
    );
  },
  methods: ALLOWED_METHODS,
  allowedHeaders: ALLOWED_HEADERS,
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', ALLOWED_METHODS.join(', '));
  res.header('Access-Control-Allow-Headers', ALLOWED_HEADERS.join(', '));
  next();
});

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
