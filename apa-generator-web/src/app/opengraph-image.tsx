import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "APA Template Generator - Generador de documentos académicos";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </div>
        <h1
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          APA Template Generator
        </h1>
        <p
          style={{
            fontSize: "32px",
            color: "rgba(255, 255, 255, 0.9)",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Genera documentos académicos con formato APA 7ª edición
        </p>
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "32px",
          }}
        >
          <span
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              padding: "12px 24px",
              borderRadius: "9999px",
              color: "white",
              fontSize: "20px",
            }}
          >
            Portadas APA
          </span>
          <span
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              padding: "12px 24px",
              borderRadius: "9999px",
              color: "white",
              fontSize: "20px",
            }}
          >
            Bibliografía
          </span>
          <span
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              padding: "12px 24px",
              borderRadius: "9999px",
              color: "white",
              fontSize: "20px",
            }}
          >
            Ensayos
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
