import React, { useEffect, useRef } from "react";

interface TemplatePreviewProps {
  children: React.ReactNode;
  templateId: string;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  children,
  templateId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Override min-h-screen styles in preview
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll("*");
      elements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const classes = htmlEl.className?.toString() || "";
        // Override min-h-screen (which is 100vh in Tailwind)
        if (
          classes.includes("min-h-screen") ||
          htmlEl.style.minHeight === "100vh"
        ) {
          htmlEl.style.minHeight = "0";
          htmlEl.style.height = "auto";
        }
      });
    }
  }, [children]);

  return (
    <div
      ref={containerRef}
      className="relative rounded-lg overflow-hidden h-full border-0 bg-transparent"
    >
      <style>{`
        .preview-container-${templateId} {
          background: transparent !important;
        }
        .preview-container-${templateId} [class*="min-h-screen"] {
          min-height: 0 !important;
          height: auto !important;
        }
        .preview-container-${templateId} * {
          box-sizing: border-box !important;
        }
        .preview-container-${templateId} [class*="flex"],
        .preview-container-${templateId} [class*="grid"] {
          min-width: 0 !important;
          max-width: 100% !important;
        }
        .preview-container-${templateId} [class*="flex"] > *,
        .preview-container-${templateId} [class*="grid"] > * {
          min-width: 0 !important;
          max-width: 100% !important;
        }
        .preview-container-${templateId} div,
        .preview-container-${templateId} span,
        .preview-container-${templateId} p {
          overflow-wrap: anywhere !important;
          word-break: break-word !important;
          max-width: 100% !important;
        }
        .preview-container-${templateId} .preview-scaled {
          width: 133.33% !important;
          transform: scale(0.75) !important;
          transform-origin: top center !important;
        }
        .preview-container-${templateId} .preview-scaled > * {
          max-width: 100% !important;
        }
        .preview-container-${templateId} img {
          max-width: 100% !important;
          height: auto !important;
        }
        .preview-container-${templateId}::-webkit-scrollbar {
          width: 6px;
        }
        .preview-container-${templateId}::-webkit-scrollbar-track {
          background: #1F2937;
        }
        .preview-container-${templateId}::-webkit-scrollbar-thumb {
          background: #4B5563;
          border-radius: 3px;
        }
        .preview-container-${templateId}::-webkit-scrollbar-thumb:hover {
          background: #6B7280;
        }
      `}</style>
      <div
        className={`preview-container-${templateId} h-full overflow-y-auto overflow-x-hidden`}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#4B5563 #1F2937",
        }}
      >
        <div
          className="p-4"
          style={{ width: "100%", overflow: "hidden", minHeight: "100%" }}
        >
          <div
            className="preview-scaled"
            style={{
              paddingBottom: "80px",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;
