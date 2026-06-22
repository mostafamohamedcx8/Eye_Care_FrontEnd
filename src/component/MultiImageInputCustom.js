import { useState, useRef, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";

/**
 * Custom multi-image uploader.
 * - Adding images takes the FULL image, no forced crop.
 * - A pencil icon appears on hover over each image.
 * - Clicking the pencil opens a modal with a draggable/resizable crop box (canvas-based).
 * - Confirming the crop replaces that image with the cropped version.
 *
 * Props:
 *  images:    array of base64 data URL strings (e.g. "data:image/jpeg;base64,...")
 *             -> SAME shape as the old react-multi-image-input component.
 *  setImages: setter function, same shape (array of base64 strings)
 *  max:       max number of images (default 8)
 */
const MultiImageInputCustom = ({ images = [], setImages, max = 8 }) => {
  const fileInputRef = useRef(null);
  const [cropTarget, setCropTarget] = useState(null); // index of image being cropped
  const [cropBox, setCropBox] = useState({ x: 20, y: 20, w: 200, h: 200 });
  const [dragState, setDragState] = useState(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  // ---- Helper: read a File as a base64 data URL ----
  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // ---- Add images (full, untouched) ----
  const handleFilesSelected = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = max - images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const newDataUrls = await Promise.all(filesToAdd.map(fileToDataUrl));

    setImages([...images, ...newDataUrls]);
    e.target.value = ""; // allow re-selecting same file again
  };

  const handleRemove = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // ---- Crop modal logic ----
  const openCrop = (index) => {
    setCropTarget(index);
    // reset crop box to a sane default once the image is shown
    setCropBox({ x: 20, y: 20, w: 200, h: 200 });
  };

  const closeCrop = () => {
    setCropTarget(null);
    setDragState(null);
  };

  const onImgLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    const w = Math.min(200, img.clientWidth - 20);
    const h = Math.min(200, img.clientHeight - 20);
    setCropBox({ x: 10, y: 10, w, h });
  };

  // Dragging / resizing the crop box
  const startDrag = (mode) => (e) => {
    e.preventDefault();
    setDragState({
      mode, // "move" | "resize"
      startX: e.clientX,
      startY: e.clientY,
      origBox: { ...cropBox },
    });
  };

  const onMouseMove = useCallback(
    (e) => {
      if (!dragState || !imgRef.current) return;
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      const imgRect = imgRef.current.getBoundingClientRect();

      setCropBox((prev) => {
        let { x, y, w, h } = dragState.origBox;

        if (dragState.mode === "move") {
          x = Math.min(Math.max(0, x + dx), imgRect.width - w);
          y = Math.min(Math.max(0, y + dy), imgRect.height - h);
        } else if (dragState.mode === "resize") {
          w = Math.min(Math.max(40, w + dx), imgRect.width - x);
          h = Math.min(Math.max(40, h + dy), imgRect.height - y);
        }
        return { x, y, w, h };
      });
    },
    [dragState],
  );

  const onMouseUp = useCallback(() => setDragState(null), []);

  // Attach/detach global listeners while dragging
  const containerProps = {
    onMouseMove: dragState ? onMouseMove : undefined,
    onMouseUp: dragState ? onMouseUp : undefined,
    onMouseLeave: dragState ? onMouseUp : undefined,
  };

  const applyCrop = () => {
    const img = imgRef.current;
    if (!img || cropTarget === null) return;

    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;

    const canvas = document.createElement("canvas");
    canvas.width = cropBox.w * scaleX;
    canvas.height = cropBox.h * scaleY;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      img,
      cropBox.x * scaleX,
      cropBox.y * scaleY,
      cropBox.w * scaleX,
      cropBox.h * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    // Output as base64 data URL, same shape as the rest of the array
    const newDataUrl = canvas.toDataURL("image/jpeg", 0.92);

    const updated = [...images];
    updated[cropTarget] = newDataUrl;
    setImages(updated);
    closeCrop();
  };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {images.map((imgSrc, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              width: 120,
              height: 120,
              border: "1px solid #ddd",
              borderRadius: 6,
              overflow: "hidden",
            }}
            className="multi-image-input__thumb"
          >
            <img
              src={imgSrc}
              alt={`upload-${index}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            {/* Pencil icon - opens crop modal */}
            <button
              type="button"
              onClick={() => openCrop(index)}
              title="Crop image"
              style={{
                position: "absolute",
                top: 4,
                right: 28,
                background: "rgba(0,0,0,0.6)",
                border: "none",
                borderRadius: "50%",
                width: 24,
                height: 24,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <i className="bi bi-pencil" style={{ fontSize: 12 }}></i>
            </button>

            {/* Remove icon */}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              title="Remove image"
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                background: "rgba(220,53,69,0.85)",
                border: "none",
                borderRadius: "50%",
                width: 24,
                height: 24,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <i className="bi bi-x" style={{ fontSize: 14 }}></i>
            </button>
          </div>
        ))}

        {images.length < max && (
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: 120,
              height: 120,
              border: "2px dashed #ccc",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#888",
            }}
          >
            <i className="bi bi-plus-lg" style={{ fontSize: 24 }}></i>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={handleFilesSelected}
      />

      {/* Crop Modal */}
      <Modal show={cropTarget !== null} onHide={closeCrop} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Crop image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cropTarget !== null && (
            <div
              ref={containerRef}
              {...containerProps}
              style={{
                position: "relative",
                display: "inline-block",
                userSelect: "none",
                maxWidth: "100%",
              }}
            >
              <img
                ref={imgRef}
                src={images[cropTarget]}
                alt="crop-target"
                onLoad={onImgLoad}
                style={{
                  maxWidth: "100%",
                  maxHeight: "60vh",
                  display: "block",
                }}
                draggable={false}
              />

              {/* Dim overlay outside crop box using box-shadow trick */}
              <div
                onMouseDown={startDrag("move")}
                style={{
                  position: "absolute",
                  left: cropBox.x,
                  top: cropBox.y,
                  width: cropBox.w,
                  height: cropBox.h,
                  border: "2px solid #0d6efd",
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)",
                  cursor: "move",
                }}
              >
                {/* Resize handle */}
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    startDrag("resize")(e);
                  }}
                  style={{
                    position: "absolute",
                    right: -6,
                    bottom: -6,
                    width: 14,
                    height: 14,
                    background: "#0d6efd",
                    borderRadius: 3,
                    cursor: "nwse-resize",
                  }}
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCrop}>
            Cancel
          </Button>
          <Button variant="primary" onClick={applyCrop}>
            Apply crop
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MultiImageInputCustom;
