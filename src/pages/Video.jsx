import { useState } from "react";

function Video() {
  const [file, setFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);

    // Create a temporary URL so the uploaded video can be displayed
    const url = URL.createObjectURL(selectedFile);
    setVideoURL(url);
  };

  const verifyVideo = () => {
    if (!file) {
      alert("Please select a video first.");
      return;
    }

    setScanning(true);
    setResult(null);

    // Temporary UI simulation.
    // Later this will be replaced with the Python AI API.
    setTimeout(() => {
      setScanning(false);

      setResult({
        score: 72,
        status: "Medium Risk",
        findings: [
          {
            name: "Video Metadata",
            status: "Available",
            type: "good",
          },
          {
            name: "Frame Consistency",
            status: "Requires Analysis",
            type: "warning",
          },
          {
            name: "Face Analysis",
            status: "Face Detected",
            type: "good",
          },
          {
            name: "Synthetic Manipulation",
            status: "Needs AI Verification",
            type: "warning",
          },
        ],
      });
    }, 2500);
  };

  const resetVideo = () => {
    setFile(null);
    setVideoURL("");
    setResult(null);
    setScanning(false);
  };

  return (
    <div style={styles.page}>

      {/* Header */}

      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>TRUTHLENS AI</div>

          <h1 style={styles.title}>
            Video Forensics
          </h1>

          <p style={styles.subtitle}>
            Analyze video content for manipulation,
            synthetic frames and deepfake indicators.
          </p>
        </div>

        <div style={styles.securityBadge}>
          ● SECURE ANALYSIS
        </div>
      </div>


      {/* Main Grid */}

      <div style={styles.mainGrid}>

        {/* LEFT - VIDEO */}

        <div style={styles.videoSection}>

          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                Media Preview
              </h2>

              <p style={styles.sectionDescription}>
                Preview the uploaded video before analysis.
              </p>
            </div>
          </div>


          {!videoURL ? (

            <label style={styles.uploadBox}>

              <div style={styles.uploadIcon}>
                🎥
              </div>

              <h3>
                Upload a video
              </h3>

              <p>
                Drag and drop your video here
                or click to browse
              </p>

              <span style={styles.fileTypes}>
                MP4 · MOV · AVI · WEBM
              </span>

              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

            </label>

          ) : (

            <div style={styles.videoContainer}>

              <video
                src={videoURL}
                controls
                style={styles.video}
              />

            </div>

          )}

        </div>


        {/* RIGHT - FILE INFORMATION */}

        <div style={styles.infoCard}>

          <h2 style={styles.sectionTitle}>
            File Information
          </h2>

          {!file ? (

            <div style={styles.emptyInfo}>
              <div style={styles.smallIcon}>
                📁
              </div>

              <p>
                Upload a video to view
                file information.
              </p>
            </div>

          ) : (

            <div>

              <div style={styles.fileIcon}>
                🎬
              </div>

              <h3 style={styles.fileName}>
                {file.name}
              </h3>

              <div style={styles.infoRow}>
                <span>File type</span>
                <strong>
                  {file.type || "Video"}
                </strong>
              </div>

              <div style={styles.infoRow}>
                <span>File size</span>
                <strong>
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </strong>
              </div>

              <div style={styles.infoRow}>
                <span>Modified</span>
                <strong>
                  Ready
                </strong>
              </div>

              <button
                onClick={verifyVideo}
                disabled={scanning}
                style={{
                  ...styles.analyzeButton,
                  opacity: scanning ? 0.7 : 1,
                }}
              >
                {scanning
                  ? "Analyzing Video..."
                  : "Analyze Video"}
              </button>

              <button
                onClick={resetVideo}
                style={styles.resetButton}
              >
                Remove Video
              </button>

            </div>

          )}

        </div>

      </div>


      {/* SCANNING */}

      {scanning && (

        <div style={styles.scanningCard}>

          <div style={styles.spinner}></div>

          <div>
            <h3>
              Performing video analysis...
            </h3>

            <p>
              Inspecting frames, metadata and
              facial regions.
            </p>
          </div>

        </div>

      )}


      {/* RESULT */}

      {result && (

        <div style={styles.resultSection}>

          <div style={styles.resultHeader}>

            <div>
              <div style={styles.eyebrow}>
                FORENSIC REPORT
              </div>

              <h2 style={styles.resultTitle}>
                Analysis Complete
              </h2>
            </div>

            <div style={styles.resultBadge}>
              {result.status}
            </div>

          </div>


          {/* Score */}

          <div style={styles.scoreArea}>

            <div
              style={{
                ...styles.scoreCircle,
                borderColor:
                  result.score >= 80
                    ? "#16a34a"
                    : result.score >= 50
                    ? "#f59e0b"
                    : "#dc2626",
              }}
            >
              <span style={styles.scoreNumber}>
                {result.score}%
              </span>

              <span style={styles.scoreLabel}>
                Authenticity
              </span>
            </div>

            <div style={styles.scoreText}>

              <h3>
                {result.score >= 80
                  ? "Low Risk"
                  : result.score >= 50
                  ? "Medium Risk"
                  : "High Risk"}
              </h3>

              <p>
                This score represents the current
                assessment of available forensic
                indicators.
              </p>

            </div>

          </div>


          {/* Findings */}

          <div style={styles.findingsGrid}>

            {result.findings.map((item) => (

              <div
                key={item.name}
                style={styles.findingCard}
              >

                <div style={styles.findingIcon}>
                  {item.type === "good"
                    ? "✓"
                    : "⚠"}
                </div>

                <div>

                  <h4>
                    {item.name}
                  </h4>

                  <p>
                    {item.status}
                  </p>

                </div>

              </div>

            ))}

          </div>


          {/* Disclaimer */}

          <div style={styles.note}>
            <strong>Assessment note:</strong>{" "}
            This prototype displays forensic indicators.
            Final deepfake classification should be
            generated by the connected AI detection model.
          </div>

        </div>

      )}

    </div>
  );
}


