import React, { useState, useRef, useEffect } from 'react';
import { Crop, Check, X, RotateCcw, ZoomIn, ZoomOut, Layers } from 'lucide-react';

export default function ImageCropper({ imageSrc, onCropConfirm, onCancel }) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [crop, setCrop] = useState({ x: 10, y: 25, width: 80, height: 50 }); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialCrop, setInitialCrop] = useState({ x: 10, y: 25, width: 80, height: 50 });
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (imageLoaded && imageRef.current) {
      updateCroppedPreview();
    }
  }, [crop, imageLoaded]);

  const updateCroppedPreview = () => {
    if (!imageRef.current) return;
    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const realX = (crop.x / 100) * img.naturalWidth;
    const realY = (crop.y / 100) * img.naturalHeight;
    const realW = (crop.width / 100) * img.naturalWidth;
    const realH = (crop.height / 100) * img.naturalHeight;

    canvas.width = Math.max(1, realW);
    canvas.height = Math.max(1, realH);

    ctx.drawImage(
      img,
      realX,
      realY,
      realW,
      realH,
      0,
      0,
      canvas.width,
      canvas.height
    );

    setPreviewUrl(canvas.toDataURL('image/png'));
  };

  const handleMouseDown = (e, handle = null) => {
    e.preventDefault();
    e.stopPropagation();
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialCrop({ ...crop });

    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle);
    } else {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging && !isResizing) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

    if (isDragging) {
      let newX = Math.max(0, Math.min(100 - crop.width, initialCrop.x + deltaX));
      let newY = Math.max(0, Math.min(100 - crop.height, initialCrop.y + deltaY));
      setCrop((prev) => ({ ...prev, x: newX, y: newY }));
    } else if (isResizing) {
      let { x, y, width, height } = initialCrop;

      if (resizeHandle.includes('e')) {
        width = Math.max(10, Math.min(100 - x, initialCrop.width + deltaX));
      }
      if (resizeHandle.includes('s')) {
        height = Math.max(10, Math.min(100 - y, initialCrop.height + deltaY));
      }
      if (resizeHandle.includes('w')) {
        const possibleWidth = Math.max(10, initialCrop.width - deltaX);
        const possibleX = initialCrop.x + (initialCrop.width - possibleWidth);
        if (possibleX >= 0) {
          x = possibleX;
          width = possibleWidth;
        }
      }
      if (resizeHandle.includes('n')) {
        const possibleHeight = Math.max(10, initialCrop.height - deltaY);
        const possibleY = initialCrop.y + (initialCrop.height - possibleHeight);
        if (possibleY >= 0) {
          y = possibleY;
          height = possibleHeight;
        }
      }

      setCrop({ x, y, width, height });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  const handleConfirmCrop = () => {
    if (!imageRef.current) return;
    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const realX = (crop.x / 100) * img.naturalWidth;
    const realY = (crop.y / 100) * img.naturalHeight;
    const realW = (crop.width / 100) * img.naturalWidth;
    const realH = (crop.height / 100) * img.naturalHeight;

    canvas.width = Math.max(1, realW);
    canvas.height = Math.max(1, realH);

    ctx.drawImage(
      img,
      realX,
      realY,
      realW,
      realH,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      const croppedDataUrl = canvas.toDataURL('image/png');
      onCropConfirm(blob, croppedDataUrl);
    }, 'image/png');
  };

  const setPreset = (presetType) => {
    if (presetType === 'medication') {
      setCrop({ x: 5, y: 20, width: 90, height: 60 });
    } else if (presetType === 'full') {
      setCrop({ x: 0, y: 0, width: 100, height: 100 });
    } else if (presetType === 'top') {
      setCrop({ x: 5, y: 5, width: 90, height: 40 });
    }
  };

  return (
    <div
      className="crop-modal-overlay"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="crop-modal-card">
        <div className="crop-modal-header">
          <div className="crop-header-title">
            <Crop size={20} className="text-primary" />
            <div>
              <h3>Crop Medical Prescription Image</h3>
              <p>Focus OCR on relevant medication section to ignore headers, addresses, & signatures.</p>
            </div>
          </div>
          <button type="button" className="btn-icon-close" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>

        <div className="crop-presets-bar">
          <span className="presets-label">Quick Presets:</span>
          <button
            type="button"
            className="btn btn-tertiary btn-xs"
            onClick={() => setPreset('medication')}
          >
            <Layers size={13} /> Medication Section
          </button>
          <button
            type="button"
            className="btn btn-tertiary btn-xs"
            onClick={() => setPreset('full')}
          >
            Full Document
          </button>
          <button
            type="button"
            className="btn btn-tertiary btn-xs"
            onClick={() => setPreset('top')}
          >
            Top Half
          </button>
        </div>

        <div className="crop-workspace-grid">
          {/* Main Interactive Canvas Container */}
          <div className="crop-canvas-container" ref={containerRef}>
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Source Prescription"
              className="crop-source-image"
              onLoad={() => setImageLoaded(true)}
            />

            {/* Dark Mask Overlay */}
            <div
              className="crop-selection-box"
              style={{
                left: `${crop.x}%`,
                top: `${crop.y}%`,
                width: `${crop.width}%`,
                height: `${crop.height}%`,
              }}
              onMouseDown={(e) => handleMouseDown(e, null)}
            >
              <div className="crop-box-grid-lines"></div>

              {/* Corner Handles */}
              <div
                className="crop-handle handle-nw"
                onMouseDown={(e) => handleMouseDown(e, 'nw')}
              ></div>
              <div
                className="crop-handle handle-ne"
                onMouseDown={(e) => handleMouseDown(e, 'ne')}
              ></div>
              <div
                className="crop-handle handle-sw"
                onMouseDown={(e) => handleMouseDown(e, 'sw')}
              ></div>
              <div
                className="crop-handle handle-se"
                onMouseDown={(e) => handleMouseDown(e, 'se')}
              ></div>

              {/* Edge Handles */}
              <div
                className="crop-handle handle-n"
                onMouseDown={(e) => handleMouseDown(e, 'n')}
              ></div>
              <div
                className="crop-handle handle-s"
                onMouseDown={(e) => handleMouseDown(e, 's')}
              ></div>
              <div
                className="crop-handle handle-w"
                onMouseDown={(e) => handleMouseDown(e, 'w')}
              ></div>
              <div
                className="crop-handle handle-e"
                onMouseDown={(e) => handleMouseDown(e, 'e')}
              ></div>
            </div>
          </div>

          {/* Live Cropped Section Preview Sidebar */}
          <div className="crop-preview-sidebar">
            <h4 className="preview-heading">Cropped Section Preview</h4>
            <div className="preview-box">
              {previewUrl ? (
                <img src={previewUrl} alt="Cropped Preview" className="preview-image" />
              ) : (
                <span className="preview-placeholder">Adjust crop area to see preview</span>
              )}
            </div>
            <p className="preview-tip">
              💡 Only text inside the bright crop box will be scanned by OCR engine.
            </p>
          </div>
        </div>

        <div className="crop-modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            <X size={15} /> Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleConfirmCrop}>
            <Check size={15} /> Confirm Crop & Run OCR
          </button>
        </div>
      </div>
    </div>
  );
}

