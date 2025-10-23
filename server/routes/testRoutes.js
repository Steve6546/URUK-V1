const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

router.get('/', testController.getTestMessage);

module.exports = router;
