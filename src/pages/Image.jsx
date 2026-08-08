import { useState } from "react";

function Image() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    setFile(selected);
    setResult(null);

    const url = URL.createObjectURL(selected);
    setPreview(url);
  };

  const verifyImage = async () => {
    if (!file) {
      alert("Please select an image first.");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/verify-image",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (error) {
      alert("Unable to analyze image: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreview("");
    setResult(null);
  };

  return (
    <div style={styles.page}>

      {/* HEADER */}

      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>
            TRUTHLENS AI
          </div>

          <h1 style={styles.title}>
            Image Forensics
          </h1>

          <p style={styles.subtitle}>
            Examine images for manipulation indicators,
            metadata anomalies and pixel-level patterns.
          </p>
        </div>

        <div style={styles.badge}>
          ● FORENSIC ANALYSIS
        </div>
      </div>


      {/* MAIN AREA */}

      <div style={styles.mainGrid}>

        {/* IMAGE PREVIEW */}

        <div style={styles.card}>

          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>
                Image Preview
              </h2>

              <p style={styles.cardSubtitle}>
                Review the uploaded image before analysis.
              </p>
            </div>
          </div>


          {!preview ? (

            <label style={styles.uploadArea}>

              <div style={styles.uploadIcon}>
                🖼️
              </div>

              <h3>
                Upload an image
              </h3>

              <p>
                Click here to browse your computer
              </p>

              <span>
                JPG · JPEG · PNG · WEBP
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

            </label>

          ) : (

            <div style={styles.imageContainer}>

              <img
                src={preview}
                alt="Uploaded media"
                style={styles.image}
              />

            </div>

          )}

        </div>


        {/* FILE INFORMATION */}

        <div style={styles.card}>

          <h2 style={styles.cardTitle}>
            File Information
          </h2>

          <p style={styles.cardSubtitle}>
            Technical information about the uploaded file.
          </p>


          {!file ? (

            <div style={styles.empty}>
              <div style={styles.emptyIcon}>
                📁
              </div>

              <p>
                Upload an image to view its details.
              </p>
            </div>

          ) : (

            <div>

              <div style={styles.fileIcon}>
                🖼
              </div>

              <h3 style={styles.fileName}>
                {file.name}
              </h3>

              <Info
                label="File type"
                value={file.type || "Unknown"}
              />

              <Info
                label="File size"
                value={
                  (file.size / 1024).toFixed(1) + " KB"
                }
              />

              <Info
                label="Status"
                value="Ready"
              />


              <button
                onClick={verifyImage}
                disabled={loading}
                style={styles.analyzeButton}
              >
                {loading
                  ? "Analyzing Image..."
                  : "Analyze Image"}
              </button>


              <button
                onClick={removeImage}
                style={styles.removeButton}
              >
                Remove Image
              </button>

            </div>

          )}

        </div>

      </div>


      {/* SCANNING */}

      {loading && (

        <div style={styles.scanning}>

          <div style={styles.spinner}></div>

          <div>
            <h3 style={{ margin: 0 }}>
              Running forensic analysis
            </h3>

            <p style={{ margin: "5px 0 0", color: "#64748b" }}>
              Inspecting metadata, pixel distribution
              and image structure...
            </p>
          </div>

        </div>

      )}


      {/* RESULT */}

      {result && (

        <div style={styles.resultCard}>

          <div style={styles.resultHeader}>

            <div>
              <div style={styles.eyebrow}>
                FORENSIC REPORT
              </div>

              <h2 style={styles.resultTitle}>
                Analysis Complete
              </h2>
            </div>

            <div
              style={{
                ...styles.statusBadge,
                background:
                  result.risk_level === "LOW"
                    ? "#ecfdf5"
                    : result.risk_level === "MEDIUM"
                    ? "#fffbeb"
                    : "#fef2f2",

                color:
                  result.risk_level === "LOW"
                    ? "#15803d"
                    : result.risk_level === "MEDIUM"
                    ? "#b45309"
                    : "#b91c1c",
              }}
            >
              {result.risk_level} RISK
            </div>

          </div>


          {/* SCORE */}

          <div style={styles.scoreSection}>

            <div
              style={{
                ...styles.scoreCircle,

                borderColor:
                  result.authenticity_score >= 80
                    ? "#16a34a"
                    : result.authenticity_score >= 60
                    ? "#f59e0b"
                    : "#dc2626",
              }}
            >

              <strong>
                {result.authenticity_score}%
              </strong>

              <span>
                Authenticity
              </span>

            </div>


            <div>

              <h2 style={{ marginBottom: 8 }}>
                {result.status}
              </h2>

              <p style={styles.cardSubtitle}>
                The score is calculated from the
                available forensic indicators.
              </p>

            </div>

          </div>


          {/* INDICATORS */}

          <h3>
            Forensic Indicators
          </h3>

          <div style={styles.findingsGrid}>

            {result.findings?.map((item, index) => (

              <div
                key={index}
                style={styles.finding}
              >

                <div
                  style={{
                    ...styles.findingIcon,

                    background:
                      item.severity === "good"
                        ? "#ecfdf5"
                        : "#fff7ed",

                    color:
                      item.severity === "good"
                        ? "#15803d"
                        : "#c2410c",
                  }}
                >
                  {item.severity === "good"
                    ? "✓"
                    : "!"}
                </div>

                <div>

                  <strong>
                    {item.name}
                  </strong>

                  <p style={styles.findingText}>
                    {item.status}
                  </p>

                </div>

              </div>

            ))}

          </div>


          {/* TECHNICAL DETAILS */}

          <div style={styles.technical}>

            <h3>
              Technical Details
            </h3>

            <Info
              label="Dimensions"
              value={`${result.width} × ${result.height}`}
            />

            <Info
              label="Format"
              value={result.format}
            />

            <Info
              label="Color mode"
              value={result.color_mode}
            />

            <Info
              label="Pixel entropy"
              value={result.entropy}
            />

            <Info
              label="Metadata fields"
              value={result.metadata_count}
            />

            <Info
              label="File fingerprint"
              value={result.file_hash}
            />

          </div>


          <div style={styles.note}>
            <strong>Note:</strong>{" "}
            This is a forensic risk assessment.
            It should not be treated as a guaranteed
            determination of whether an image was
            generated by AI.
          </div>

        </div>

      )}

    </div>
  );
}


/* INFO COMPONENT */

function Info({ label, value }) {
  return (
    <div style={styles.infoRow}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}


/* STYLES */

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f4f8fc",
    padding: "50px 7%",
    color: "#172033",
    fontFamily: "Inter, Arial, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "40px",
  },

  eyebrow: {
    color: "#2563eb",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "2px",
    marginBottom: "8px",
  },

  title: {
    fontSize: "42px",
    margin: 0,
    marginBottom: "10px",
  },

  subtitle: {
    color: "#64748b",
    maxWidth: "680px",
    lineHeight: 1.6,
  },

  badge: {
    background: "#eff6ff",
    color: "#2563eb",
    padding: "10px 15px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "25px",
  },

  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "28px",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 12px 35px rgba(15,23,42,.05)",
  },

  cardTitle: {
    margin: 0,
    fontSize: "20px",
  },

  cardSubtitle: {
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  uploadArea: {
    height: "400px",
    border: "2px dashed #cbd5e1",
    borderRadius: "16px",
    background: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },

  uploadIcon: {
    fontSize: "58px",
    marginBottom: "15px",
  },

  imageContainer: {
    height: "400px",
    background: "#0f172a",
    borderRadius: "16px",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },

  empty: {
    marginTop: "80px",
    textAlign: "center",
    color: "#94a3b8",
  },

  emptyIcon: {
    fontSize: "45px",
  },

  fileIcon: {
    fontSize: "42px",
    marginTop: "25px",
  },

  fileName: {
    wordBreak: "break-word",
    fontSize: "16px",
    marginBottom: "20px",
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    padding: "13px 0",
    borderBottom: "1px solid #eef2f7",
    fontSize: "13px",
  },

  analyzeButton: {
    width: "100%",
    marginTop: "25px",
    padding: "14px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  removeButton: {
    width: "100%",
    marginTop: "10px",
    padding: "12px",
    background: "#fff",
    color: "#64748b",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    cursor: "pointer",
  },

  scanning: {
    marginTop: "25px",
    padding: "22px",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  spinner: {
    width: "30px",
    height: "30px",
    border: "3px solid #bfdbfe",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  resultCard: {
    marginTop: "30px",
    background: "#fff",
    padding: "32px",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 12px 35px rgba(15,23,42,.05)",
  },

  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  resultTitle: {
    margin: 0,
    fontSize: "28px",
  },

  statusBadge: {
    padding: "10px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "800",
  },

  scoreSection: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
    padding: "35px 0",
  },

  scoreCircle: {
    width: "155px",
    height: "155px",
    border: "10px solid",
    borderRadius: "50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  findingsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "15px",
  },

  finding: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "18px",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
  },

  findingIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "800",
    flexShrink: 0,
  },

  findingText: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  technical: {
    marginTop: "30px",
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "14px",
  },

  note: {
    marginTop: "25px",
    padding: "16px",
    background: "#fff7ed",
    color: "#9a3412",
    borderRadius: "10px",
    fontSize: "13px",
    lineHeight: 1.6,
  },
};

export default Image;