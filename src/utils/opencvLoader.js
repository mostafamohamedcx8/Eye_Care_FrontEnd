// opencvLoader.js
//
// OpenCV.js ships as a WASM module. The <script> tag loads and *executes*
// synchronously, but the `cv` object is not actually usable until the WASM
// binary finishes downloading + compiling — that's what `onRuntimeInitialized`
// tells you. Resolving too early is the #1 cause of "cv.Mat is not a
// constructor" style errors.

let cvReadyPromise = null;

const OPENCV_SRC = "https://docs.opencv.org/4.9.0/opencv.js";

export function loadOpenCv() {
  if (cvReadyPromise) return cvReadyPromise;

  cvReadyPromise = new Promise((resolve, reject) => {
    // Already loaded and initialized (e.g. hot reload / second mount).
    if (window.cv && typeof window.cv.Mat === "function") {
      resolve(window.cv);
      return;
    }

    const attachRuntimeHook = () => {
      // `cv` exists as an object as soon as the script executes, but it's a
      // Promise-like/module object until the WASM finishes booting.
      if (window.cv && typeof window.cv.Mat === "function") {
        resolve(window.cv);
        return;
      }
      window.cv["onRuntimeInitialized"] = () => resolve(window.cv);
    };

    const existingScript = document.querySelector(
      `script[data-opencv-loader="true"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("load", attachRuntimeHook);
      existingScript.addEventListener("error", () =>
        reject(new Error("Failed to load OpenCV.js (existing script tag)")),
      );
      return;
    }

    const script = document.createElement("script");
    script.src = OPENCV_SRC;
    script.async = true;
    script.dataset.opencvLoader = "true";
    script.onload = attachRuntimeHook;
    script.onerror = () => reject(new Error("Failed to load OpenCV.js"));
    document.body.appendChild(script);
  });

  return cvReadyPromise;
}
