import { createWorker } from 'tesseract.js';

/**
 * MedLens OCR Service
 * Performs authentic optical character recognition on uploaded medical report images
 * using tesseract.js.
 */
export async function scanMedicalImage(imageFile, onProgress = () => {}) {
  let worker = null;
  try {
    onProgress({ status: 'Initializing OCR engine...', progress: 0.1 });
    worker = await createWorker('eng');

    onProgress({ status: 'Scanning medical document text...', progress: 0.4 });
    const ret = await worker.recognize(imageFile);

    onProgress({ status: 'Finalizing text extraction...', progress: 0.9 });
    const rawText = ret.data.text ? ret.data.text.trim() : '';
    const confidence = ret.data.confidence || 0;

    await worker.terminate();
    onProgress({ status: 'OCR Complete', progress: 1.0 });

    return {
      rawText,
      confidence,
      requiresHumanVerification: confidence < 60 || rawText.length === 0,
    };
  } catch (error) {
    if (worker) {
      try {
        await worker.terminate();
      } catch (e) {
        // ignore cleanup error
      }
    }
    throw new Error(`Failed to extract text from medical image: ${error.message}`);
  }
}

