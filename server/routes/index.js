const express = require('express');
const router = express.Router();

const testRoutes = require('./testRoutes');
const storageRoutes = require('./storageRoutes');

router.use('/test', testRoutes);
router.use('/storage', storageRoutes);

module.exports = router;
