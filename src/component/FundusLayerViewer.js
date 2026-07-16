import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { Button, ButtonGroup, Form } from "react-bootstrap";
import {
  Eye,
  EyeSlash,
  ChevronUp,
  ChevronDown,
  ArrowCounterclockwise,
  Download,
  ZoomIn,
  ZoomOut,
  Fullscreen,
  Sliders,
} from "react-bootstrap-icons";

/* ────────────────────────────────────────────────────────────
   Display label for each modality.
──────────────────────────────────────────────────────────── */
const MODALITY_LABELS = {
  COLOR: "COLOR",
  IR_R: "IR",
  IR_L: "IR",
  IR: "IR",
  RF_R: "RF_R",
  RF_G: "RF_G",
  RF_B: "RF_B",
  UNKNOWN: "UNKNOWN",
};
const getModalityLabel = (modality) =>
  MODALITY_LABELS[modality] || modality || "UNKNOWN";

/* ────────────────────────────────────────────────────────────
   Full Photoshop blend-mode list, grouped exactly like the
   Photoshop layer panel dropdown.
──────────────────────────────────────────────────────────── */
const BLEND_GROUPS = [
  {
    group: "Normal",
    modes: [
      { value: "normal", label: "Normal" },
      { value: "dissolve", label: "Dissolve" },
    ],
  },
  {
    group: "Darken",
    modes: [
      { value: "darken", label: "Darken" },
      { value: "multiply", label: "Multiply" },
      { value: "color-burn", label: "Color Burn" },
      { value: "linear-burn", label: "Linear Burn" },
      { value: "darker-color", label: "Darker Color" },
    ],
  },
  {
    group: "Lighten",
    modes: [
      { value: "lighten", label: "Lighten" },
      { value: "screen", label: "Screen" },
      { value: "color-dodge", label: "Color Dodge" },
      { value: "linear-dodge", label: "Linear Dodge (Add)" },
      { value: "lighter-color", label: "Lighter Color" },
    ],
  },
  {
    group: "Contrast",
    modes: [
      { value: "overlay", label: "Overlay" },
      { value: "soft-light", label: "Soft Light" },
      { value: "hard-light", label: "Hard Light" },
      { value: "vivid-light", label: "Vivid Light" },
      { value: "linear-light", label: "Linear Light" },
      { value: "pin-light", label: "Pin Light" },
      { value: "hard-mix", label: "Hard Mix" },
    ],
  },
  {
    group: "Difference",
    modes: [
      { value: "difference", label: "Difference" },
      { value: "exclusion", label: "Exclusion" },
      { value: "subtract", label: "Subtract" },
      { value: "divide", label: "Divide" },
    ],
  },
  {
    group: "Color",
    modes: [
      { value: "hue", label: "Hue" },
      { value: "saturation", label: "Saturation" },
      { value: "color", label: "Color" },
      { value: "luminosity", label: "Luminosity" },
    ],
  },
];

// NOTE: CSS `mix-blend-mode` / Canvas `globalCompositeOperation` only support
// a subset of the modes above. Since any layer can be set to ANY of these,
// the whole stack is composited by hand, pixel-by-pixel, on a canvas below.

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/* ────────────────────────────────────────────────────────────
   Per-layer pixel adjustments — same math as the Single Image
   view's gamma / CLAHE / sharpness / channel / invert filters,
   applied directly to a raw ImageData buffer per layer.
──────────────────────────────────────────────────────────── */
const applyGammaData = (data, gamma) => {
  if (gamma === 1) return;
  const lut = new Uint8ClampedArray(256);
  for (let i = 0; i < 256; i++)
    lut[i] = Math.round(Math.pow(i / 255, 1 / gamma) * 255);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = lut[data[i]];
    data[i + 1] = lut[data[i + 1]];
    data[i + 2] = lut[data[i + 2]];
  }
};

const applyCLAHEData = (data, width, height, strength) => {
  if (!strength) return;
  const hist = new Float32Array(256);
  for (let i = 0; i < data.length; i += 4) {
    const l = Math.round(
      0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2],
    );
    hist[l]++;
  }
  const total = width * height;
  let cum = 0;
  const lut = new Uint8Array(256);
  for (let v = 0; v < 256; v++) {
    cum += hist[v];
    lut[v] = Math.round((cum / total) * 255);
  }
  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i] * (1 - strength) + lut[data[i]] * strength;
    data[i + 1] = data[i + 1] * (1 - strength) + lut[data[i + 1]] * strength;
    data[i + 2] = data[i + 2] * (1 - strength) + lut[data[i + 2]] * strength;
  }
};

const applySharpnessData = (data, width, height, amount) => {
  if (!amount) return;
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
        data[i + c] = clamp(copy[i + c] + amount * lap * 0.08, 0, 255);
      }
    }
  }
};

const applyChannelData = (data, channel) => {
  if (channel === "all") return;
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
};

const applyInvertData = (data, invert) => {
  if (!invert) return;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
};

const processLayerPixels = (rawData, width, height, adj) => {
  const data = new Uint8ClampedArray(rawData);
  applyInvertData(data, adj.invert);
  applyGammaData(data, adj.gamma);
  applyCLAHEData(data, width, height, adj.clahe);
  applySharpnessData(data, width, height, adj.sharp);
  applyChannelData(data, adj.channel);
  return data;
};

