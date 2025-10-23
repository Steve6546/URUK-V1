const fs = require('fs/promises');
const path = require('path');

const STORAGE_FILE = path.join(__dirname, '..', 'data', 'storage.json');

const DEFAULT_ARRAY_KEYS = [
  'users',
  'notifications',
  'lotteryParticipants',
  'chatMessages',
  'chatRooms',
  'userCounters',
  'purchaseHistory',
  'lotteryHistory',
];

let cache = null;
let writeQueue = Promise.resolve();

function defaultValueFor(key) {
  if (DEFAULT_ARRAY_KEYS.includes(key)) {
    return [];
  }
  return null;
}

async function ensureStorageFile() {
  try {
    await fs.access(STORAGE_FILE);
  } catch (err) {
    await fs.mkdir(path.dirname(STORAGE_FILE), { recursive: true });
    const initialData = DEFAULT_ARRAY_KEYS.reduce((acc, key) => {
      acc[key] = defaultValueFor(key);
      return acc;
    }, {});
    await fs.writeFile(STORAGE_FILE, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

async function persist(storage) {
  cache = storage;
  writeQueue = writeQueue.then(() =>
    fs.writeFile(STORAGE_FILE, JSON.stringify(storage, null, 2), 'utf8')
  );
  await writeQueue;
  return storage;
}

async function loadStorage() {
  if (cache) {
    return cache;
  }

  await ensureStorageFile();
  const raw = await fs.readFile(STORAGE_FILE, 'utf8');
  let parsed;
  try {
    parsed = JSON.parse(raw || '{}');
  } catch (err) {
    parsed = {};
  }

  let mutated = false;
  DEFAULT_ARRAY_KEYS.forEach((key) => {
    if (typeof parsed[key] === 'undefined') {
      parsed[key] = defaultValueFor(key);
      mutated = true;
    }
  });

  cache = parsed;
  if (mutated) {
    await persist(cache);
  }
  return cache;
}

async function getAll() {
  const storage = await loadStorage();
  return storage;
}

async function getValue(key) {
  const storage = await loadStorage();
  if (typeof storage[key] === 'undefined') {
    const fallback = defaultValueFor(key);
    if (fallback !== null) {
      storage[key] = fallback;
      await persist(storage);
      return fallback;
    }
    return undefined;
  }
  return storage[key];
}

async function setValue(key, value) {
  const storage = await loadStorage();
  storage[key] = value;
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
  let mutated = false;
  const result = keys.reduce((acc, key) => {
    if (typeof storage[key] === 'undefined') {
      const fallback = defaultValueFor(key);
      if (fallback !== null) {
        storage[key] = fallback;
        acc[key] = fallback;
        mutated = true;
      }
    } else {
      acc[key] = storage[key];
    }
    return acc;
  }, {});

  if (mutated) {
    await persist(storage);
  }
  return result;
}

module.exports = {
  getAll,
  getValue,
  setValue,
  deleteValue,
  bulkGet,
};
