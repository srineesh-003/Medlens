import React, { useState, useRef } from 'react';
import { FileText, Upload, Sparkles, CheckCircle2, FileUp, AlertTriangle, Image as ImageIcon, X, RefreshCw, Crop } from 'lucide-react';
import ProvenanceTag from './ProvenanceTag';
import ImageCropper from './ImageCropper';
import { scanMedicalImage } from '../services/ocrService';
import { initialReportText } from '../data/sampleData';

export default function ReportInput({
  reportText,
  setReportText,
  onProcessReport,
  isProcessing,
  errorMessage,
  uploadedFileName = '',
  setUploadedFileName = () => {},
  onOcrComplete = () => {},
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [lastProcessed, setLastProcessed] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [fileError, setFileError] = useState('');
  const [ocrProgress, setOcrProgress] = useState('');
  const [isScanningOcr, setIsScanningOcr] = useState(false);
  const [ocrWarning, setOcrWarning] = useState('');
  
  // Image Cropper States
  const [showCropper, setShowCropper] = useState(false);
  const [cropperSourceUrl, setCropperSourceUrl] = useState('');
  const [rawUploadedFile, setRawUploadedFile] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = async (file) => {
    setFileError('');
    setOcrWarning('');
    setLastProcessed(false);

    // 1. File Security Validation: Max Size 10MB
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      setFileError('File size exceeds the 10MB maximum limit. Please select a smaller medical document.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // 2. Extension & MIME Validation
    const ext = file.name.split('.').pop().toLowerCase();
    const textExtensions = ['txt', 'md', 'csv'];
    const imageExtensions = ['jpg', 'jpeg', 'png'];

    const validMimes = [
      'text/plain', 'text/markdown', 'text/csv', 'application/csv',
      'image/jpeg', 'image/png', 'image/jpg'
    ];

    if (!textExtensions.includes(ext) && !imageExtensions.includes(ext)) {
      setFileError('Unsupported file format. Please upload a valid .txt, .md, .csv, .jpg, or .png file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploadedFileName(file.name);
    setRawUploadedFile(file);

    // 3. Handle Image Files (.jpg, .jpeg, .png) with Interactive Cropper Flow
    if (imageExtensions.includes(ext)) {
      const objUrl = URL.createObjectURL(file);
      setCropperSourceUrl(objUrl);
      setShowCropper(true); // Launch Cropper modal so user can focus on prescription text
      return;
    }

    // 4. Handle Text Files (.txt, .md, .csv)
    setImagePreviewUrl('');
    setIsScanningOcr(false);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setReportText(event.target.result);
        setFileError('');
      }
    };

    reader.onerror = () => {
      setFileError('Unable to read this text file. Please try another report.');
    };

    reader.readAsText(file, 'UTF-8');
  };

  const handleCropConfirm = async (croppedBlob, croppedDataUrl) => {
    setShowCropper(false);
    setImagePreviewUrl(croppedDataUrl);
    setIsScanningOcr(true);
    setFileError('');
    setOcrWarning('');

    try {
      const ocrResult = await scanMedicalImage(croppedBlob, ({ status, progress }) => {
        setOcrProgress(`${status} (${Math.round(progress * 100)}%)`);
      });

      setIsScanningOcr(false);

      if (ocrResult.requiresHumanVerification) {
        setOcrWarning('Low OCR confidence detected. Please verify extracted text for accuracy.');
      }

      if (ocrResult.rawText && ocrResult.rawText.length > 0) {
        setReportText(ocrResult.rawText);
        onOcrComplete(ocrResult);
      } else {
        setFileError('No readable text could be recognized in the cropped image scan. Try selecting a larger area or improving image resolution.');
      }
    } catch (err) {
      setIsScanningOcr(false);
      setFileError(`OCR Extraction Error: ${err.message}`);
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    // If no preview URL exists yet, perform full-image scan as fallback
    if (!imagePreviewUrl && rawUploadedFile) {
      runDirectImageScan(rawUploadedFile);
    }
  };

  const runDirectImageScan = async (file) => {
    setImagePreviewUrl(cropperSourceUrl || URL.createObjectURL(file));
    setIsScanningOcr(true);
    setFileError('');

    try {
      const ocrResult = await scanMedicalImage(file, ({ status, progress }) => {
        setOcrProgress(`${status} (${Math.round(progress * 100)}%)`);
      });

      setIsScanningOcr(false);

      if (ocrResult.requiresHumanVerification) {
        setOcrWarning('Low OCR confidence detected. Please verify extracted text for accuracy.');
      }

      if (ocrResult.rawText && ocrResult.rawText.length > 0) {
        setReportText(ocrResult.rawText);
        onOcrComplete(ocrResult);
      } else {
        setFileError('No readable text recognized in image scan.');
      }
    } catch (err) {
      setIsScanningOcr(false);
      setFileError(`OCR Error: ${err.message}`);
    }
  };

  const openRecropModal = () => {
    if (cropperSourceUrl) {
      setShowCropper(true);
    } else if (imagePreviewUrl) {
      setCropperSourceUrl(imagePreviewUrl);
      setShowCropper(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleProcess = () => {
    setLastProcessed(false);
    setFileError('');
    onProcessReport();
    setLastProcessed(true);
  };

  const clearImagePreview = () => {
    setImagePreviewUrl('');
    setCropperSourceUrl('');
    setRawUploadedFile(null);
  };

  return (
    <section className="dashboard-card report-input-card" id="medical-report">
      {/* Interactive Image Cropper Modal */}
      {showCropper && cropperSourceUrl && (
        <ImageCropper
          imageSrc={cropperSourceUrl}
          onCropConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}

      <div className="card-header">
        <div className="card-title-group">
          <div className="section-icon-badge">
            <FileText size={18} />
          </div>
          <div>
            <h2 className="card-title">Medical Report Input</h2>
            <p className="card-description">Paste unstructured clinical narrative, upload text reports, or crop & scan document photos (.jpg, .png)</p>
          </div>
        </div>
        <div className="header-actions-group">
          <ProvenanceTag category="Extracted from report" showLabelPrefix={true} />
        </div>
      </div>

      <div className="report-input-grid">
        <div className="text-editor-container">
          <div className="editor-meta-bar">
            <span className="editor-label">
              <FileText size={14} /> Report Text Content
              {uploadedFileName && (
                <span className="uploaded-file-pill">
                  {imagePreviewUrl ? <ImageIcon size={12} /> : <FileText size={12} />}
                  {uploadedFileName}
                </span>
              )}
            </span>
            <span className="char-count">{reportText.length} characters</span>
          </div>

          {isScanningOcr && (
            <div className="ocr-scanning-banner">
              <RefreshCw size={14} className="spin-icon text-primary" />
              <span className="ocr-progress-text">{ocrProgress || 'Scanning document image text via OCR...'}</span>
            </div>
          )}

          {imagePreviewUrl && !isScanningOcr && (
            <div className="image-preview-banner">
              <div className="image-thumbnail-box">
                <img src={imagePreviewUrl} alt="Medical Document Scan" className="image-thumbnail" />
              </div>
              <div className="image-preview-info">
                <span className="image-preview-title">
                  <ImageIcon size={14} /> Authentic OCR Scan Loaded ({uploadedFileName})
                </span>
                <span className="image-preview-desc">
                  Text extracted directly from cropped pixels. Crop noise was excluded from OCR scan.
                </span>
              </div>
              <div className="preview-banner-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-xs"
                  onClick={openRecropModal}
                  title="Re-crop image area"
                >
                  <Crop size={13} /> Re-crop
                </button>
                <button
                  type="button"
                  className="btn-icon-danger"
                  title="Remove image preview"
                  onClick={clearImagePreview}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          <textarea
            className="report-textarea"
            value={reportText}
            onChange={(e) => {
              setReportText(e.target.value);
              setLastProcessed(false);
              setFileError('');
            }}
            placeholder="Paste medical report or prescription text here..."
            rows={8}
            aria-label="Medical report text input"
          />
        </div>

        <div className="actions-upload-column">
          <div
            className={`upload-dropzone ${isDragging ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".txt,.md,.csv,.jpg,.jpeg,.png"
              className="hidden-file-input"
            />
            <div className="upload-icon-circle">
              <FileUp size={20} />
            </div>
            <div className="upload-text-group">
              <span className="upload-primary-text">Drop medical document here</span>
              <span className="upload-secondary-text">Supported: .txt, .md, .csv, .jpg, .png (Max 10MB)</span>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              disabled={isScanningOcr}
            >
              <Upload size={14} /> Upload File
            </button>
          </div>

          <div className="process-action-area">
            <button
              type="button"
              className={`btn btn-primary btn-process ${isProcessing ? 'processing' : ''}`}
              onClick={handleProcess}
              disabled={isProcessing || isScanningOcr}
            >
              <Sparkles size={16} className={isProcessing ? 'spin-icon' : ''} />
              {isProcessing ? 'Processing Clinical Data...' : 'Process Report'}
            </button>

            {ocrWarning && (
              <div className="process-error-banner warning-theme">
                <AlertTriangle size={16} className="warning-icon" />
                <span>{ocrWarning}</span>
              </div>
            )}

            {fileError && (
              <div className="process-error-banner">
                <AlertTriangle size={16} className="error-icon" />
                <span>{fileError}</span>
              </div>
            )}

            {errorMessage && !fileError && (
              <div className="process-error-banner">
                <AlertTriangle size={16} className="error-icon" />
                <span>{errorMessage}</span>
              </div>
            )}

            {lastProcessed && !isProcessing && !errorMessage && !fileError && (
              <div className="process-success-banner">
                <CheckCircle2 size={16} className="success-icon" />
                <span>Document processed successfully! Structured observations and AI summary updated below.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
