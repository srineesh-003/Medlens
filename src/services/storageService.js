/**
 * MedLens User Data Isolated Storage Service
 * 
 * Rules:
 * 1. Patient medical data belongs ONLY to the authenticated user.
 * 2. User A cannot view, edit, or access User B's patient records.
 * 3. Never store passwords, OTPs, or authentication secrets in localStorage.
 * 4. User-isolated storage keys ensure complete data privacy per session.
 */

const BASE_KEY = 'medlens_saved_records_';

/**
 * Returns user-isolated storage key
 */
function getStorageKey(userIdentifier) {
  if (!userIdentifier || typeof userIdentifier !== 'string') {
    return `${BASE_KEY}guest`;
  }
  const sanitizedId = userIdentifier.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `${BASE_KEY}${sanitizedId}`;
}

/**
 * Format a Date object or ISO string to readable string e.g. "Sep 5, 2026, 02:25 PM"
 */
export function formatSavedDate(dateInput) {
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return new Date().toLocaleString();
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    return new Date().toLocaleString();
  }
}

/**
 * Retrieve saved records for the authenticated user
 * @param {string} userIdentifier Email or mobile of authenticated user
 * @returns {Array} List of saved patient records belonging to this user
 */
export function getSavedRecords(userIdentifier) {
  try {
    const key = getStorageKey(userIdentifier);
    const data = localStorage.getItem(key);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to parse saved records from localStorage:', err);
    return [];
  }
}

/**
 * Save or update a patient record for the authenticated user
 * @param {Object} recordData Data to save
 * @param {string|null} existingId Existing record ID to update if available
 * @param {string} userIdentifier Email or mobile of authenticated user
 * @returns {Object} Saved record object
 */
export function saveRecord(recordData, existingId = null, userIdentifier = '') {
  const records = getSavedRecords(userIdentifier);
  const now = new Date();
  const isoDate = now.toISOString();
  const formattedDate = formatSavedDate(now);

  const targetId = existingId || recordData.id || `rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

  const newRecord = {
    id: targetId,
    ownerIdentifier: userIdentifier || 'guest',
    patientInfo: recordData.patientInfo ? { ...recordData.patientInfo } : {},
    uploadedFileName: recordData.uploadedFileName || '',
    documentType: recordData.documentType || 'Laboratory Report',
    reportText: recordData.reportText || '',
    records: Array.isArray(recordData.records) ? [...recordData.records] : [],
    consistentItems: Array.isArray(recordData.consistentItems) ? [...recordData.consistentItems] : [],
    warnings: Array.isArray(recordData.warnings) ? [...recordData.warnings] : [],
    aiSummaryText: recordData.aiSummaryText || '',
    savedAt: isoDate,
    formattedDate: formattedDate,
  };

  const existingIndex = records.findIndex((r) => r.id === targetId);

  if (existingIndex >= 0) {
    records[existingIndex] = newRecord;
  } else {
    records.unshift(newRecord);
  }

  try {
    const key = getStorageKey(userIdentifier);
    localStorage.setItem(key, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save record to localStorage:', err);
  }

  return newRecord;
}

/**
 * Delete a record by ID for the authenticated user
 * @param {string} id Record ID to delete
 * @param {string} userIdentifier Email or mobile of authenticated user
 * @returns {Array} Updated list of saved records
 */
export function deleteRecord(id, userIdentifier = '') {
  const records = getSavedRecords(userIdentifier);
  const updated = records.filter((r) => r.id !== id);
  try {
    const key = getStorageKey(userIdentifier);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update localStorage after deletion:', err);
  }
  return updated;
}