// Global brightness/contrast — driven by the "W/L" tool, applied as the
// final step on the composited image (same idea as cornerstone's Wwwc).
const applyGlobalBrightnessContrast = (data, brightness, contrast) => {
  if (!brightness && !contrast) return;
  const c = (259 * (contrast + 255)) / (255 * (259 - contrast));
  for (let p = 0; p < data.length; p += 4) {
    for (let k = 0; k < 3; k++) {
      let v = data[p + k] + brightness;
      v = c * (v - 128) + 128;
      data[p + k] = clamp(v, 0, 255);
    }
  }
};

/* ────────────────────────────────────────────────────────────
   Blend math — W3C compositing/blending formulas, extended with
   the extra Photoshop-only modes browsers don't implement natively.
   All channel values are 0..1.
──────────────────────────────────────────────────────────── */
const lum = (r, g, b) => 0.3 * r + 0.59 * g + 0.11 * b;

const clipColor = ([r, g, b]) => {
  const l = lum(r, g, b);
  const n = Math.min(r, g, b);
  const x = Math.max(r, g, b);
  if (n < 0) {
    r = l + ((r - l) * l) / (l - n);
    g = l + ((g - l) * l) / (l - n);
    b = l + ((b - l) * l) / (l - n);
  }
  if (x > 1) {
    r = l + ((r - l) * (1 - l)) / (x - l);
    g = l + ((g - l) * (1 - l)) / (x - l);
    b = l + ((b - l) * (1 - l)) / (x - l);
  }
  return [r, g, b];
};
const setLum = (c, l) => {
  const d = l - lum(c[0], c[1], c[2]);
  return clipColor([c[0] + d, c[1] + d, c[2] + d]);
};
const sat = (c) => Math.max(c[0], c[1], c[2]) - Math.min(c[0], c[1], c[2]);
const setSat = (c, s) => {
  const idx = [0, 1, 2].sort((a, b) => c[a] - c[b]);
  const out = [0, 0, 0];
  if (c[idx[2]] > c[idx[0]]) {
    out[idx[1]] = ((c[idx[1]] - c[idx[0]]) * s) / (c[idx[2]] - c[idx[0]]);
    out[idx[2]] = s;
  }
  out[idx[0]] = 0;
  return out;
};

const blendChannel = (mode, cb, cs) => {
  switch (mode) {
    case "multiply":
      return cb * cs;
    case "screen":
      return cb + cs - cb * cs;
    case "darken":
      return Math.min(cb, cs);
    case "lighten":
      return Math.max(cb, cs);
    case "color-dodge":
      return cb <= 0 ? 0 : cs >= 1 ? 1 : Math.min(1, cb / (1 - cs));
    case "color-burn":
      return cb >= 1 ? 1 : cs <= 0 ? 0 : 1 - Math.min(1, (1 - cb) / cs);
    case "hard-light":
      return cs <= 0.5 ? 2 * cb * cs : 1 - 2 * (1 - cb) * (1 - cs);
    case "overlay":
      return cb <= 0.5 ? 2 * cb * cs : 1 - 2 * (1 - cb) * (1 - cs);
    case "soft-light": {
      const d = cb <= 0.25 ? ((16 * cb - 12) * cb + 4) * cb : Math.sqrt(cb);
      return cs <= 0.5
        ? cb - (1 - 2 * cs) * cb * (1 - cb)
        : cb + (2 * cs - 1) * (d - cb);
    }
    case "difference":
      return Math.abs(cb - cs);
    case "exclusion":
      return cb + cs - 2 * cb * cs;
    case "linear-burn":
      return clamp01(cb + cs - 1);
    case "linear-dodge":
      return clamp01(cb + cs);
    case "linear-light":
      return clamp01(cb + 2 * cs - 1);
    case "vivid-light": {
      const c2 = 2 * cs;
      return cs <= 0.5
        ? cb >= 1
          ? 1
          : c2 <= 0
            ? 0
            : 1 - Math.min(1, (1 - cb) / c2)
        : cb <= 0
          ? 0
          : c2 - 1 >= 1
            ? 1
            : Math.min(1, cb / (1 - (c2 - 1)));
    }
    case "pin-light":
      return cs <= 0.5 ? Math.min(cb, 2 * cs) : Math.max(cb, 2 * (cs - 0.5));
    case "hard-mix":
      return blendChannel("vivid-light", cb, cs) < 0.5 ? 0 : 1;
    case "subtract":
      return clamp01(cb - cs);
    case "divide":
      return cs <= 0 ? 1 : clamp01(cb / cs);
    default:
      return cs; // normal
  }
};

const PER_CHANNEL_MODES = new Set([
  "normal",
  "multiply",
  "screen",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "overlay",
  "soft-light",
  "difference",
  "exclusion",
  "linear-burn",
  "linear-dodge",
  "linear-light",
  "vivid-light",
  "pin-light",
  "hard-mix",
  "subtract",
  "divide",
]);

const blendPixel = (mode, base, src) => {
  if (mode === "darker-color") return lum(...src) < lum(...base) ? src : base;
  if (mode === "lighter-color") return lum(...src) > lum(...base) ? src : base;
  if (mode === "hue") return setLum(setSat(src, sat(base)), lum(...base));
  if (mode === "saturation")
    return setLum(setSat(base, sat(src)), lum(...base));
  if (mode === "color") return setLum(src, lum(...base));
  if (mode === "luminosity") return setLum(base, lum(...src));
  if (PER_CHANNEL_MODES.has(mode))
    return [
      blendChannel(mode, base[0], src[0]),
      blendChannel(mode, base[1], src[1]),
      blendChannel(mode, base[2], src[2]),
    ];
  return src;
};

