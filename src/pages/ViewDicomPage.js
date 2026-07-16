import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useSearchParams } from "react-router-dom";
import { Button, ButtonGroup, Form, Badge } from "react-bootstrap";

import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import cornerstoneTools from "cornerstone-tools";
import dicomParser from "dicom-parser";
import Hammer from "hammerjs";
import cornerstoneMath from "cornerstone-math";
import cornerstoneWebImageLoader from "cornerstone-web-image-loader";

import LayerViewer from "../component/FundusLayerViewer";

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.init();
cornerstoneTools.toolStyle.setToolWidth(3); // سُمك الخط (كان افتراضيًا 1)
cornerstoneTools.textStyle.setFont("18px Arial"); // حجم الخط (كان صغير جدًا افتراضيًا)
cornerstoneTools.toolColors.setToolColor("rgb(79, 209, 255)"); // اللون الافتراضي (غير محدد)
cornerstoneTools.toolColors.setActiveColor("rgb(255, 210, 63)");

cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstone.registerImageLoader("http", cornerstoneWebImageLoader.loadImage);
cornerstone.registerImageLoader("https", cornerstoneWebImageLoader.loadImage);

/* ── أدوات القياس/الـ annotations اللي عايزين نقدر نمسحها ── */
const MEASURE_TOOLS = ["Length", "Angle", "EllipticalRoi", "ArrowAnnotate"];

/* ── Gamma applied via pixel-level canvas manipulation ── */
const applyGammaToCanvas = (element, gamma) => {
  const canvas = element.querySelector("canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Build LUT once per gamma value
  const lut = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    lut[i] = Math.round(Math.pow(i / 255, 1 / gamma) * 255);
  }

  for (let i = 0; i < data.length; i += 4) {
    data[i] = lut[data[i]]; // R
    data[i + 1] = lut[data[i + 1]]; // G
    data[i + 2] = lut[data[i + 2]]; // B
    // Alpha unchanged
  }

  ctx.putImageData(imageData, 0, 0);
};

/* ── CLAHE-lite: histogram equalization per tile for fundus ── */
const applyCLAHE = (element, strength) => {
  if (strength === 0) return;
  const canvas = element.querySelector("canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Global histogram equalization blended with original by strength
  const hist = new Float32Array(256);
  for (let i = 0; i < data.length; i += 4) {
    const lum = Math.round(
      0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2],
    );
    hist[lum]++;
  }
  const total = width * height;
  let cum = 0;
  const lut = new Uint8Array(256);
  for (let v = 0; v < 256; v++) {
    cum += hist[v];
    lut[v] = Math.round((cum / total) * 255);
  }

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(data[i] * (1 - strength) + lut[data[i]] * strength);
    data[i + 1] = Math.round(
      data[i + 1] * (1 - strength) + lut[data[i + 1]] * strength,
    );
    data[i + 2] = Math.round(
      data[i + 2] * (1 - strength) + lut[data[i + 2]] * strength,
    );
  }
  ctx.putImageData(imageData, 0, 0);
};

/* ── Unsharp mask for vessel sharpening ── */
const applySharpness = (element, amount) => {
  if (amount === 0) return;
  const canvas = element.querySelector("canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const copy = new Uint8ClampedArray(data);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = (y * width + x) * 4;
      for (let c = 0; c < 3; c++) {
        const lap =
          -copy[(y * width + (x - 1)) * 4 + c] -
          copy[(y * width + (x + 1)) * 4 + c] -
          copy[((y - 1) * width + x) * 4 + c] -
          copy[((y + 1) * width + x) * 4 + c] +
          4 * copy[i + c];
        data[i + c] = Math.min(
          255,
          Math.max(0, copy[i + c] + amount * lap * 0.08),
        );
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
};

/* ── Channel isolation (R / G / B / All) ── */
const applyChannel = (element, channel) => {
  if (channel === "all") return;
  const canvas = element.querySelector("canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    if (channel === "r") {
      data[i + 1] = 0;
      data[i + 2] = 0;
    } else if (channel === "g") {
      data[i] = 0;
      data[i + 2] = 0;
    } else if (channel === "b") {
      data[i] = 0;
      data[i + 1] = 0;
    }
  }
  ctx.putImageData(imageData, 0, 0);
};

// ─── Fundus presets ───────────────────────────────────────────────
const PRESETS = {
  normal: {
    gamma: 1.0,
    clahe: 0,
    sharp: 0,
    channel: "all",
    ww: null,
    wc: null,
  },
  vessel: { gamma: 1.3, clahe: 0.55, sharp: 4, channel: "g", ww: 300, wc: 150 },
  disc: { gamma: 0.85, clahe: 0.2, sharp: 3, channel: "all", ww: 400, wc: 200 },
  macula: {
    gamma: 1.1,
    clahe: 0.4,
    sharp: 2,
    channel: "all",
    ww: 350,
    wc: 180,
  },
};

/**
 * Safely parses the "images" query param, which is expected to be a
 * JSON-encoded array of { url, modality, aligned, _id } objects
 * (as returned by the backend for eyeExamination.<eye>.images /
 * eyeExamination.<eye>.alignedImages).
 * Returns null if missing or invalid, so callers can fall back to the
 * legacy single dicomUrl behavior.
 */
const parseImagesParam = (raw) => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    // Normalize: support both string URLs (legacy) and {url, modality} objects
    return parsed.map((item, index) =>
      typeof item === "string"
        ? { url: item, modality: "UNKNOWN", _id: `legacy-${index}` }
        : item,
    );
  } catch (err) {
    console.error("Failed to parse 'images' query param:", err);
    return null;
  }
};

