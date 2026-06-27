import React, { useEffect, useRef, useState } from "react";
import cornerstone from "cornerstone-core";

/**
 * DicomThumbnail
 * بيعرض معاينة حقيقية (thumbnail) لملف DICOM عن طريق تحميله بـ cornerstone
 * ورسمه على عنصر صغير، بدل أيقونة ثابتة.
 *
 * Props:
 *  - dicomUrl: رابط ملف الـ DICOM
 *  - size: حجم الثيم (افتراضي 48)
 *  - onClick: دالة تنفذ عند الضغط (مثلاً فتح الـ viewer)
 *  - title: tooltip
 */
const DicomThumbnail = ({ dicomUrl, size = 56, onClick, title }) => {
  const elementRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    if (!dicomUrl || !elementRef.current) return;
    const element = elementRef.current;

    cornerstone.enable(element);
    setStatus("loading");

    const imageId = `wadouri:${dicomUrl}`;
    cornerstone
      .loadImage(imageId)
      .then((image) => {
        cornerstone.displayImage(element, image);
        // نخلي الصورة تتمركز وتتلائم مع حجم الثيم الصغير
        cornerstone.fitToWindow(element);
        setStatus("ready");
      })
      .catch((err) => {
        console.error("Failed to load DICOM thumbnail:", err);
        setStatus("error");
      });

    return () => {
      try {
        cornerstone.disable(element);
      } catch (e) {
        // عنصر ممكن يكون already disabled
      }
    };
  }, [dicomUrl]);

  return (
    <div
      onClick={onClick}
      title={title}
      style={{
        width: size,
        height: size,
        position: "relative",
        cursor: "pointer",
        borderRadius: 8,
        border: "1px solid #0d6efd",
        overflow: "hidden",
        backgroundColor: "#000",
        flexShrink: 0,
      }}
    >
      {/* عنصر cornerstone اللي بيرسم عليه الـ DICOM */}
      <div
        ref={elementRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      {/* Loading indicator */}
      {status === "loading" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#eaf2ff",
            fontSize: 10,
            color: "#0d6efd",
          }}
        >
          ...
        </div>
      )}

      {/* Error fallback */}
      {status === "error" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#eaf2ff",
            fontSize: 9,
            color: "#dc3545",
            textAlign: "center",
            padding: 2,
          }}
        >
          DICOM
        </div>
      )}

      {/* علامة صغيرة في الزاوية تأكد إنه ملف DICOM */}
      <span
        style={{
          position: "absolute",
          bottom: 2,
          right: 2,
          fontSize: 8,
          fontWeight: "bold",
          color: "#fff",
          background: "rgba(13,110,253,0.85)",
          padding: "1px 4px",
          borderRadius: 3,
          lineHeight: 1.2,
        }}
      >
        DCM
      </span>
    </div>
  );
};

export default DicomThumbnail;