const pseudoRandom = (i) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const compositeLayers = (width, height, orderedLayers) => {
  const out = new Uint8ClampedArray(width * height * 4);
  let started = false;
  for (const layer of orderedLayers) {
    if (!layer.visible) continue;
    const a = layer.opacity / 100;
    const src = layer.data;
    if (!started) {
      for (let p = 0; p < out.length; p += 4) {
        out[p] = src[p] * a;
        out[p + 1] = src[p + 1] * a;
        out[p + 2] = src[p + 2] * a;
        out[p + 3] = 255;
      }
      started = true;
      continue;
    }
    if (layer.blendMode === "dissolve") {
      for (let p = 0; p < out.length; p += 4) {
        if (pseudoRandom(p) < a) {
          out[p] = src[p];
          out[p + 1] = src[p + 1];
          out[p + 2] = src[p + 2];
        }
        out[p + 3] = 255;
      }
      continue;
    }
    for (let p = 0; p < out.length; p += 4) {
      const base = [out[p] / 255, out[p + 1] / 255, out[p + 2] / 255];
      const cs = [src[p] / 255, src[p + 1] / 255, src[p + 2] / 255];
      const b = blendPixel(layer.blendMode, base, cs);
      out[p] = ((1 - a) * base[0] + a * clamp01(b[0])) * 255;
      out[p + 1] = ((1 - a) * base[1] + a * clamp01(b[1])) * 255;
      out[p + 2] = ((1 - a) * base[2] + a * clamp01(b[2])) * 255;
      out[p + 3] = 255;
    }
  }
  return out;
};

const loadRawImageData = (url, maxSize) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const scale = Math.min(
        1,
        maxSize / Math.max(img.naturalWidth, img.naturalHeight),
      );
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      resolve({ data: ctx.getImageData(0, 0, w, h).data, width: w, height: h });
    };
    img.onerror = reject;
    img.src = url;
  });

const DEFAULT_ADJUST = {
  gamma: 1,
  clahe: 0,
  sharp: 0,
  channel: "all",
  invert: false,
};
const WORKING_MAX = 1400;

/* ────────────────────────────────────────────────────────────
   Annotation / measurement tools (Length, Angle, ROI, Annotate)
   — a lightweight from-scratch implementation, since the composited
   stack is a plain canvas and not a cornerstone element. Coordinates
   are always stored in CANVAS-PIXEL space so they render correctly
   just by sitting inside the same transformed <div> as the canvas.
──────────────────────────────────────────────────────────── */
const TOOLS = ["pan", "wl", "zoom", "length", "angle", "roi", "arrow"];
const DRAW_TOOLS = new Set(["length", "angle", "roi", "arrow"]);

const dist = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);

const distToSegment = (p, a, b) => {
  const l2 = dist(a, b) ** 2;
  if (l2 === 0) return dist(p, a);
  let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
  t = clamp(t, 0, 1);
  const proj = { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) };
  return dist(p, proj);
};

// Rect-fraction (0..1, from getBoundingClientRect on the transformed frame)
// -> canvas-pixel coords, accounting for 0/90/180/270° rotation. Rotation is
// restricted to 90° steps specifically so this mapping stays exact (an
// axis-aligned bounding box for anything in-between wouldn't be invertible
// this way).
const rectFractionToCanvas = (fx, fy, rotation, W, H) => {
  const r = (((Math.round(rotation / 90) * 90) % 360) + 360) % 360;
  let u, v;
  if (r === 90) {
    u = fy;
    v = 1 - fx;
  } else if (r === 180) {
    u = 1 - fx;
    v = 1 - fy;
  } else if (r === 270) {
    u = 1 - fy;
    v = fx;
  } else {
    u = fx;
    v = fy;
  }
  return { x: u * W, y: v * H };
};

/**
 * LayerViewer
 * Displays a stack of pixel-aligned retina images (COLOR, IR, RF_R, RF_G, RF_B)
 * as togglable/blendable/adjustable layers, Photoshop-panel style, with the
 * same measurement/annotation tools as the Single Image view.
 *
 * Props:
 *  - layers: [{ url, modality, aligned, _id }]
 *  - onSelectSingle(url): optional callback to switch to single-image view
 */
