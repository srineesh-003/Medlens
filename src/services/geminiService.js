/**
 * MedLens Google Gemini AI Integration Service
 * 
 * Leverages Google Gemini 1.5/2.5 Flash models for clinical report reasoning,
 * structured observation extraction, and clinical summary generation.
 */

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Analyzes medical document text using Google Gemini API.
 * @param {string} reportText Raw medical report content
 * @param {Object} patientInfo Patient context object
 * @param {string} apiKey Optional Google Gemini API key
 * @returns {Promise<Object>} Structured AI summary and extracted observations
 */
export async function analyzeWithGemini(reportText, patientInfo = {}, apiKey = '') {
  const activeKey = apiKey || (typeof process !== 'undefined' ? process.env?.VITE_GEMINI_API_KEY || '' : '');

  if (!activeKey) {
    return {
      source: 'Local Rule Engine (Provide Gemini API Key for Live Google AI)',
      isLiveGemini: false,
    };
  }

  try {
    const prompt = `You are a clinical documentation assistant for MedLens. Analyze the following medical report for patient "${patientInfo?.patientIdName || 'Patient'}".
Document Text:
"""
${reportText}
"""

Provide a concise, 3-bullet clinical summary of the findings. Maintain strict source fidelity and do NOT invent dosages or reference ranges.`;

    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${activeKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API HTTP Error ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return {
      summary: generatedText,
      source: 'Google Gemini 1.5 Flash (Live API)',
      isLiveGemini: true,
    };
  } catch (err) {
    console.warn('Gemini API request fallback to local engine:', err.message);
    return {
      source: 'Local Rule Engine (Gemini API Offline Fallback)',
      isLiveGemini: false,
    };
  }
}
