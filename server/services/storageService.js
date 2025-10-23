const fs = require('fs/promises');
const path = require('path');

const STORAGE_FILE = path.join(__dirname, '..', 'data', 'storage.json');

let cache = null;
let writeQueue = Promise.resolve();

async function ensureStorageFile() {
  try {
    await fs.access(STORAGE_FILE);
  } catch (err) {
    await fs.mkdir(path.dirname(STORAGE_FILE), { recursive: true });
    await fs.writeFile(STORAGE_FILE, JSON.stringify({}), 'utf8');
  }
}

async function loadStorage() {
  if (cache) {
    return cache;
  }
  await ensureStorageFile();
  const raw = await fs.readFile(STORAGE_FILE, 'utf8');
  try {
    cache = JSON.parse(raw || '{}');
  } catch (err) {
    cache = {};
  }
  return cache;
}

async function persist(storage) {
  cache = storage;
  writeQueue = writeQueue.then(() => fs.writeFile(
    STORAGE_FILE,
    JSON.stringify(storage, null, 2),
    'utf8'
  ));
  await writeQueue;
  return storage;
}

async function getAll() {
  const storage = await loadStorage();
  return storage;
}

async function getValue(key) {
  const storage = await loadStorage();
  return storage[key];
}

async function setValue(key, value) {
  const storage = await loadStorage();
  storage[key] = {
    value,
    updatedAt: new Date().toISOString(),
  };
  await persist(storage);
  return storage[key];
}

async function deleteValue(key) {
  const storage = await loadStorage();
  if (Object.prototype.hasOwnProperty.call(storage, key)) {
    delete storage[key];
    await persist(storage);
    return true;
  }
  return false;
}

async function bulkGet(keys) {
  const storage = await loadStorage();
  return keys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(storage, key)) {
      acc[key] = storage[key];
    }
    return acc;
  }, {});
}

module.exports = {
  getAll,
  getValue,
  setValue,
  deleteValue,
  bulkGet,
};