const LayerViewer = ({ layers, onSelectSingle }) => {
  const initialLayerStates = useMemo(
    () =>
      layers.map((layer, index) => ({
        id: layer._id || layer.url,
        url: layer.url,
        modality: layer.modality,
        label: getModalityLabel(layer.modality),
        visible: layer.modality === "COLOR" || index === 0,
        opacity: layer.modality === "COLOR" || index === 0 ? 100 : 70,
        blendMode: "normal",
        adjust: { ...DEFAULT_ADJUST },
      })),
    [layers],
  );

  const [layerStates, setLayerStates] = useState(initialLayerStates);
  const [order, setOrder] = useState(initialLayerStates.map((l) => l.id));
  const [expandedId, setExpandedId] = useState(null);

  // View transform
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0); // 0/90/180/270

  // Global W/L (brightness/contrast on the final composite)
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);

  // Active tool + annotations
  const [activeTool, setActiveTool] = useState("pan");
  const [annotations, setAnnotations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState(null); // in-progress annotation preview
  const angleDraftRef = useRef([]); // points collected for the 3-click Angle tool

  const dragState = useRef(null);
  const dragOrderId = useRef(null);
  const frameRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const rawCacheRef = useRef(new Map());
  const canvasRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all(
      layers.map((l) =>
        loadRawImageData(l.url, WORKING_MAX).then((res) => ({
          id: l._id || l.url,
          ...res,
        })),
      ),
    )
      .then((results) => {
        if (cancelled) return;
        rawCacheRef.current = new Map(results.map((r) => [r.id, r]));
        setCanvasSize({
          width: results[0]?.width || 0,
          height: results[0]?.height || 0,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load layer images:", err);
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [layers]);

  const updateLayer = (id, patch) =>
    setLayerStates((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    );
  const updateAdjust = (id, patch) =>
    setLayerStates((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, adjust: { ...l.adjust, ...patch } } : l,
      ),
    );
  const toggleVisibility = (id) => {
    const layer = layerStates.find((l) => l.id === id);
    updateLayer(id, { visible: !layer.visible });
  };
  const moveLayer = (id, direction) => {
    setOrder((prev) => {
      const idx = prev.indexOf(id);
      const swapWith = direction === "up" ? idx + 1 : idx - 1;
      if (swapWith < 0 || swapWith >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
      return next;
    });
  };
  const reorderByDrag = (draggedId, targetId) => {
    if (draggedId === targetId) return;
    setOrder((prev) => {
      const next = [...prev];
      const from = next.indexOf(draggedId);
      const to = next.indexOf(targetId);
      if (from === -1 || to === -1) return prev;
      next.splice(from, 1);
      next.splice(to, 0, draggedId);
      return next;
    });
  };

  const resetAll = () => {
    setLayerStates(initialLayerStates);
    setOrder(initialLayerStates.map((l) => l.id));
    setScale(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
    setBrightness(0);
    setContrast(0);
    setAnnotations([]);
    setSelectedId(null);
    setActiveTool("pan");
  };

  /* ── Annotation helpers ──────────────────────────────────── */
  const clearAllAnnotations = () => {
    setAnnotations([]);
    setSelectedId(null);
    angleDraftRef.current = [];
  };

  const removeSelectedAnnotation = useCallback(() => {
    setAnnotations((prev) => {
      if (!selectedId) return prev;
      return prev.filter((a) => a.id !== selectedId);
    });
    setSelectedId(null);
  }, [selectedId]);

  // Delete/Backspace removes the selected annotation, matching Single Image view.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const tag = document.activeElement?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        if (selectedId) {
          e.preventDefault();
          removeSelectedAnnotation();
        }
      } else if (e.key === "Escape") {
        angleDraftRef.current = [];
        setDraft(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId, removeSelectedAnnotation]);

  const hitTestAnnotation = (pt) => {
    const threshold = clamp(canvasSize.width / 90, 18, 45) / scale;
    for (let i = annotations.length - 1; i >= 0; i--) {
      const a = annotations[i];
      if (a.type === "length" || a.type === "arrow") {
        if (distToSegment(pt, a.points[0], a.points[1]) <= threshold)
          return a.id;
      } else if (a.type === "angle") {
        if (
          distToSegment(pt, a.points[1], a.points[0]) <= threshold ||
          distToSegment(pt, a.points[1], a.points[2]) <= threshold
        )
          return a.id;
      } else if (a.type === "roi") {
        const [p1, p2] = a.points;
        const cx = (p1.x + p2.x) / 2;
        const cy = (p1.y + p2.y) / 2;
        const rx = Math.abs(p2.x - p1.x) / 2;
        const ry = Math.abs(p2.y - p1.y) / 2;
        if (rx === 0 || ry === 0) continue;
        const nx = (pt.x - cx) / rx;
        const ny = (pt.y - cy) / ry;
        if (nx * nx + ny * ny <= 1) return a.id;
      }
    }
    return null;
  };

  const computeRoiStats = (p1, p2) => {
    const canvas = canvasRef.current;
    if (!canvas) return { mean: 0, std: 0 };
    const x0 = clamp(Math.min(p1.x, p2.x), 0, canvas.width - 1);
    const y0 = clamp(Math.min(p1.y, p2.y), 0, canvas.height - 1);
    const x1 = clamp(Math.max(p1.x, p2.x), 0, canvas.width);
    const y1 = clamp(Math.max(p1.y, p2.y), 0, canvas.height);
    const w = Math.max(1, Math.round(x1 - x0));
    const h = Math.max(1, Math.round(y1 - y0));
    let data;
    try {
      data = canvas
        .getContext("2d")
        .getImageData(Math.round(x0), Math.round(y0), w, h).data;
    } catch (err) {
      return { mean: 0, std: 0 };
    }
    const cx = w / 2,
      cy = h / 2;
    const rx = w / 2,
      ry = h / 2;
    let sum = 0,
      sumSq = 0,
      n = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const nx = (x - cx) / (rx || 1);
        const ny = (y - cy) / (ry || 1);
        if (nx * nx + ny * ny > 1) continue;
        const i = (y * w + x) * 4;
        const l = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        sum += l;
        sumSq += l * l;
        n++;
      }
    }
    if (n === 0) return { mean: 0, std: 0 };
    const mean = sum / n;
    const std = Math.sqrt(Math.max(0, sumSq / n - mean * mean));
    return { mean, std };
  };

  const clientToCanvasPoint = (clientX, clientY) => {
    const el = frameRef.current;
    if (!el || !canvasSize.width) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    const fx = (clientX - rect.left) / rect.width;
    const fy = (clientY - rect.top) / rect.height;
    return rectFractionToCanvas(
      fx,
      fy,
      rotation,
      canvasSize.width,
      canvasSize.height,
    );
  };

  /* ── Pointer handlers (Pan / W-L / Zoom / drawing / selection) ── */
  const handleMouseDown = (e) => {
    const pt = clientToCanvasPoint(e.clientX, e.clientY);

    if (activeTool !== "angle" || angleDraftRef.current.length === 0) {
      const hitId = hitTestAnnotation(pt);
      if (hitId) {
        setSelectedId(hitId);
        return;
      }
    }
    setSelectedId(null);

    if (activeTool === "pan") {
      dragState.current = {
        mode: "pan",
        startX: e.clientX,
        startY: e.clientY,
        panX: pan.x,
        panY: pan.y,
      };
    } else if (activeTool === "wl") {
      dragState.current = {
        mode: "wl",
        startX: e.clientX,
        startY: e.clientY,
        baseBrightness: brightness,
        baseContrast: contrast,
      };
    } else if (activeTool === "zoom") {
      dragState.current = { mode: "zoom", startY: e.clientY, baseScale: scale };
    } else if (activeTool === "length" || activeTool === "arrow") {
      dragState.current = { mode: activeTool, start: pt };
      setDraft({ type: activeTool, points: [pt, pt] });
    } else if (activeTool === "roi") {
      dragState.current = { mode: "roi", start: pt };
      setDraft({ type: "roi", points: [pt, pt] });
    } else if (activeTool === "angle") {
      const pts = [...angleDraftRef.current, pt];
      angleDraftRef.current = pts;
      if (pts.length < 3) {
        setDraft({ type: "angle", points: pts });
      } else {
        const [a, vtx, c] = pts;
        const ang = angleBetween(a, vtx, c);
        setAnnotations((prev) => [
          ...prev,
          {
            id: `ann-${Date.now()}`,
            type: "angle",
            points: [a, vtx, c],
            label: `${ang.toFixed(1)}°`,
          },
        ]);
        angleDraftRef.current = [];
        setDraft(null);
      }
    }
  };

  const handleMouseMove = (e) => {
    const d = dragState.current;
    if (!d) return;
    if (d.mode === "pan") {
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      setPan({ x: d.panX + dx, y: d.panY + dy });
    } else if (d.mode === "wl") {
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      setBrightness(clamp(d.baseBrightness - dy * 0.5, -150, 150));
      setContrast(clamp(d.baseContrast + dx * 0.5, -150, 150));
    } else if (d.mode === "zoom") {
      const dy = e.clientY - d.startY;
      setScale(clamp(d.baseScale - dy * 0.005, 0.3, 5));
    } else if (d.mode === "length" || d.mode === "arrow") {
      const pt = clientToCanvasPoint(e.clientX, e.clientY);
      setDraft({ type: d.mode, points: [d.start, pt] });
    } else if (d.mode === "roi") {
      const pt = clientToCanvasPoint(e.clientX, e.clientY);
      setDraft({ type: "roi", points: [d.start, pt] });
    }
  };

  const handleMouseUp = () => {
    const d = dragState.current;
    if (
      d &&
      (d.mode === "length" || d.mode === "arrow" || d.mode === "roi") &&
      draft
    ) {
      const [p1, p2] = draft.points;
      if (dist(p1, p2) > 3 / scale) {
        if (d.mode === "length") {
          setAnnotations((prev) => [
            ...prev,
            {
              id: `ann-${Date.now()}`,
              type: "length",
              points: [p1, p2],
              label: `${dist(p1, p2).toFixed(0)} px`,
            },
          ]);
        } else if (d.mode === "roi") {
          const { mean, std } = computeRoiStats(p1, p2);
          setAnnotations((prev) => [
            ...prev,
            {
              id: `ann-${Date.now()}`,
              type: "roi",
              points: [p1, p2],
              label: `Mean ${mean.toFixed(1)}  SD ${std.toFixed(1)}`,
            },
          ]);
        } else if (d.mode === "arrow") {
          const text = window.prompt("Annotation text:", "") || "";
          setAnnotations((prev) => [
            ...prev,
            {
              id: `ann-${Date.now()}`,
              type: "arrow",
              points: [p1, p2],
              label: text,
            },
          ]);
        }
      }
    }
    dragState.current = null;
    setDraft(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((s) => clamp(parseFloat((s + delta).toFixed(2)), 0.3, 5));
  };

  const rotateStep = () => setRotation((r) => (r + 90) % 360);

  const stackedForRender = order
    .map((id) => layerStates.find((l) => l.id === id))
    .filter(Boolean);
  const panelOrder = [...stackedForRender].reverse();

  /* ── Recompute the on-screen composite whenever anything relevant changes. ── */
  useEffect(() => {
    if (loading || !canvasSize.width) return;
    const ready = stackedForRender.every((l) => rawCacheRef.current.has(l.id));
    if (!ready) return;
    const t = setTimeout(() => {
      const processed = stackedForRender.map((l) => {
        const raw = rawCacheRef.current.get(l.id);
        return {
          data: processLayerPixels(raw.data, raw.width, raw.height, l.adjust),
          visible: l.visible,
          opacity: l.opacity,
          blendMode: l.blendMode,
        };
      });
      const composite = compositeLayers(
        canvasSize.width,
        canvasSize.height,
        processed,
      );
      applyGlobalBrightnessContrast(composite, brightness, contrast);
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      canvas
        .getContext("2d")
        .putImageData(
          new ImageData(composite, canvasSize.width, canvasSize.height),
          0,
          0,
        );
    }, 80);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layerStates, order, loading, canvasSize, brightness, contrast]);

  const exportComposite = useCallback(async () => {
    const orderedVisible = order
      .map((id) => layerStates.find((l) => l.id === id))
      .filter((l) => l && l.visible);
    if (orderedVisible.length === 0) return;
    try {
      const fullRaw = await Promise.all(
        orderedVisible.map((l) => loadRawImageData(l.url, 100000)),
      );
      const width = fullRaw[0].width;
      const height = fullRaw[0].height;
      const processed = orderedVisible.map((l, i) => ({
        data: processLayerPixels(fullRaw[i].data, width, height, l.adjust),
        visible: true,
        opacity: l.opacity,
        blendMode: l.blendMode,
      }));
      const composite = compositeLayers(width, height, processed);
      applyGlobalBrightnessContrast(composite, brightness, contrast);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas
        .getContext("2d")
        .putImageData(new ImageData(composite, width, height), 0, 0);
      const a = document.createElement("a");
      a.download = "retina_layers_composite.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (err) {
      console.error("Failed to export composite:", err);
    }
  }, [order, layerStates, brightness, contrast]);

  const toolCursor =
    activeTool === "pan"
      ? dragState.current
        ? "grabbing"
        : "grab"
      : "crosshair";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#0d0d0d",
        color: "#fff",
      }}
    >
      {/* ── Toolbar (same tools as Single Image view) ── */}
      <div
        style={{
          padding: "8px 12px",
          borderBottom: "1px solid #2a2a2a",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 10,
        }}
      >
        <ButtonGroup size="sm">
          {[
            { id: "wl", label: "W/L" },
            { id: "pan", label: "Pan" },
            { id: "zoom", label: "Zoom" },
            { id: "length", label: "Length" },
            { id: "angle", label: "Angle" },
            { id: "roi", label: "ROI" },
            { id: "arrow", label: "Annotate" },
          ].map(({ id, label }) => (
            <Button
              key={id}
              size="sm"
              variant={activeTool === id ? "primary" : "outline-secondary"}
              onClick={() => {
                angleDraftRef.current = [];
                setDraft(null);
                setActiveTool(id);
              }}
            >
              {label}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={rotateStep}
            title="Rotate 90°"
          >
            Rotate
          </Button>
        </ButtonGroup>

        <Button
          size="sm"
          variant="outline-danger"
          onClick={clearAllAnnotations}
        >
          Clear Annotations
        </Button>

        <span style={{ fontSize: 11, color: "#777" }}>
          {activeTool === "angle" && angleDraftRef.current.length > 0
            ? `Click point ${angleDraftRef.current.length + 1} of 3`
            : "Click on any annotation to select it then press Delete to remove it"}
        </span>
      </div>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* ── Canvas / stage area ── */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            cursor: toolCursor,
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              ref={frameRef}
              style={{
                position: "relative",
                width: "80%",
                height: "80%",
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: "center center",
              }}
            >
              <canvas
                ref={canvasRef}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />

              {/* ── Annotation overlay (inherits the same transform automatically) ── */}
              {canvasSize.width > 0 && (
                <svg
                  viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                  }}
                >
                  {annotations.map((a) => (
                    <AnnotationShape
                      key={a.id}
                      a={a}
                      selected={a.id === selectedId}
                      scale={scale}
                      canvasSize={canvasSize}
                    />
                  ))}
                  {draft && (
                    <AnnotationShape
                      a={{ ...draft, id: "draft" }}
                      selected={false}
                      scale={scale}
                      canvasSize={canvasSize}
                      ghost
                    />
                  )}
                </svg>
              )}
            </div>
          </div>

          {loading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#aaa",
                fontSize: 13,
              }}
            >
              Loading images...{" "}
            </div>
          )}

          {/* ── Zoom controls (bottom-left) ── */}
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 12,
              display: "flex",
              gap: 6,
            }}
          >
            <Button
              size="sm"
              variant="outline-light"
              onClick={() => setScale((s) => clamp(s - 0.1, 0.3, 5))}
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </Button>
            <Button
              size="sm"
              variant="outline-light"
              onClick={() => {
                setScale(1);
                setPan({ x: 0, y: 0 });
              }}
              title="Fit to Screen"
            >
              <Fullscreen size={14} />
            </Button>
            <Button
              size="sm"
              variant="outline-light"
              onClick={() => setScale((s) => clamp(s + 0.1, 0.3, 5))}
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </Button>
            <span
              style={{
                fontSize: 12,
                color: "#aaa",
                alignSelf: "center",
                marginLeft: 4,
              }}
            >
              {(scale * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* ── Photoshop-style layer panel ── */}
        <div
          style={{
            width: 320,
            borderLeft: "1px solid #2a2a2a",
            display: "flex",
            flexDirection: "column",
            background: "#171717",
          }}
        >
          <div
            style={{
              padding: "10px 12px",
              borderBottom: "1px solid #2a2a2a",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600 }}>Layers</span>
            <div style={{ display: "flex", gap: 6 }}>
              <Button
                size="sm"
                variant="outline-light"
                onClick={resetAll}
                title="Reset All"
              >
                <ArrowCounterclockwise size={13} />
              </Button>
              <Button
                size="sm"
                variant="outline-light"
                onClick={exportComposite}
                title="Export Composite as PNG (full resolution)"
              >
                <Download size={13} />
              </Button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {panelOrder.map((layer) => (
              <div
                key={layer.id}
                draggable
                onDragStart={() => (dragOrderId.current = layer.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragOrderId.current)
                    reorderByDrag(dragOrderId.current, layer.id);
                  dragOrderId.current = null;
                }}
                style={{
                  borderBottom: "1px solid #232323",
                  padding: "8px 10px",
                  cursor: "grab",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Button
                    size="sm"
                    variant="link"
                    onClick={() => toggleVisibility(layer.id)}
                    style={{
                      padding: 2,
                      color: layer.visible ? "#fff" : "#555",
                    }}
                    title={layer.visible ? "Hide layer" : "Show layer"}
                  >
                    {layer.visible ? <Eye size={16} /> : <EyeSlash size={16} />}
                  </Button>

                  <img
                    src={layer.url}
                    alt={layer.label}
                    crossOrigin="anonymous"
                    style={{
                      width: 36,
                      height: 36,
                      objectFit: "cover",
                      borderRadius: 4,
                      border: "1px solid #333",
                      opacity: layer.visible ? 1 : 0.4,
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {layer.label}
                    </div>
                    {onSelectSingle && (
                      <button
                        onClick={() => onSelectSingle(layer.url)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#6cb2ff",
                          fontSize: 11,
                          padding: 0,
                          cursor: "pointer",
                        }}
                      >
                        View alone
                      </button>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="link"
                    onClick={() =>
                      setExpandedId((prev) =>
                        prev === layer.id ? null : layer.id,
                      )
                    }
                    style={{
                      padding: 2,
                      color: expandedId === layer.id ? "#6cb2ff" : "#aaa",
                    }}
                    title="Gamma / CLAHE / Sharpness / Channel / Invert for this layer"
                  >
                    <Sliders size={14} />
                  </Button>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Button
                      size="sm"
                      variant="link"
                      style={{ padding: 0, color: "#aaa" }}
                      onClick={() => moveLayer(layer.id, "up")}
                      title="Move layer up"
                    >
                      <ChevronUp size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="link"
                      style={{ padding: 0, color: "#aaa" }}
                      onClick={() => moveLayer(layer.id, "down")}
                      title="Move layer down"
                    >
                      <ChevronDown size={14} />
                    </Button>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 8,
                  }}
                >
                  <Form.Select
                    size="sm"
                    value={layer.blendMode}
                    onChange={(e) =>
                      updateLayer(layer.id, { blendMode: e.target.value })
                    }
                    style={{
                      fontSize: 12,
                      background: "#1f1f1f",
                      color: "#fff",
                      border: "1px solid #333",
                      width: 150,
                    }}
                  >
                    {BLEND_GROUPS.map((g) => (
                      <optgroup key={g.group} label={g.group}>
                        {g.modes.map((m) => (
                          <option key={m.value} value={m.value}>
                            {m.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </Form.Select>

                  <Form.Range
                    min={0}
                    max={100}
                    step={1}
                    value={layer.opacity}
                    onChange={(e) =>
                      updateLayer(layer.id, {
                        opacity: parseInt(e.target.value, 10),
                      })
                    }
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: 11, color: "#aaa", width: 30 }}>
                    {layer.opacity}%
                  </span>
                </div>

                {expandedId === layer.id && (
                  <div
                    style={{
                      marginTop: 8,
                      padding: 8,
                      background: "#111",
                      borderRadius: 6,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 4,
                        marginBottom: 6,
                        flexWrap: "wrap",
                      }}
                    >
                      {["all", "r", "g", "b"].map((ch) => (
                        <Button
                          key={ch}
                          size="sm"
                          variant={
                            layer.adjust.channel === ch
                              ? "info"
                              : "outline-info"
                          }
                          onClick={() =>
                            updateAdjust(layer.id, { channel: ch })
                          }
                          style={{ fontSize: 10, padding: "2px 6px" }}
                        >
                          {ch === "all" ? "RGB" : ch.toUpperCase()}
                        </Button>
                      ))}
                      <Button
                        size="sm"
                        variant={
                          layer.adjust.invert ? "light" : "outline-light"
                        }
                        onClick={() =>
                          updateAdjust(layer.id, {
                            invert: !layer.adjust.invert,
                          })
                        }
                        style={{ fontSize: 10, padding: "2px 6px" }}
                      >
                        Invert
                      </Button>
                    </div>

                    {[
                      {
                        label: "Gamma",
                        key: "gamma",
                        min: 0.2,
                        max: 3,
                        step: 0.05,
                      },
                      {
                        label: "CLAHE",
                        key: "clahe",
                        min: 0,
                        max: 1,
                        step: 0.05,
                      },
                      {
                        label: "Sharpness",
                        key: "sharp",
                        min: 0,
                        max: 10,
                        step: 0.5,
                      },
                    ].map(({ label, key, min, max, step }) => (
                      <div
                        key={key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginTop: 4,
                        }}
                      >
                        <span
                          style={{ fontSize: 10, color: "#aaa", minWidth: 55 }}
                        >
                          {label}
                        </span>
                        <Form.Range
                          min={min}
                          max={max}
                          step={step}
                          value={layer.adjust[key]}
                          onChange={(e) =>
                            updateAdjust(layer.id, {
                              [key]: parseFloat(e.target.value),
                            })
                          }
                          style={{ flex: 1 }}
                        />
                        <span
                          style={{ fontSize: 10, color: "#fff", width: 26 }}
                        >
                          {layer.adjust[key].toFixed(key === "sharp" ? 1 : 2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Angle helper ── */
function angleBetween(a, vertex, c) {
  const v1 = { x: a.x - vertex.x, y: a.y - vertex.y };
  const v2 = { x: c.x - vertex.x, y: c.y - vertex.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag = Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y);
  if (mag === 0) return 0;
  return (Math.acos(clamp(dot / mag, -1, 1)) * 180) / Math.PI;
}

/* ── Renders one annotation (or the live draft) as SVG. Sizing is based on
   canvasSize (image resolution) so it stays visible regardless of zoom
   or how high-res the source image is. ── */
const AnnotationShape = ({ a, selected, scale, ghost, canvasSize }) => {
  const stroke = ghost ? "#ffffff88" : selected ? "#ffd23f" : "#4fd1ff";

  // الحجم الأساسي مبني على دقة الصورة (canvasSize.width) مش على الزووم بس،
  // عشان يفضل واضح مهما كانت دقة الصورة عالية.
  const refWidth = canvasSize?.width || 800;
  const fontSize = clamp(refWidth / 22, 24, 64) / scale;
  const sw = clamp(refWidth / 180, selected ? 4 : 3, 10) / scale;
  const dotR = clamp(refWidth / 140, 5, 14) / scale;
  const strokeOutline = clamp(refWidth / 500, 1.5, 4) / scale;

  if (a.type === "length" || a.type === "arrow") {
    const [p1, p2] = a.points;
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    return (
      <g>
        <line
          x1={p1.x}
          y1={p1.y}
          x2={p2.x}
          y2={p2.y}
          stroke={stroke}
          strokeWidth={sw}
        />
        {a.type === "arrow" && (
          <ArrowHead
            p1={p1}
            p2={p2}
            stroke={stroke}
            scale={scale}
            canvasSize={canvasSize}
          />
        )}
        <circle cx={p1.x} cy={p1.y} r={dotR} fill={stroke} />
        <circle cx={p2.x} cy={p2.y} r={dotR} fill={stroke} />
        {a.label && (
          <text
            x={midX + 10 / scale}
            y={midY - 10 / scale}
            fontSize={fontSize}
            fontWeight="700"
            fill={stroke}
            style={{
              paintOrder: "stroke",
              stroke: "#000",
              strokeWidth: strokeOutline,
            }}
          >
            {a.label}
          </text>
        )}
      </g>
    );
  }

  if (a.type === "angle") {
    const [p1, vtx, p2] = a.points;
    if (!vtx) {
      return p1 ? <circle cx={p1.x} cy={p1.y} r={dotR} fill={stroke} /> : null;
    }
    return (
      <g>
        <line
          x1={vtx.x}
          y1={vtx.y}
          x2={p1.x}
          y2={p1.y}
          stroke={stroke}
          strokeWidth={sw}
        />
        {p2 && (
          <line
            x1={vtx.x}
            y1={vtx.y}
            x2={p2.x}
            y2={p2.y}
            stroke={stroke}
            strokeWidth={sw}
          />
        )}
        {[p1, vtx, p2].filter(Boolean).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={dotR} fill={stroke} />
        ))}
        {a.label && (
          <text
            x={vtx.x + 12 / scale}
            y={vtx.y - 12 / scale}
            fontSize={fontSize}
            fontWeight="700"
            fill={stroke}
            style={{
              paintOrder: "stroke",
              stroke: "#000",
              strokeWidth: strokeOutline,
            }}
          >
            {a.label}
          </text>
        )}
      </g>
    );
  }

  if (a.type === "roi") {
    const [p1, p2] = a.points;
    const cx = (p1.x + p2.x) / 2;
    const cy = (p1.y + p2.y) / 2;
    const rx = Math.abs(p2.x - p1.x) / 2;
    const ry = Math.abs(p2.y - p1.y) / 2;
    return (
      <g>
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={stroke}
          strokeWidth={sw}
        />
        {a.label && (
          <text
            x={cx - rx}
            y={cy - ry - 10 / scale}
            fontSize={fontSize}
            fontWeight="700"
            fill={stroke}
            style={{
              paintOrder: "stroke",
              stroke: "#000",
              strokeWidth: strokeOutline,
            }}
          >
            {a.label}
          </text>
        )}
      </g>
    );
  }

  return null;
};

const ArrowHead = ({ p1, p2, stroke, scale, canvasSize }) => {
  const refWidth = canvasSize?.width || 800;
  const size = clamp(refWidth / 45, 14, 36) / scale;
  const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  const x1 = p2.x - size * Math.cos(angle - Math.PI / 6);
  const y1 = p2.y - size * Math.sin(angle - Math.PI / 6);
  const x2 = p2.x - size * Math.cos(angle + Math.PI / 6);
  const y2 = p2.y - size * Math.sin(angle + Math.PI / 6);
  return (
    <polygon points={`${p2.x},${p2.y} ${x1},${y1} ${x2},${y2}`} fill={stroke} />
  );
};

export default LayerViewer;
