const STORAGE_KEY = 'medlens_saved_records';

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
 * Retrieve saved records from localStorage
 * @returns {Array} List of saved patient records
 */
export function getSavedRecords() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to parse saved records from localStorage:', err);
    return [];
  }
}

/**
 * Save or update a patient record in localStorage
 * @param {Object} recordData Data to save
 * @param {string|null} existingId Existing record ID to update if available
 * @returns {Object} Saved record object
 */
export function saveRecord(recordData, existingId = null) {
  const records = getSavedRecords();
  const now = new Date();
  const isoDate = now.toISOString();
  const formattedDate = formatSavedDate(now);

  const targetId = existingId || recordData.id || `rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

  const newRecord = {
    id: targetId,
    patientInfo: recordData.patientInfo || {},
    uploadedFileName: recordData.uploadedFileName || '',
    documentType: recordData.documentType || 'Laboratory Report',
    reportText: recordData.reportText || '',
    records: recordData.records || [],
    consistentItems: recordData.consistentItems || [],
    warnings: recordData.warnings || [],
    aiSummaryText: recordData.aiSummaryText || '',
    savedAt: isoDate,
    formattedDate: formattedDate,
  };

  const existingIndex = records.findIndex((r) => r.id === targetId);

  if (existingIndex >= 0) {
    // Update existing record
    records[existingIndex] = newRecord;
  } else {
    // Add new record to top of list
    records.unshift(newRecord);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save record to localStorage:', err);
  }

  return newRecord;
}

/**
 * Delete a record by ID
 * @param {string} id Record ID to delete
 * @returns {Array} Updated list of saved records
 */
export function deleteRecord(id) {
  const records = getSavedRecords();
  const updated = records.filter((r) => r.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update localStorage after deletion:', err);
  }
  return updated;
}

