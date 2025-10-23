const storageService = require('../services/storageService');

const getValue = async (req, res, next) => {
  try {
    const { key } = req.params;
    const entry = await storageService.getValue(key);
    if (typeof entry === 'undefined') {
      return res.status(404).json({ error: 'Key not found' });
    }
    return res.json(entry);
  } catch (error) {
    return next(error);
  }
};

const setValue = async (req, res, next) => {
  try {
    const { key } = req.params;
    if (typeof req.body.value === 'undefined') {
      return res.status(400).json({ error: 'Missing value in request body' });
    }
    const entry = await storageService.setValue(key, req.body.value);
    return res.status(201).json(entry);
  } catch (error) {
    return next(error);
  }
};

const deleteValue = async (req, res, next) => {
  try {
    const { key } = req.params;
    const deleted = await storageService.deleteValue(key);
    if (!deleted) {
      return res.status(404).json({ error: 'Key not found' });
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

const getAllValues = async (req, res, next) => {
  try {
    const entries = await storageService.getAll();
    return res.json(entries);
  } catch (error) {
    return next(error);
  }
};

const bulkGetValues = async (req, res, next) => {
  try {
    const { keys } = req.body;
    if (!Array.isArray(keys)) {
      return res.status(400).json({ error: 'keys must be an array' });
    }
    const entries = await storageService.bulkGet(keys);
    return res.json(entries);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getValue,
  setValue,
  deleteValue,
  getAllValues,
  bulkGetValues,
};
