import { useState } from "react";

const API = "https://truthlens-ai-backend-ry8y.onrender.com";

function Image() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];

    if (!selected) return;

    setFile(selected);
    setResult(null);
    setError("");

    const url = URL.createObjectURL(selected);
    setPreview(url);
  };

  const verifyImage = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://truthlens-ai-backend-ry8y.onrender.com/verify-image",
  {
    method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(
          `Backend returned HTTP ${response.status}`
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (err) {
      console.error("Image verification error:", err);

      setError(
        "Unable to connect to the TruthLens backend. " +
        "Please check that the TruthLens cloud backend is available."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreview("");
    setResult(null);
    setError("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>TRUTHLENS AI</div>

          <h1 style={styles.title}>Image Forensics</h1>

          <p style={styles.subtitle}>
            Examine images for metadata anomalies, pixel
            distribution and manipulation indicators.
          </p>
        </div>

        <div style={styles.badge}>
          ● FORENSIC ANALYSIS
        </div>
      </div>

      <div style={styles.grid}>
        {/* PREVIEW */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Image Preview</h2>

          <p style={styles.subtitleSmall}>
            Review the uploaded image before analysis.
          </p>

          {!preview ? (
            <label style={styles.upload}>
              <div style={{ fontSize: 55 }}>🖼️</div>

              <h3>Upload an image</h3>

              <p>Click to browse your computer</p>

              <span>JPG · JPEG · PNG · WEBP</span>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
          ) : (
            <div style={styles.previewBox}>
              <img
                src={preview}
                alt="Uploaded"
                style={styles.preview}
              />
            </div>
          )}
        </div>

        {/* FILE INFORMATION */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>File Information</h2>

          <p style={styles.subtitleSmall}>
            Technical information about the uploaded file.
          </p>

          {!file ? (
            <div style={styles.empty}>
              <div style={{ fontSize: 45 }}>📁</div>
              <p>Select an image to begin.</p>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 40 }}>🖼️</div>

              <h3 style={{ wordBreak: "break-word" }}>
                {file.name}
              </h3>

              <Info
                label="File type"
                value={file.type || "Unknown"}
              />

              <Info
                label="File size"
                value={`${(file.size / 1024).toFixed(1)} KB`}
              />

              <Info
                label="Connection"
                value="TruthLens Cloud Backend"
              />

              <button
                onClick={verifyImage}
                disabled={loading}
                style={styles.button}
              >
                {loading
                  ? "Analyzing..."
                  : "Analyze Image"}
              </button>

              <button
                onClick={removeImage}
                style={styles.remove}
              >
                Remove Image
              </button>
            </>
          )}
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div style={styles.error}>
          <strong>Connection Error</strong>

          <p style={{ marginBottom: 0 }}>
            {error}
          </p>

          <p style={{ marginBottom: 0 }}>
            Backend:{" "}
            <code>https://truthlens-ai-backend-ry8y.onrender.com</code>
          </p>
        </div>
      )}

      {/* SCANNING */}
      {loading && (
        <div style={styles.scanning}>
          <div style={styles.spinner}></div>

          <div>
            <strong>Running forensic analysis</strong>

            <p style={{ margin: "5px 0 0" }}>
              Inspecting metadata, pixel distribution
              and image structure...
            </p>
          </div>
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div style={styles.result}>
          <div style={styles.resultTop}>
            <div>
              <div style={styles.eyebrow}>
                FORENSIC REPORT
              </div>

              <h2>Analysis Complete</h2>
            </div>

            <div style={styles.risk}>
              {result.risk_level} RISK
            </div>
          </div>

          <div style={styles.scoreRow}>
            <div style={styles.score}>
              <strong>
                {result.authenticity_score}%
              </strong>

              <span>Authenticity</span>
            </div>

            <div>
              <h2>{result.status}</h2>

              <p style={styles.subtitleSmall}>
                Score calculated from available forensic
                indicators.
              </p>
            </div>
          </div>

          <h3>Forensic Indicators</h3>

          <div style={styles.findings}>
            {result.findings?.map((item, index) => (
              <div style={styles.finding} key={index}>
                <div style={styles.findingIcon}>
                  {item.severity === "good"
                    ? "✓"
                    : "!"}
                </div>

                <div>
                  <strong>{item.name}</strong>

                  <p style={{ margin: "5px 0 0" }}>
                    {item.status}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.technical}>
            <h3>Technical Details</h3>

            <Info
              label="Dimensions"
              value={`${result.width} × ${result.height}`}
            />

            <Info
              label="Format"
              value={result.format}
            />

            <Info
              label="Color Mode"
              value={result.color_mode}
            />

            <Info
              label="Pixel Entropy"
              value={result.entropy}
            />

            <Info
              label="Metadata Fields"
              value={result.metadata_count}
            />

            <Info
              label="File Fingerprint"
              value={result.file_hash}
            />
          </div>

          <div style={styles.note}>
            <strong>Important:</strong>{" "}
            This is a forensic risk assessment.
            It is not a guaranteed AI-generated-image
            detector.
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div style={styles.info}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f8fc",
    padding: "45px 7%",
    color: "#172033",
    fontFamily: "Inter, Arial, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 35,
  },

  eyebrow: {
    color: "#2563eb",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 2,
  },

  title: {
    fontSize: 42,
    margin: "8px 0",
  },

  subtitle: {
    color: "#64748b",
    lineHeight: 1.6,
  },

  subtitleSmall: {
    color: "#64748b",
    fontSize: 14,
    lineHeight: 1.5,
  },

  badge: {
    background: "#eff6ff",
    color: "#2563eb",
    padding: "10px 15px",
    borderRadius: 20,
    height: "fit-content",
    fontWeight: 700,
    fontSize: 12,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 25,
  },

  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 20,
    padding: 28,
    boxShadow: "0 10px 30px rgba(15,23,42,.05)",
  },

  cardTitle: {
    margin: 0,
  },

  upload: {
    height: 390,
    border: "2px dashed #cbd5e1",
    borderRadius: 16,
    background: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    marginTop: 20,
  },

  previewBox: {
    height: 390,
    background: "#111827",
    borderRadius: 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginTop: 20,
  },

  preview: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },

  empty: {
    textAlign: "center",
    color: "#94a3b8",
    marginTop: 80,
  },

  info: {
    display: "flex",
    justifyContent: "space-between",
    gap: 15,
    padding: "12px 0",
    borderBottom: "1px solid #eef2f7",
    fontSize: 13,
  },

  button: {
    width: "100%",
    marginTop: 25,
    padding: 14,
    border: 0,
    borderRadius: 10,
    background: "#2563eb",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },

  remove: {
    width: "100%",
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    background: "#fff",
    border: "1px solid #cbd5e1",
    cursor: "pointer",
  },

  error: {
    marginTop: 25,
    padding: 20,
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 14,
    color: "#991b1b",
  },

  scanning: {
    marginTop: 25,
    padding: 22,
    background: "#eff6ff",
    borderRadius: 15,
    display: "flex",
    gap: 18,
    alignItems: "center",
    color: "#334155",
  },

  spinner: {
    width: 28,
    height: 28,
    border: "3px solid #bfdbfe",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
  },

  result: {
    marginTop: 30,
    background: "#fff",
    padding: 32,
    borderRadius: 20,
    border: "1px solid #e2e8f0",
  },

  resultTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  risk: {
    background: "#eff6ff",
    color: "#2563eb",
    padding: "10px 16px",
    borderRadius: 20,
    fontWeight: 800,
    fontSize: 12,
  },

  scoreRow: {
    display: "flex",
    alignItems: "center",
    gap: 30,
    padding: "30px 0",
  },

  score: {
    width: 145,
    height: 145,
    border: "9px solid #2563eb",
    borderRadius: "50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  findings: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: 15,
  },

  finding: {
    display: "flex",
    gap: 12,
    padding: 18,
    border: "1px solid #e2e8f0",
    borderRadius: 14,
  },

  findingIcon: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#ecfdf5",
    color: "#15803d",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 800,
    flexShrink: 0,
  },

  technical: {
    marginTop: 30,
    padding: 20,
    background: "#f8fafc",
    borderRadius: 14,
  },

  note: {
    marginTop: 25,
    padding: 16,
    background: "#fff7ed",
    color: "#9a3412",
    borderRadius: 10,
    fontSize: 13,
    lineHeight: 1.6,
  },
};

export default Image;