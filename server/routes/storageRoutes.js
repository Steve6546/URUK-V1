const express = require('express');
const router = express.Router();
const storageController = require('../controllers/storageController');

router.get('/', storageController.getAllValues);
router.post('/bulk', storageController.bulkGetValues);
router.get('/:key', storageController.getValue);
router.put('/:key', storageController.setValue);
router.delete('/:key', storageController.deleteValue);

module.exports = router;