/* =========================
   STYLES
========================= */

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f4f8fc",
    padding: "50px 7%",
    color: "#172033",
    fontFamily:
      "Inter, Arial, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "40px",
  },

  eyebrow: {
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "2px",
    color: "#2563eb",
    marginBottom: "8px",
  },

  title: {
    fontSize: "42px",
    margin: "0 0 10px",
    fontWeight: "750",
  },

  subtitle: {
    color: "#64748b",
    fontSize: "16px",
    maxWidth: "650px",
    lineHeight: "1.7",
    margin: 0,
  },

  securityBadge: {
    background: "#ecfdf5",
    color: "#15803d",
    padding: "10px 15px",
    borderRadius: "30px",
    fontSize: "12px",
    fontWeight: "700",
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 2fr) minmax(300px, 1fr)",
    gap: "25px",
    alignItems: "stretch",
  },

  videoSection: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "28px",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 12px 35px rgba(15, 23, 42, 0.05)",
  },

  sectionHeader: {
    marginBottom: "20px",
  },

  sectionTitle: {
    fontSize: "20px",
    margin: "0 0 6px",
  },

  sectionDescription: {
    color: "#64748b",
    fontSize: "14px",
    margin: 0,
  },

  uploadBox: {
    minHeight: "380px",
    border: "2px dashed #cbd5e1",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    background: "#f8fafc",
    transition: "0.2s",
  },

  uploadIcon: {
    fontSize: "55px",
    marginBottom: "15px",
  },

  fileTypes: {
    marginTop: "10px",
    fontSize: "12px",
    color: "#94a3b8",
  },

  videoContainer: {
    background: "#0f172a",
    borderRadius: "16px",
    overflow: "hidden",
  },

  video: {
    width: "100%",
    maxHeight: "520px",
    display: "block",
  },

  infoCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "28px",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 12px 35px rgba(15, 23, 42, 0.05)",
  },

  emptyInfo: {
    textAlign: "center",
    marginTop: "80px",
    color: "#64748b",
  },

  smallIcon: {
    fontSize: "45px",
    marginBottom: "10px",
  },

  fileIcon: {
    fontSize: "45px",
    margin: "25px 0 15px",
  },

  fileName: {
    fontSize: "16px",
    wordBreak: "break-word",
    marginBottom: "25px",
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px 0",
    borderBottom:
      "1px solid #eef2f7",
    fontSize: "13px",
  },

  analyzeButton: {
    width: "100%",
    marginTop: "25px",
    padding: "14px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },

  resetButton: {
    width: "100%",
    marginTop: "10px",
    padding: "12px",
    background: "#ffffff",
    color: "#64748b",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    cursor: "pointer",
  },

  scanningCard: {
    marginTop: "25px",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "16px",
    padding: "22px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  spinner: {
    width: "28px",
    height: "28px",
    border: "3px solid #bfdbfe",
    borderTop:
      "3px solid #2563eb",
    borderRadius: "50%",
    animation:
      "spin 1s linear infinite",
  },

  resultSection: {
    marginTop: "30px",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "32px",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 12px 35px rgba(15, 23, 42, 0.05)",
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

  resultBadge: {
    padding: "9px 15px",
    background: "#fff7ed",
    color: "#c2410c",
    borderRadius: "30px",
    fontSize: "13px",
    fontWeight: "700",
  },

  scoreArea: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
    padding: "35px 0",
  },

  scoreCircle: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    border: "10px solid",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  scoreNumber: {
    fontSize: "36px",
    fontWeight: "800",
  },

  scoreLabel: {
    fontSize: "12px",
    color: "#64748b",
  },

  scoreText: {
    maxWidth: "500px",
  },

  findingsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
  },

  findingCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  findingIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },

  note: {
    marginTop: "25px",
    padding: "15px",
    background: "#f8fafc",
    borderRadius: "10px",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.6",
  },
};

export default Video;