const DicomViewerPage = () => {
  const [searchParams] = useSearchParams();
  const dicomUrlParam = searchParams.get("dicomUrl");
  // "image" يعني صورة fundus عادية (jpeg/png) — أي قيمة تانية أو مفيش param يبقى ملف DICOM حقيقي
  const fileType = searchParams.get("type");

  // NEW: optional multi-image payload for the Layer View
  const imagesParam = searchParams.get("images");
  const parsedImages = useMemo(
    () => parseImagesParam(imagesParam),
    [imagesParam],
  );
  const hasLayers = Array.isArray(parsedImages) && parsedImages.length > 1;

  // View mode: "layers" (new Photoshop-style stack) or "single" (existing cornerstone viewer)
  const [viewMode, setViewMode] = useState(hasLayers ? "layers" : "single");

  // The URL currently shown in the single-image cornerstone viewer.
  // Falls back to the legacy dicomUrl param, or the first image of the
  // "images" payload if that's all we got.
  const [singleImageUrl, setSingleImageUrl] = useState(
    dicomUrlParam || parsedImages?.[0]?.url || null,
  );

  // A single image opened from the "images"/Layer payload is always a
  // plain fundus photo (jpeg/png), never a raw .dcm file.
  const isPlainImage = fileType === "image" || Boolean(parsedImages);

  const elementRef = useRef(null);
  const imageLoadedRef = useRef(null);

  const [activeTool, setActiveTool] = useState("Wwwc");
  const [activePreset, setActivePreset] = useState("normal");
  const [gamma, setGamma] = useState(1.0);
  const [clahe, setClahe] = useState(0);
  const [sharp, setSharp] = useState(0);
  const [channel, setChannel] = useState("all");
  const [imageInfo, setImageInfo] = useState(null); // metadata display
  const [isInverted, setIsInverted] = useState(false);
  const [zoom, setZoom] = useState(1.0);
  const [loadError, setLoadError] = useState(null);

  // ── كل ما تتغير أي filter نعيد render cornerstone ثم نطبق الـ post-processing
  const rerender = useCallback(
    (overrides = {}) => {
      const el = elementRef.current;
      if (!el || !imageLoadedRef.current) return;

      const g = overrides.gamma ?? gamma;
      const cl = overrides.clahe ?? clahe;
      const sh = overrides.sharp ?? sharp;
      const ch = overrides.channel ?? channel;
      const inv = overrides.isInverted ?? isInverted;

      // Invert via cornerstone viewport
      const vp = cornerstone.getViewport(el);
      vp.invert = inv;
      cornerstone.setViewport(el, vp);

      // cornerstone re-renders the canvas; نطبق post-processing بعدها مباشرةً
      cornerstone.updateImage(el);

      // requestAnimationFrame عشان نضمن إن الـ canvas اتحدث
      requestAnimationFrame(() => {
        if (g !== 1.0) applyGammaToCanvas(el, g);
        if (cl > 0) applyCLAHE(el, cl);
        if (sh > 0) applySharpness(el, sh);
        if (ch !== "all") applyChannel(el, ch);
      });
    },
    [gamma, clahe, sharp, channel, isInverted],
  );

  // ── مسح القياسة المحددة فقط (اللي ضاغط/واقف عليها) ──────────────
  const removeSelectedAnnotations = useCallback(() => {
    const el = elementRef.current;
    if (!el) return;
    let removedAny = false;

    MEASURE_TOOLS.forEach((toolName) => {
      const toolState = cornerstoneTools.getToolState(el, toolName);
      if (!toolState || !toolState.data) return;

      // ناخد نسخة من الـ array عشان منعدلش عليه وإحنا بنلف
      [...toolState.data].forEach((data) => {
        if (data.active || data.selected) {
          cornerstoneTools.removeToolState(el, toolName, data);
          removedAny = true;
        }
      });
    });

    if (removedAny) cornerstone.updateImage(el);
  }, []);

  // ── مسح كل القياسات مرة واحدة ────────────────────────────────────
  const clearAllAnnotations = useCallback(() => {
    const el = elementRef.current;
    if (!el) return;
    MEASURE_TOOLS.forEach((toolName) => {
      cornerstoneTools.clearToolState(el, toolName);
    });
    cornerstone.updateImage(el);
  }, []);

  // ── Setup cornerstone whenever we're in "single" mode with a valid URL ──
  useEffect(() => {
    if (viewMode !== "single") return;
    if (!singleImageUrl || !elementRef.current) return;
    const element = elementRef.current;
    cornerstone.enable(element);
    setLoadError(null);

    [
      cornerstoneTools.WwwcTool,
      cornerstoneTools.ArrowAnnotateTool,
      cornerstoneTools.PanTool,
      cornerstoneTools.ZoomTool,
      cornerstoneTools.LengthTool, // ← قياس المسافات
      cornerstoneTools.AngleTool, // ← قياس الزوايا
      cornerstoneTools.EllipticalRoiTool, // ← ROI بيظهر mean/std
      cornerstoneTools.RotateTool, // ← تدوير
    ].forEach((Tool) => cornerstoneTools.addToolForElement(element, Tool));

    // ✅ صورة fundus عادية (jpeg/png) تتحمل مباشرة عن طريق web image loader
    // ملف DICOM حقيقي يتحمل عن طريق wadouri (dicom parser)
    const imageId = isPlainImage ? singleImageUrl : `wadouri:${singleImageUrl}`;

    cornerstone
      .loadImage(imageId)
      .then((image) => {
        cornerstone.displayImage(element, image);
        imageLoadedRef.current = true;

        if (isPlainImage) {
          // صورة عادية مفيهاش DICOM tags
          setImageInfo({
            rows: image.height,
            cols: image.width,
            bits: 8,
            modality: "Fundus Photo",
            patientId: "—",
            studyDate: "—",
          });
        } else {
          // استخراج metadata من DICOM
          const ds = image.data;
          setImageInfo({
            rows: ds.uint16("x00280010") || image.height,
            cols: ds.uint16("x00280011") || image.width,
            bits: ds.uint16("x00280100") || 8,
            modality: ds.string("x00080060") || "OP",
            patientId: ds.string("x00100020") || "—",
            studyDate: ds.string("x00080020") || "—",
          });
        }

        const defaultTool = isPlainImage ? "Pan" : "Wwwc";
        cornerstoneTools.setToolActiveForElement(element, defaultTool, {
          mouseButtonMask: 1,
        });
        setActiveTool(defaultTool);

        // Zoom event listener
        element.addEventListener("cornerstoneimagerendered", (e) => {
          setZoom(e.detail.viewport.scale?.toFixed(2) || 1);
        });
      })
      .catch((err) => {
        console.error("Failed to load image:", err);
        setLoadError(
          isPlainImage
            ? "فشل تحميل الصورة. تأكد من صحة الرابط."
            : "فشل تحميل ملف DICOM. تأكد من صحة الرابط أو صيغة الملف.",
        );
      });

    return () => {
      imageLoadedRef.current = false;
      cornerstone.disable(element);
    };
  }, [viewMode, singleImageUrl, isPlainImage]);

  // ── مسح القياسة المحددة عند الضغط على Delete / Backspace ────────
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        // منع المسح لو المستخدم كاتب في أي input/textarea في الصفحة
        const tag = document.activeElement?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        removeSelectedAnnotations();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [removeSelectedAnnotations]);

  // ── Tool switcher ───────────────────────────────────────────────
  const changeTool = (toolName) => {
    const el = elementRef.current;
    if (!el) return;
    [
      "Wwwc",
      "ArrowAnnotate",
      "Pan",
      "Zoom",
      "Length",
      "Angle",
      "EllipticalRoi",
      "Rotate",
    ].forEach((t) => cornerstoneTools.setToolPassiveForElement(el, t));
    cornerstoneTools.setToolActiveForElement(el, toolName, {
      mouseButtonMask: 1,
    });
    setActiveTool(toolName);
  };

  // ── Preset handler ──────────────────────────────────────────────
  const applyPreset = (name) => {
    const p = PRESETS[name];
    if (!p) return;
    setActivePreset(name);
    setGamma(p.gamma);
    setClahe(p.clahe);
    setSharp(p.sharp);
    setChannel(p.channel);

    const el = elementRef.current;
    if (el && imageLoadedRef.current && p.ww) {
      const vp = cornerstone.getViewport(el);
      vp.voi.windowWidth = p.ww;
      vp.voi.windowCenter = p.wc;
      cornerstone.setViewport(el, vp);
    }
    rerender({
      gamma: p.gamma,
      clahe: p.clahe,
      sharp: p.sharp,
      channel: p.channel,
    });
  };

  // ── Slider handler (generic) ────────────────────────────────────
  const handleSlider = (setter, key) => (e) => {
    const v = parseFloat(e.target.value);
    setter(v);
    rerender({ [key]: v });
  };

  // ── Invert ──────────────────────────────────────────────────────
  const toggleInvert = () => {
    const next = !isInverted;
    setIsInverted(next);
    rerender({ isInverted: next });
  };

  // ── Export PNG ──────────────────────────────────────────────────
  const exportPNG = () => {
    const canvas = elementRef.current?.querySelector("canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "fundus_export.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  // ── Reset ───────────────────────────────────────────────────────
  const reset = () => {
    setGamma(1.0);
    setClahe(0);
    setSharp(0);
    setChannel("all");
    setIsInverted(false);
    setActivePreset("normal");
    cornerstone.reset(elementRef.current);
    imageLoadedRef.current && cornerstone.updateImage(elementRef.current);
  };

  // ── Switch back to the layer stack (only relevant if we came from it) ──
  const backToLayers = () => {
    setViewMode("layers");
  };

  // ── Slider config ───────────────────────────────────────────────
  const sliders = [
    {
      label: "Gamma",
      key: "gamma",
      val: gamma,
      setter: setGamma,
      min: 0.2,
      max: 3.0,
      step: 0.05,
    },
    {
      label: "CLAHE",
      key: "clahe",
      val: clahe,
      setter: setClahe,
      min: 0,
      max: 1,
      step: 0.05,
    },
    {
      label: "Sharpness",
      key: "sharp",
      val: sharp,
      setter: setSharp,
      min: 0,
      max: 10,
      step: 0.5,
    },
  ];

  return (
    <div
      style={{
        background: "#0d0d0d",
        color: "#fff",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
      }}
    >
      {/* ── Mode switch bar (only shown when multiple aligned images were passed) ── */}
      {hasLayers && (
        <div
          style={{
            padding: "6px 12px",
            borderBottom: "1px solid #2a2a2a",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <ButtonGroup size="sm">
            <Button
              variant={viewMode === "layers" ? "primary" : "outline-secondary"}
              onClick={() => setViewMode("layers")}
            >
              Layer View
            </Button>
            <Button
              variant={viewMode === "single" ? "primary" : "outline-secondary"}
              onClick={() => setViewMode("single")}
            >
              Single Image View
            </Button>
          </ButtonGroup>

          {viewMode === "single" && (
            <Button size="sm" variant="outline-light" onClick={backToLayers}>
              ← Back to Layers
            </Button>
          )}
        </div>
      )}

      {/* ── Layer View: stacked/blendable images ── */}
      {viewMode === "layers" && hasLayers && (
        <div style={{ flex: 1, minHeight: 0 }}>
          <LayerViewer
            layers={parsedImages}
            onSelectSingle={(url) => {
              setSingleImageUrl(url);
              setViewMode("single");
            }}
          />
        </div>
      )}

      {/* ── Single Image / DICOM View: existing cornerstone-based viewer (unchanged) ── */}
      {viewMode === "single" && (
        <>
          {/* ── Top toolbar ── */}
          <div
            style={{
              padding: "8px 12px",
              borderBottom: "1px solid #2a2a2a",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {/* Tool buttons */}
            <ButtonGroup size="sm">
              {[
                { id: "Wwwc", label: "W/L" },
                { id: "Pan", label: "Pan" },
                { id: "Zoom", label: "Zoom" },
                { id: "Length", label: "Length" },
                { id: "Angle", label: "Angle" },
                { id: "EllipticalRoi", label: "ROI" },
                { id: "ArrowAnnotate", label: "Annotate" },
                { id: "Rotate", label: "Rotate" },
              ].map(({ id, label }) => (
                <Button
                  key={id}
                  size="sm"
                  variant={activeTool === id ? "primary" : "outline-secondary"}
                  onClick={() => changeTool(id)}
                >
                  {label}
                </Button>
              ))}
            </ButtonGroup>

            {/* Fundus presets */}
            <ButtonGroup size="sm">
              {Object.keys(PRESETS).map((name) => (
                <Button
                  key={name}
                  size="sm"
                  variant={
                    activePreset === name ? "warning" : "outline-warning"
                  }
                  onClick={() => applyPreset(name)}
                  style={{ textTransform: "capitalize" }}
                >
                  {name}
                </Button>
              ))}
            </ButtonGroup>

            {/* Channel */}
            <ButtonGroup size="sm">
              {["all", "r", "g", "b"].map((ch) => (
                <Button
                  key={ch}
                  size="sm"
                  variant={channel === ch ? "info" : "outline-info"}
                  onClick={() => {
                    setChannel(ch);
                    rerender({ channel: ch });
                  }}
                  style={{ textTransform: "uppercase" }}
                >
                  {ch === "all" ? "RGB" : ch}
                </Button>
              ))}
            </ButtonGroup>

            {/* Sliders */}
            {sliders.map(({ label, key, val, setter, min, max, step }) => (
              <div
                key={key}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span style={{ fontSize: 12, minWidth: 60, color: "#aaa" }}>
                  {label}
                </span>
                <Form.Range
                  style={{ width: 110 }}
                  min={min}
                  max={max}
                  step={step}
                  value={val}
                  onChange={handleSlider(setter, key)}
                />
                <span style={{ fontSize: 12, minWidth: 28, color: "#fff" }}>
                  {val.toFixed(key === "sharp" ? 1 : 2)}
                </span>
              </div>
            ))}

            {/* Extra buttons */}
            <Button
              size="sm"
              variant={isInverted ? "light" : "outline-light"}
              onClick={toggleInvert}
            >
              Invert
            </Button>
            <Button size="sm" variant="outline-light" onClick={exportPNG}>
              Export PNG
            </Button>
            <Button
              size="sm"
              variant="outline-danger"
              onClick={clearAllAnnotations}
            >
              Clear Annotations
            </Button>
            <Button size="sm" variant="danger" onClick={reset}>
              Reset
            </Button>
          </div>

          {/* ── Canvas area ── */}
          <div style={{ flex: 1, display: "flex", position: "relative" }}>
            <div
              ref={elementRef}
              onContextMenu={(e) => e.preventDefault()}
              style={{ width: "100%", height: "100%", background: "black" }}
            />

            {/* ── Error message ── */}
            {loadError && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "rgba(180,30,30,0.85)",
                  padding: "16px 24px",
                  borderRadius: 8,
                  fontSize: 14,
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                {loadError}
              </div>
            )}

            {/* ── Metadata overlay (bottom-left) ── */}
            {imageInfo && (
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 12,
                  background: "rgba(0,0,0,0.55)",
                  padding: "8px 12px",
                  borderRadius: 6,
                  fontSize: 11,
                  lineHeight: 1.7,
                  color: "#ccc",
                  pointerEvents: "none",
                }}
              >
                <div>
                  Patient:{" "}
                  <b style={{ color: "#fff" }}>{imageInfo.patientId}</b>
                </div>
                <div>
                  Date: <b style={{ color: "#fff" }}>{imageInfo.studyDate}</b>
                </div>
                <div>
                  Size:{" "}
                  <b style={{ color: "#fff" }}>
                    {imageInfo.cols} × {imageInfo.rows}
                  </b>
                </div>
                <div>
                  Bits: <b style={{ color: "#fff" }}>{imageInfo.bits}</b>
                </div>
                <div>
                  Modality:{" "}
                  <b style={{ color: "#fff" }}>{imageInfo.modality}</b>
                </div>
              </div>
            )}

            {/* ── Zoom badge (top-right) ── */}
            <div
              style={{
                position: "absolute",
                top: 10,
                right: 12,
                pointerEvents: "none",
              }}
            >
              <Badge bg="secondary">Zoom: {zoom}x</Badge>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DicomViewerPage;
