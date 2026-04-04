import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, ButtonGroup, Form } from "react-bootstrap"; // ضفنا Form عشان الـ Gamma

import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import cornerstoneTools from "cornerstone-tools";
import dicomParser from "dicom-parser";
import Hammer from "hammerjs";
import cornerstoneMath from "cornerstone-math";

/* ================== SETUP GLOBAL ================== */
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

cornerstoneTools.init();

const DicomViewerPage = () => {
  const [searchParams] = useSearchParams();
  const dicomUrl = searchParams.get("dicomUrl");

  const elementRef = useRef(null);
  const [activeTool, setActiveTool] = useState("Wwwc");
  const [gammaValue, setGammaValue] = useState(1.0); // حالة الـ Gamma

  useEffect(() => {
    if (!dicomUrl || !elementRef.current) return;

    const element = elementRef.current;
    cornerstone.enable(element);

    // 1. تعريف الأدوات المطلوبة
    const WwwcTool = cornerstoneTools.WwwcTool; // بتتحكم في Contrast و Brightness
    const ArrowAnnotateTool = cornerstoneTools.ArrowAnnotateTool; // للـ Annotation
    const PanTool = cornerstoneTools.PanTool;
    const ZoomTool = cornerstoneTools.ZoomTool;

    // 2. إضافة الأدوات
    cornerstoneTools.addToolForElement(element, WwwcTool);
    cornerstoneTools.addToolForElement(element, ArrowAnnotateTool);
    cornerstoneTools.addToolForElement(element, PanTool);
    cornerstoneTools.addToolForElement(element, ZoomTool);

    const imageId = `wadouri:${dicomUrl}`;

    cornerstone.loadImage(imageId).then((image) => {
      cornerstone.displayImage(element, image);

      // تفعيل الـ Wwwc كأداة افتراضية
      cornerstoneTools.setToolActiveForElement(element, "Wwwc", {
        mouseButtonMask: 1,
      });
    });

    return () => {
      cornerstone.disable(element);
    };
  }, [dicomUrl]);

  /* ================= CONTROLS ================= */

  const changeTool = (toolName) => {
    const element = elementRef.current;
    if (!element) return;

    // تعطيل كل الأدوات على الزر الأيسر أولاً
    ["Wwwc", "ArrowAnnotate", "Pan", "Zoom"].forEach((t) => {
      cornerstoneTools.setToolPassiveForElement(element, t);
    });

    // تفعيل الأداة المختارة
    cornerstoneTools.setToolActiveForElement(element, toolName, {
      mouseButtonMask: 1,
    });
    setActiveTool(toolName);
  };

  // التحكم في الـ Gamma
  const handleGammaChange = (e) => {
    const value = parseFloat(e.target.value);
    setGammaValue(value);
    const element = elementRef.current;
    const viewport = cornerstone.getViewport(element);
    viewport.gamma = value; // تحديث الـ Gamma في الـ Viewport
    cornerstone.setViewport(element, viewport);
  };

  const reset = () => {
    setGammaValue(1.0);
    cornerstone.reset(elementRef.current);
  };

  return (
    <div
      style={{
        background: "#000",
        color: "#fff",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "10px",
          borderBottom: "1px solid #444",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "15px",
        }}
      >
        {/* الأدوات الأساسية */}
        <ButtonGroup>
          <Button
            variant={activeTool === "Wwwc" ? "primary" : "outline-light"}
            onClick={() => changeTool("Wwwc")}
          >
            Brightness & Contrast
          </Button>
          <Button
            variant={
              activeTool === "ArrowAnnotate" ? "primary" : "outline-light"
            }
            onClick={() => changeTool("ArrowAnnotate")}
          >
            Annotation
          </Button>
          <Button
            variant={activeTool === "Pan" ? "primary" : "outline-light"}
            onClick={() => changeTool("Pan")}
          >
            Pan
          </Button>
        </ButtonGroup>

        {/* التحكم في الـ Gamma (Slider) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "200px",
          }}
        >
          <span>Gamma:</span>
          <Form.Range
            min="0.1"
            max="3.0"
            step="0.1"
            value={gammaValue}
            onChange={handleGammaChange}
          />
          <span style={{ minWidth: "30px" }}>{gammaValue}</span>
        </div>

        <Button variant="danger" onClick={reset}>
          Reset
        </Button>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          ref={elementRef}
          onContextMenu={(e) => e.preventDefault()}
          style={{
            width: "80vw",
            height: "80vh",
            background: "black",
            outline: "1px solid #333",
          }}
        />
      </div>
    </div>
  );
};

export default DicomViewerPage;
