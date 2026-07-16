// imageAlignment.js
//
// Multi-modal fundus image alignment (COLOR / IR / RF_R / RF_G / RF_B).
//
// Why feature-based (ORB) instead of intensity-based (ECC)?
// These images come from different sensors/wavelengths captured at the
// same moment, so a vessel that's bright in COLOR can be dark in IR and
// mid-gray in an RF channel. ECC assumes brightness is roughly consistent
// across the two images being aligned — that assumption breaks across
// modalities. ORB instead matches *local structure* (vessel branches, disc
// edges, texture corners), which is far more stable across modalities.
//
// Nothing here modifies pixel values — alignment only warps geometry
// (rotation / translation / scale / perspective) via a homography, so the
// original tonal "feature" of each layer (gamma/CLAHE/sharpen you already
// apply downstream) is fully preserved.

/**
 * Load an <img> element from a URL, resolving once it's fully decoded.
 * `crossOrigin` must be set *before* `src` so the resulting canvas isn't
 * tainted (required for cv.imread / canvas.toDataURL to work).
 */
export function loadImageElement(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error(`Failed to load image for alignment: ${url}`));
    img.src = url;
  });
}

/** Convert a loaded <img> element into an OpenCV Mat (RGBA). */
export function imageElementToMat(cv, imgEl) {
  const canvas = document.createElement("canvas");
  canvas.width = imgEl.naturalWidth;
  canvas.height = imgEl.naturalHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(imgEl, 0, 0);
  return cv.imread(canvas);
}

/** Render a Mat onto a (new or given) canvas element and return it. */
export function matToCanvas(
  cv,
  mat,
  canvas = document.createElement("canvas"),
) {
  cv.imshow(canvas, mat);
  return canvas;
}

function detectFeatures(cv, grayMat, nFeatures = 2500) {
  const orb = new cv.ORB(nFeatures);
  const keypoints = new cv.KeyPointVector();
  const descriptors = new cv.Mat();
  orb.detectAndCompute(grayMat, new cv.Mat(), keypoints, descriptors);
  orb.delete();
  return { keypoints, descriptors };
}

/**
 * Align `movingMat` onto `refMat`'s coordinate space.
 *
 * Returns:
 *   alignedMat  - same width/height as refMat, ready to stack as a layer
 *   homography  - the 3x3 cv.Mat used (caller must .delete() it), or null
 *   matchCount  - number of inlier-quality matches found (quality signal)
 *   success     - whether a homography could be estimated & applied
 */
export function alignToReference(cv, refMat, movingMat, options = {}) {
  const { minGoodMatches = 12, ratioTestThreshold = 0.75 } = options;

  const refGray = new cv.Mat();
  const movGray = new cv.Mat();
  cv.cvtColor(refMat, refGray, cv.COLOR_RGBA2GRAY);
  cv.cvtColor(movingMat, movGray, cv.COLOR_RGBA2GRAY);

  // Local contrast boost purely to help ORB find stable keypoints on flat
  // RF/IR channels. This is only used for detection — the returned
  // `alignedMat` is warped from the original, unmodified `movingMat`.
  const refEq = new cv.Mat();
  const movEq = new cv.Mat();
  cv.equalizeHist(refGray, refEq);
  cv.equalizeHist(movGray, movEq);

  const { keypoints: kpRef, descriptors: descRef } = detectFeatures(cv, refEq);
  const { keypoints: kpMov, descriptors: descMov } = detectFeatures(cv, movEq);

  let alignedMat = movingMat.clone();
  let homography = null;
  let matchCount = 0;
  let success = false;

  if (descRef.rows > 0 && descMov.rows > 0) {
    const bf = new cv.BFMatcher(cv.NORM_HAMMING, false);
    const knnMatches = new cv.DMatchVectorVector();
    bf.knnMatch(descMov, descRef, knnMatches, 2);

    const srcPts = [];
    const dstPts = [];

    for (let i = 0; i < knnMatches.size(); i++) {
      const pair = knnMatches.get(i);
      if (pair.size() < 2) continue;
      const m = pair.get(0);
      const n = pair.get(1);
      // Lowe's ratio test — keeps only distinctive, unambiguous matches.
      if (m.distance < ratioTestThreshold * n.distance) {
        const p1 = kpMov.get(m.queryIdx).pt;
        const p2 = kpRef.get(m.trainIdx).pt;
        srcPts.push(p1.x, p1.y);
        dstPts.push(p2.x, p2.y);
      }
    }

    matchCount = srcPts.length / 2;

    if (matchCount >= minGoodMatches) {
      const srcMat = cv.matFromArray(matchCount, 1, cv.CV_32FC2, srcPts);
      const dstMat = cv.matFromArray(matchCount, 1, cv.CV_32FC2, dstPts);
      const mask = new cv.Mat();

      // RANSAC rejects outlier matches automatically while solving for
      // the homography — important since some matches will be wrong.
      homography = cv.findHomography(srcMat, dstMat, cv.RANSAC, 5, mask);

      if (homography && !homography.empty()) {
        cv.warpPerspective(
          movingMat,
          alignedMat,
          homography,
          new cv.Size(refMat.cols, refMat.rows),
          cv.INTER_LINEAR,
          cv.BORDER_CONSTANT,
          new cv.Scalar(0, 0, 0, 0),
        );
        success = true;
      }

      srcMat.delete();
      dstMat.delete();
      mask.delete();
    }

    bf.delete();
    knnMatches.delete();
  }

  refGray.delete();
  movGray.delete();
  refEq.delete();
  movEq.delete();
  descRef.delete();
  descMov.delete();
  kpRef.delete();
  kpMov.delete();

  return { alignedMat, homography, matchCount, success };
}

/**
 * Parse the modality label out of your filename convention, e.g.
 * "Copy of 2026_07_03_17_06_30.423_RF_G.jpg" -> "RF_G".
 * Falls back to a generic index-based label if nothing matches.
 */
export function guessModality(url, idx) {
  try {
    const name = decodeURIComponent(url.split("/").pop() || "");
    const match = name.match(/_(COLOR|IR_R|IR_L|RF_R|RF_G|RF_B)\b/i);
    if (match) return match[1].toUpperCase();
  } catch {
    // fall through to default label below
  }
  return `Layer ${idx + 1}`;
}

/**
 * Pick a sensible default reference layer: prefer COLOR (highest contrast,
 * most features for ORB), otherwise fall back to the first image.
 */
export function pickDefaultReferenceIndex(urls) {
  const idx = urls.findIndex((u) => /_COLOR\b/i.test(u));
  return idx >= 0 ? idx : 0;
}
