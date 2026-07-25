import React, { useMemo, useState } from "react";
import { Tabs, Tab, Button, ButtonGroup, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

// "1.6 (20/12)" -> 1.6   |   "0.13 (20/160)" -> 0.13   |  "" -> null
const parseVisus = (val) => {
  if (!val) return null;
  const match = String(val)
    .trim()
    .match(/^-?\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
};

const parseNumeric = (val) => {
  if (val === null || val === undefined || val === "") return null;
  const num = parseFloat(val);
  return Number.isNaN(num) ? null : num;
};

const EYE_COLORS = {
  right: "#2f6f8f",
  left: "#c1554d",
};

const EYE_OPTIONS = [
  { key: "right", labelKey: "visionTab.eyeRight", fallback: "Right Eye" },
  { key: "left", labelKey: "visionTab.eyeLeft", fallback: "Left Eye" },
  { key: "both", labelKey: "visionTab.eyeBoth", fallback: "Both Eyes" },
];

// "all" -> عرض التلات ميتركس (Visus / IOP / Images) تحت بعض في نفس الوقت
const METRIC_OPTIONS = [
  { key: "all", labelKey: "visionTab.metricAll", fallback: "All" },
  { key: "visus", labelKey: "visionTab.metricVisus", fallback: "Visus (CC)" },
  {
    key: "iop",
    labelKey: "visionTab.metricIop",
    fallback: "Intraocular Pressure",
  },
  { key: "images", labelKey: "visionTab.metricImages", fallback: "Images" },
];

// مفتاح "فاضي" لعين معينة (مستخدم للنقطة السينتاتيك بتاعة previousValue)
const emptyEyeMetrics = {
  visus: null,
  visusRaw: null,
  previousVisus: null,
  iop: null,
  images: [],
  alignedImages: [],
  hasImages: false,
};

// Builds one normalized data row per report for charting.
const buildReportPoint = (report) => {
  const dateLabel = new Date(report.createdAt).toLocaleDateString();
  const rightEx = report?.eyeExamination?.rightEye || {};
  const leftEx = report?.eyeExamination?.leftEye || {};

  return {
    id: report._id,
    dateLabel,
    timestamp: new Date(report.createdAt).getTime(),
    right: {
      visus: parseVisus(rightEx.visusCC),
      visusRaw: rightEx.visusCC || null,
      previousVisus: parseVisus(rightEx.previousValue),
      iop: parseNumeric(rightEx.intraocularPressure),
      images: rightEx.images || [],
      alignedImages: rightEx.alignedImages || [],
      hasImages: (rightEx.images || []).length > 0,
    },
    left: {
      visus: parseVisus(leftEx.visusCC),
      visusRaw: leftEx.visusCC || null,
      previousVisus: parseVisus(leftEx.previousValue),
      iop: parseNumeric(leftEx.intraocularPressure),
      images: leftEx.images || [],
      alignedImages: leftEx.alignedImages || [],
      hasImages: (leftEx.images || []).length > 0,
    },
  };
};

/**
 * بتبني نقطتين (سابق + حالي) للمقارنة في تاب تقرير واحد:
 * - لو فيه تقرير قبله في القائمة (sortedPoints[index - 1]) → نستخدمه كـ "سابق" فعليًا
 *   (يشمل Visus و IOP بتاعته الحقيقيين).
 * - لو ده أول تقرير (index === 0) → نحاول نستخدم previousValue (متاحة لـ Visus بس، IOP
 *   معندهاش previousValue في الموديل، فهتفضل null تلقائيًا).
 * - لو مفيش أي مقارنة ممكنة → نرجع نقطة واحدة بس.
 */
const buildComparisonPoints = (point, index, sortedPoints, t) => {
  if (index > 0) {
    const prev = sortedPoints[index - 1];
    return [prev, point];
  }

  const hasPreviousValue =
    point.right.previousVisus !== null || point.left.previousVisus !== null;

  if (!hasPreviousValue) return [point];

  const syntheticPrev = {
    id: `${point.id}-prev`,
    dateLabel: t("visionTab.previousValueLabel", "Previous"),
    timestamp: point.timestamp - 1,
    right: { ...emptyEyeMetrics, visus: point.right.previousVisus },
    left: { ...emptyEyeMetrics, visus: point.left.previousVisus },
  };

  return [syntheticPrev, point];
};

/* ------------------------------------------------------------------ */
/* Small filter pill groups                                           */
/* ------------------------------------------------------------------ */

const FilterGroup = ({ value, onChange, options, t }) => (
  <ButtonGroup size="sm">
    {options.map((opt) => (
      <Button
        key={opt.key}
        variant={value === opt.key ? "primary" : "outline-secondary"}
        onClick={() => onChange(opt.key)}
      >
        {t(opt.labelKey, opt.fallback)}
      </Button>
    ))}
  </ButtonGroup>
);

/* ------------------------------------------------------------------ */
/* Image preview strip - shown after clicking an image marker         */
/* بيفضل الصور المحاذاة (alignedImages) لو موجودة عند فتح الـ viewer، */
/* وبيبعت الصور كـ array (JSON) في اليو آر إل زي شاشة التقرير تمامًا   */
/* ------------------------------------------------------------------ */

const ImagePreviewStrip = ({
  images,
  alignedImages,
  eyeLabel,
  dateLabel,
  t,
  onClose,
}) => {
  if (!images || images.length === 0) return null;

  const imagesForViewer =
    alignedImages && alignedImages.length > 0 ? alignedImages : images;

  const openViewer = () => {
    window.open(
      `/view-dicom?images=${encodeURIComponent(
        JSON.stringify(imagesForViewer),
      )}&type=image`,
      "_blank",
    );
  };

  return (
    <div className="mt-3 p-3 border rounded" style={{ background: "#f8f9fb" }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <strong>
          {eyeLabel} — {dateLabel}
        </strong>
        <Button
          variant="link"
          size="sm"
          className="text-muted p-0"
          onClick={onClose}
        >
          {t("visionTab.close", "Close")}
        </Button>
      </div>
      <div className="d-flex flex-wrap gap-2">
        {images.map((img, idx) => (
          <img
            key={img?._id || idx}
            src={img?.url}
            crossOrigin="anonymous"
            loading="lazy"
            alt={`${eyeLabel} ${idx + 1}`}
            style={{
              width: "90px",
              height: "90px",
              objectFit: "cover",
              borderRadius: "8px",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
            onClick={openViewer}
          />
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Custom dot for line charts (Visus / IOP)                           */
/* ------------------------------------------------------------------ */

const MetricDot = (props) => {
  const { cx, cy, stroke, value } = props;
  if (
    cx === undefined ||
    cy === undefined ||
    value === null ||
    value === undefined
  ) {
    return null;
  }
  return (
    <circle cx={cx} cy={cy} r={4} fill="#fff" stroke={stroke} strokeWidth={2} />
  );
};

/* ------------------------------------------------------------------ */
/* Custom dot for the Images chart - clickable                       */
/* ------------------------------------------------------------------ */

const ImageMarker = (props) => {
  const { cx, cy, fill, onClick } = props;
  if (cx === undefined || cy === undefined) return null;
  return (
    <g style={{ cursor: "pointer" }} onClick={onClick}>
      <circle
        cx={cx}
        cy={cy}
        r={9}
        fill={fill}
        fillOpacity={0.18}
        stroke={fill}
        strokeWidth={1.5}
      />
      <circle cx={cx} cy={cy} r={3.5} fill={fill} />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Main chart: renders exactly one metric (visus | iop | images)      */
/* ------------------------------------------------------------------ */

const MetricChart = ({ data, eyeFilter, metric, t }) => {
  const [selectedImagePoint, setSelectedImagePoint] = useState(null);
  // { dateLabel, eyeKey, images, alignedImages } | null

  const showRight = eyeFilter === "right" || eyeFilter === "both";
  const showLeft = eyeFilter === "left" || eyeFilter === "both";

  const eyeLabel = (key) =>
    key === "right"
      ? t("visionTab.eyeRight", "Right Eye")
      : t("visionTab.eyeLeft", "Left Eye");

  /* ---------------- Visus or IOP: straight-line area chart ---------------- */
  if (metric === "visus" || metric === "iop") {
    const dataKeyRight = metric === "visus" ? "right.visus" : "right.iop";
    const dataKeyLeft = metric === "visus" ? "left.visus" : "left.iop";
    const axisLabel =
      metric === "visus"
        ? t("visionTab.metricVisus", "Visus (CC)")
        : t("visionTab.metricIop", "Intraocular Pressure");

    // id فريد لكل نقطة حتى لو كذا تقرير وقعوا في نفس التاريخ، فبنستخدمه كمحور X
    // (تباعد متساوي بين النقط بدل التباعد بالوقت الفعلي)، وبنـ"ترجمه" لتاريخ
    // مقروء في الـ ticks والتولتيب من خلال اللوك أب ده.
    const idToLabel = Object.fromEntries(data.map((d) => [d.id, d.dateLabel]));

    // بيرجع القيمة الصحيحة الخاصة بالنقطة اللي بيتعمل عليها hover:
    // Visus -> النص الأصلي زي ما هو (0.2 (20/100)) مش الرقم المُبسّط اللي بيتحسب بيه الرسم.
    // IOP   -> الرقم زي ما هو مع وحدة mmHg.
    const tooltipFormatter = (value, name, props) => {
      const isRight = props?.dataKey?.startsWith("right");
      const eyeData = isRight ? props?.payload?.right : props?.payload?.left;
      const noValue = t("visionTab.noValue", "—");

      if (metric === "visus") {
        return [eyeData?.visusRaw || noValue, name];
      }
      const iopVal = eyeData?.iop;
      return [
        iopVal !== null && iopVal !== undefined ? `${iopVal} mmHg` : noValue,
        name,
      ];
    };

    return (
      <ResponsiveContainer width="100%" height={340}>
        <AreaChart
          data={data}
          margin={{ top: 16, right: 24, left: 4, bottom: 4 }}
        >
          <defs>
            <linearGradient id="fillRight" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={EYE_COLORS.right}
                stopOpacity={0.25}
              />
              <stop
                offset="95%"
                stopColor={EYE_COLORS.right}
                stopOpacity={0.02}
              />
            </linearGradient>
            <linearGradient id="fillLeft" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={EYE_COLORS.left}
                stopOpacity={0.25}
              />
              <stop
                offset="95%"
                stopColor={EYE_COLORS.left}
                stopOpacity={0.02}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 6"
            vertical={false}
            stroke="#e3e6ea"
          />
          <XAxis
            dataKey="id"
            tickFormatter={(id) => idToLabel[id] || ""}
            tick={{ fontSize: 12, fill: "#5b6470" }}
            axisLine={{ stroke: "#d7dbe0" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#5b6470" }}
            axisLine={false}
            tickLine={false}
            width={48}
            label={{
              value: axisLabel,
              angle: -90,
              position: "insideLeft",
              fontSize: 12,
              fill: "#5b6470",
              style: { textAnchor: "middle" },
            }}
          />
          <Tooltip
            formatter={tooltipFormatter}
            labelFormatter={(id) =>
              `${t("visionTab.date", "Date")}: ${idToLabel[id] || ""}`
            }
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e3e6ea",
              fontSize: 13,
            }}
          />

          {showRight && (
            <Area
              type="linear"
              dataKey={dataKeyRight}
              name={`${eyeLabel("right")}`}
              stroke={EYE_COLORS.right}
              strokeWidth={2.5}
              fill="url(#fillRight)"
              connectNulls={false}
              dot={<MetricDot />}
              activeDot={{ r: 6 }}
            />
          )}
          {showLeft && (
            <Area
              type="linear"
              dataKey={dataKeyLeft}
              name={`${eyeLabel("left")}`}
              stroke={EYE_COLORS.left}
              strokeWidth={2.5}
              fill="url(#fillLeft)"
              connectNulls={false}
              dot={<MetricDot />}
              activeDot={{ r: 6 }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  /* ---------------- Images: clickable markers on a plain timeline ---------------- */
  // y-position is irrelevant data-wise; right eye sits on row 1, left eye on row 0,
  // purely to keep the two eyes visually separated on the same timeline.
  const imageRows = [];
  data.forEach((point) => {
    if (showRight && point.right.hasImages) {
      imageRows.push({
        dateLabel: point.dateLabel,
        timestamp: point.timestamp,
        row: 1,
        eyeKey: "right",
        images: point.right.images,
        alignedImages: point.right.alignedImages,
      });
    }
    if (showLeft && point.left.hasImages) {
      imageRows.push({
        dateLabel: point.dateLabel,
        timestamp: point.timestamp,
        row: 0,
        eyeKey: "left",
        images: point.left.images,
        alignedImages: point.left.alignedImages,
      });
    }
  });

  if (imageRows.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        {t(
          "visionTab.noImages",
          "No images found for the selected eye filter.",
        )}
      </div>
    );
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={260}>
        <ScatterChart margin={{ top: 30, right: 24, left: 4, bottom: 4 }}>
          <CartesianGrid
            strokeDasharray="3 6"
            vertical={false}
            stroke="#e3e6ea"
          />
          <XAxis
            dataKey="timestamp"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(ts) => new Date(ts).toLocaleDateString()}
            tick={{ fontSize: 12, fill: "#5b6470" }}
            axisLine={{ stroke: "#d7dbe0" }}
            tickLine={false}
          />
          <YAxis
            dataKey="row"
            type="number"
            domain={[-0.5, 1.5]}
            ticks={[0, 1]}
            tickFormatter={(v) =>
              v === 1
                ? t("visionTab.eyeRight", "Right")
                : t("visionTab.eyeLeft", "Left")
            }
            tick={{ fontSize: 12, fill: "#5b6470" }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value, name, props) => [
              `${props.payload.images.length} ${t("visionTab.imagesCount", "image(s)")}`,
              eyeLabel(props.payload.eyeKey),
            ]}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e3e6ea",
              fontSize: 13,
            }}
          />
          <Scatter
            data={imageRows}
            shape={(props) => (
              <ImageMarker
                {...props}
                fill={
                  props.payload.eyeKey === "right"
                    ? EYE_COLORS.right
                    : EYE_COLORS.left
                }
                onClick={() =>
                  setSelectedImagePoint({
                    dateLabel: props.payload.dateLabel,
                    eyeKey: props.payload.eyeKey,
                    images: props.payload.images,
                    alignedImages: props.payload.alignedImages,
                  })
                }
              />
            )}
          />
        </ScatterChart>
      </ResponsiveContainer>
      <div className="text-muted small mt-1">
        {t(
          "visionTab.imageHint",
          "Click a marker to view the images captured for that report.",
        )}
      </div>

      {selectedImagePoint && (
        <ImagePreviewStrip
          images={selectedImagePoint.images}
          alignedImages={selectedImagePoint.alignedImages}
          eyeLabel={eyeLabel(selectedImagePoint.eyeKey)}
          dateLabel={selectedImagePoint.dateLabel}
          t={t}
          onClose={() => setSelectedImagePoint(null)}
        />
      )}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Shared filter bar + chart, reused by Summary and each report tab   */
/*                                                                     */
/* chartData  -> يتستخدم لمقياسي Visus/IOP (مقارنة سابق/حالي في تاب   */
/*               تقرير واحد، أو كل التقارير في تاب Summary)            */
/* imagesData -> يتستخدم لمقياس Images بس (صور التقرير ده بس دايمًا،  */
/*               مش صور التقرير اللي قبله)                            */
/* ------------------------------------------------------------------ */

const METRIC_TITLES = {
  visus: { labelKey: "visionTab.metricVisus", fallback: "Visus (CC)" },
  iop: {
    labelKey: "visionTab.metricIop",
    fallback: "Intraocular Pressure",
  },
  images: { labelKey: "visionTab.metricImages", fallback: "Images" },
};

const ChartPanel = ({ chartData, imagesData, t, reportLink }) => {
  const [metric, setMetric] = useState("all");
  const [eyeFilter, setEyeFilter] = useState("both");
  const navigate = useNavigate();

  const noComparisonAvailable = chartData.length < 2;

  const renderBlock = (m) => (
    <div className="mb-4" key={m}>
      <div
        className="fw-semibold text-muted mb-2"
        style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 0.4 }}
      >
        {t(METRIC_TITLES[m].labelKey, METRIC_TITLES[m].fallback)}
      </div>
      <MetricChart
        data={m === "images" ? imagesData : chartData}
        eyeFilter={eyeFilter}
        metric={m}
        t={t}
      />
    </div>
  );

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <FilterGroup
          value={metric}
          onChange={setMetric}
          options={METRIC_OPTIONS}
          t={t}
        />
        <FilterGroup
          value={eyeFilter}
          onChange={setEyeFilter}
          options={EYE_OPTIONS}
          t={t}
        />
      </div>

      {metric !== "images" && noComparisonAvailable && (
        <div className="text-muted small mb-2">
          {t(
            "visionTab.noPreviousData",
            "No previous visit data available to compare against.",
          )}
        </div>
      )}

      {metric === "all" ? (
        <>
          {renderBlock("visus")}
          {renderBlock("iop")}
          {renderBlock("images")}
        </>
      ) : (
        <MetricChart
          data={metric === "images" ? imagesData : chartData}
          eyeFilter={eyeFilter}
          metric={metric}
          t={t}
        />
      )}

      {reportLink && (
        <div className="d-flex justify-content-end mt-3">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => navigate(reportLink)}
          >
            {t("visionTab.viewFullReport", "View full report")}
            <i className="bi bi-arrow-right ms-2"></i>
          </Button>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Main VisionTab - Summary + one sub-tab per report                  */
/* ------------------------------------------------------------------ */

const VisionTab = ({ reports, patientId }) => {
  const { t } = useTranslation();
  const [activeSubTab, setActiveSubTab] = useState("summary");

  const points = useMemo(() => {
    return (reports || [])
      .map(buildReportPoint)
      .sort((a, b) => a.timestamp - b.timestamp); // oldest -> newest
  }, [reports]);

  if (points.length === 0) {
    return (
      <p className="text-center text-muted my-5">
        {t("visionTab.noData", "No reports available to chart yet.")}
      </p>
    );
  }

  // Newest-first ordering for the report sub-tabs, so the most recent visit is closest to Summary.
  const reportsNewestFirst = [...points].reverse();

  return (
    <Tabs
      activeKey={activeSubTab}
      onSelect={(key) => setActiveSubTab(key)}
      className="mb-3"
    >
      <Tab eventKey="summary" title={t("visionTab.summary", "Summary")}>
        <div className="mt-3">
          {/* في الـ Summary: Visus/IOP بتعرض كل التقارير على الـ timeline زي ما هي،
              والصور كذلك بتعرض كل التقارير. مفيش مقارنة سابق/حالي هنا، الهدف
              إظهار الاتجاه العام عبر الوقت. */}
          <ChartPanel chartData={points} imagesData={points} t={t} />
        </div>
      </Tab>

      {reportsNewestFirst.map((point) => {
        // لازم نلاقي index بتاع النقطة دي في القايمة المرتبة من الأقدم للأحدث
        // عشان نعرف التقرير اللي قبلها فعليًا (مش بترتيب reportsNewestFirst المعكوس)
        const indexInChronological = points.findIndex((p) => p.id === point.id);
        const comparisonData = buildComparisonPoints(
          point,
          indexInChronological,
          points,
          t,
        );

        return (
          <Tab
            key={point.id}
            eventKey={point.id}
            title={
              <span>
                {point.dateLabel}
                {point === reportsNewestFirst[0] && (
                  <Badge bg="success" className="ms-2">
                    {t("visionTab.latest", "Latest")}
                  </Badge>
                )}
              </span>
            }
          >
            <div className="mt-3">
              <ChartPanel
                chartData={comparisonData}
                imagesData={[point]}
                t={t}
                reportLink={
                  patientId
                    ? `/ExaminationReport/${patientId}/${point.id}`
                    : null
                }
              />
            </div>
          </Tab>
        );
      })}
    </Tabs>
  );
};

export default VisionTab;
