// Client-side cache for processed files using IndexedDB.
//
// We cache the processed output (GIF/MP4/ZIP) in the browser so we can navigate
// the user away from the FFmpeg tool page (which sets restrictive COEP/COOP
// headers that block AdSense) to the /download page (permissive headers, ads
// allowed) and still hand them the exact bytes we produced — without
// re-processing or uploading anything to a server.
//
// localStorage can't be used here: it only stores strings and caps at ~5MB,
// while processed videos/ZIPs are routinely larger. IndexedDB stores Blobs
// natively with a much higher quota.

const DB_NAME = 'reversegif-downloads';
const STORE_NAME = 'files';
const DB_VERSION = 1;

// Cached records older than this are pruned on the next store() so the DB
// doesn't grow unbounded across sessions.
const MAX_AGE_MS = 60 * 60 * 1000; // 1 hour

function isAvailable() {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function tx(db, mode) {
  return db.transaction(STORE_NAME, mode).objectStore(STORE_NAME);
}

// Remove records older than MAX_AGE_MS. Best-effort; failures are ignored.
async function prune(db) {
  return new Promise((resolve) => {
    try {
      const store = tx(db, 'readwrite');
      const cutoff = Date.now() - MAX_AGE_MS;
      const cursorReq = store.openCursor();
      cursorReq.onsuccess = () => {
        const cursor = cursorReq.result;
        if (!cursor) {
          resolve();
          return;
        }
        if (cursor.value && cursor.value.createdAt < cutoff) {
          cursor.delete();
        }
        cursor.continue();
      };
      cursorReq.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

/**
 * Store a processed file and return its cache id.
 *
 * @param {Object} entry
 * @param {Blob}   entry.blob      The processed output bytes.
 * @param {string} entry.name      Suggested download filename.
 * @param {string} entry.mimeType  MIME type of the output.
 * @param {number} [entry.size]    Size in bytes (defaults to blob.size).
 * @param {number} [entry.frameCount] Number of frames, for ZIP frame exports.
 * @returns {Promise<string>} The generated id to pass to /download?id=...
 */
export async function storeDownload({ blob, name, mimeType, size, frameCount = 0 }) {
  if (!isAvailable()) {
    throw new Error('IndexedDB is not available in this browser');
  }
  const db = await openDB();
  await prune(db);

  const id = generateId();
  const record = {
    id,
    blob,
    name,
    mimeType: mimeType || blob.type || 'application/octet-stream',
    size: typeof size === 'number' ? size : blob.size,
    frameCount,
    createdAt: Date.now(),
  };

  await new Promise((resolve, reject) => {
    const request = tx(db, 'readwrite').put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });

  db.close();
  return id;
}

/**
 * Retrieve a cached download by id.
 * @param {string} id
 * @returns {Promise<Object|null>} The stored record, or null if not found.
 */
export async function getDownload(id) {
  if (!isAvailable() || !id) return null;
  const db = await openDB();
  const record = await new Promise((resolve, reject) => {
    const request = tx(db, 'readonly').get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return record;
}

/**
 * Delete a cached download by id (best-effort).
 * @param {string} id
 */
export async function deleteDownload(id) {
  if (!isAvailable() || !id) return;
  const db = await openDB();
  await new Promise((resolve) => {
    const request = tx(db, 'readwrite').delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => resolve();
  });
  db.close();
}
