import test from 'node:test';
import assert from 'node:assert/strict';
import { getSavedRecords, saveRecord, deleteRecord } from '../services/storageService.js';

// Polyfill localStorage for Node.js test environment if absent
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
}

test('storageService isolates user records per identifier', () => {
  const user1 = 'user_alpha@test.com';
  const user2 = 'user_beta@test.com';

  const record1 = { patientInfo: { patientIdName: 'Alice' }, records: [] };
  const saved1 = saveRecord(record1, null, user1);

  assert.ok(saved1.id);

  const user1Records = getSavedRecords(user1);
  const user2Records = getSavedRecords(user2);

  assert.equal(user1Records.length, 1);
  assert.equal(user2Records.length, 0);
  assert.equal(user1Records[0].patientInfo.patientIdName, 'Alice');

  deleteRecord(saved1.id, user1);
  assert.equal(getSavedRecords(user1).length, 0);
});
