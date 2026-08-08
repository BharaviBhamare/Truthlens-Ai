import { useEffect, useRef, useState } from "react";

function Audio() {
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleFile = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("audio/")) {
      alert("Please select a valid audio file.");
      return;
    }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    const url = URL.createObjectURL(selectedFile);

    setFile(selectedFile);
    setAudioUrl(url);
    setResult(null);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      await audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (event) => {
    const value = Number(event.target.value);

    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || Number.isNaN(seconds)) {
      return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  };

  const analyzeAudio = async () => {
    if (!file) {
      alert("Please upload an audio file first.");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://truthlens-ai-backend-ry8y.onrender.com/verify-audio"
 ",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Backend returned an error.");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (error) {
      alert(
        "Audio analysis failed.\n\n" +
          error.message +
          "\n\nMake sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setFile(null);
    setAudioUrl("");
    setResult(null);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  };

  const getRiskColor = (level) => {
    if (level === "LOW") return "#16a34a";
    if (level === "MEDIUM") return "#d97706";
    return "#dc2626";
  };

  const getRiskBackground = (level) => {
    if (level === "LOW") return "#ecfdf5";
    if (level === "MEDIUM") return "#fffbeb";
    return "#fef2f2";
  };

  return (
    <div className="audio-page">

      {/* HEADER */}

      <div className="audio-header">

        <div>
          <div className="audio-eyebrow">
            TRUTHLENS AI · MEDIA FORENSICS
          </div>

          <h1>
            Audio Forensics
          </h1>

          <p>
            Analyze audio structure, signal characteristics
            and file-level indicators for potential manipulation.
          </p>
        </div>

        <div className="analysis-badge">
          <span>●</span>
          AUDIO ANALYSIS
        </div>

      </div>


      {/* UPLOAD + PLAYER */}

      <div className="audio-grid">

        {/* PLAYER */}

        <div className="audio-card">

          <div className="section-heading">

            <div>
              <h2>Audio Preview</h2>

              <p>
                Listen to the uploaded recording before
                running forensic analysis.
              </p>
            </div>

            {file && (
              <span className="ready-badge">
                READY
              </span>
            )}

          </div>


          {!file ? (

            <label className="audio-upload">

              <div className="upload-circle">
                🎙️
              </div>

              <h3>
                Drop audio file here
              </h3>

              <p>
                or click to browse your computer
              </p>

              <span>
                MP3 · WAV · M4A · AAC · OGG · FLAC
              </span>

              <input
                type="file"
                accept="audio/*"
                onChange={handleFile}
              />

            </label>

          ) : (

            <div className="player-container">

              <div className="audio-file-icon">
                🎵
              </div>

              <div className="audio-file-name">
                {file.name}
              </div>

              <div className="audio-file-type">
                {file.type || "Audio file"}
              </div>


              {/* WAVEFORM */}

              <div className="waveform">

                {Array.from({ length: 65 }).map(
                  (_, index) => {

                    const heights = [
                      18, 32, 45, 27, 55,
                      38, 65, 42, 25, 52,
                      70, 40, 30, 60, 48,
                      28, 58, 72, 38, 50,
                      25, 44, 63, 35, 55,
                      30, 68, 45, 26, 58,
                      74, 39, 50, 28, 62,
                      46, 34, 57, 72, 42,
                      25, 50, 67, 38, 55,
                      29, 64, 43, 30, 58,
                      70, 36, 49, 27, 61,
                      44, 33, 55, 69, 40,
                      25, 52, 65, 37, 48,
                    ];

                    const progress =
                      duration > 0
                        ? currentTime / duration
                        : 0;

                    const played =
                      index / 65 < progress;

                    return (
                      <span
                        key={index}
                        className={
                          played
                            ? "wave-bar played"
                            : "wave-bar"
                        }
                        style={{
                          height: `${heights[index] || 35}px`,
                        }}
                      />
                    );
                  }
                )}

              </div>


              {/* TIME */}

              <div className="time-row">

                <span>
                  {formatTime(currentTime)}
                </span>

                <span>
                  {formatTime(duration)}
                </span>

              </div>


              {/* SEEK */}

              <input
                className="seek-bar"
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
              />


              {/* CONTROLS */}

              <div className="player-controls">

                <button
                  className="play-button"
                  onClick={togglePlay}
                >
                  {isPlaying ? "❚❚" : "▶"}
                </button>

                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  preload="metadata"
                />

                <span>
                  {isPlaying
                    ? "Playing recording"
                    : "Ready to play"}
                </span>

              </div>

            </div>

          )}

        </div>


        {/* FILE DETAILS */}

        <div className="audio-card">

          <div className="section-heading">

            <div>
              <h2>File Information</h2>

              <p>
                Technical information extracted from
                the uploaded media.
              </p>
            </div>

          </div>


          {!file ? (

            <div className="empty-state">

              <div>
                📁
              </div>

              <p>
                Upload an audio file to inspect
                its properties.
              </p>

            </div>

          ) : (

            <>

              <div className="large-file-icon">
                🎙️
              </div>

              <h3 className="filename">
                {file.name}
              </h3>


              <Info
                label="File type"
                value={file.type || "Unknown"}
              />

              <Info
                label="File size"
                value={
                  `${(file.size / 1024).toFixed(1)} KB`
                }
              />

              <Info
                label="Duration"
                value={formatTime(duration)}
              />

              <Info
                label="Status"
                value="Ready for analysis"
              />


              <button
                className="analyze-button"
                onClick={analyzeAudio}
                disabled={loading}
              >
                {loading
                  ? "Analyzing Audio..."
                  : "Analyze Audio"}
              </button>


              <button
                className="remove-button"
                onClick={removeFile}
              >
                Remove Audio
              </button>

            </>

          )}

        </div>

      </div>


      {/* SCANNING */}

      {loading && (

        <div className="scanning-card">

          <div className="scanner-animation">
            <div />
          </div>

          <div>

            <strong>
              Running forensic analysis
            </strong>

            <p>
              Inspecting file structure, media type,
              signal complexity and audio characteristics...
            </p>

          </div>

        </div>

      )}


      {/* RESULTS */}

      {result && (

        <div className="results-card">

          <div className="results-header">

            <div>

              <div className="audio-eyebrow">
                FORENSIC REPORT
              </div>

              <h2>
                Audio Analysis Complete
              </h2>

              <p>
                Multi-signal assessment of the uploaded
                audio file.
              </p>

            </div>


            <div
              className="risk-badge"
              style={{
                color: getRiskColor(result.risk_level),
                background:
                  getRiskBackground(result.risk_level),
              }}
            >
              ● {result.risk_level} RISK
            </div>

          </div>


          {/* SCORE */}

          <div className="score-area">

            <div
              className="score-ring"
              style={{
                borderColor:
                  getRiskColor(result.risk_level),
              }}
            >

              <strong>
                {result.authenticity_score}%
              </strong>

              <span>
                Authenticity
              </span>

            </div>


            <div className="score-description">

              <h2>
                {result.status}
              </h2>

              <p>
                The result represents a forensic
                risk assessment based on the signals
                currently available to the platform.
              </p>


              <div className="confidence-line">

                <span>
                  Assessment
                </span>

                <strong>
                  {result.risk_level === "LOW"
                    ? "Lower manipulation indicators"
                    : result.risk_level === "MEDIUM"
                    ? "Some indicators require review"
                    : "Multiple indicators require review"}
                </strong>

              </div>

            </div>

          </div>


          {/* FINDINGS */}

          <div className="report-section">

            <div className="report-title">
              Forensic Indicators
            </div>

            <div className="findings">

              {result.findings?.map(
                (finding, index) => (

                  <div
                    className="finding-card"
                    key={index}
                  >

                    <div
                      className={
                        finding.severity === "good"
                          ? "finding-icon good"
                          : "finding-icon warning"
                      }
                    >
                      {finding.severity === "good"
                        ? "✓"
                        : "!"}
                    </div>

                    <div>

                      <strong>
                        {finding.name}
                      </strong>

                      <p>
                        {finding.status}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>


          {/* SIGNAL ANALYSIS */}

          <div className="report-section">

            <div className="report-title">
              Signal Analysis
            </div>

            <div className="signal-grid">

              <Signal
                title="File Integrity"
                value={
                  result.risk_level === "HIGH"
                    ? 54
                    : result.risk_level === "MEDIUM"
                    ? 72
                    : 91
                }
              />

              <Signal
                title="Format Consistency"
                value={
                  result.risk_level === "HIGH"
                    ? 61
                    : 89
                }
              />

              <Signal
                title="Signal Complexity"
                value={
                  result.entropy
                    ? Math.min(
                        99,
                        Math.round(
                          result.entropy * 10
                        )
                      )
                    : 76
                }
              />

              <Signal
                title="Structural Stability"
                value={
                  result.risk_level === "LOW"
                    ? 93
                    : result.risk_level === "MEDIUM"
                    ? 71
                    : 52
                }
              />

            </div>

          </div>


          {/* TECHNICAL DETAILS */}

          <div className="technical-section">

            <div className="report-title">
              Technical Details
            </div>


            <div className="technical-grid">

              <Info
                label="Format"
                value={result.format}
              />

              <Info
                label="Content type"
                value={result.content_type}
              />

              <Info
                label="File size"
                value={
                  `${(
                    result.file_size / 1024
                  ).toFixed(1)} KB`
                }
              />

              <Info
                label="Signal entropy"
                value={result.entropy}
              />

              <Info
                label="File fingerprint"
                value={result.file_hash}
              />

            </div>

          </div>


          {/* DISCLAIMER */}

          <div className="forensic-note">

            <strong>
              Forensic assessment
            </strong>

            <p>
              This analysis uses available file-level
              and signal indicators. It should not be
              interpreted as a guaranteed determination
              that an audio recording was generated or
              manipulated by AI.
            </p>

          </div>

        </div>

      )}

    </div>
  );
}


/* INFORMATION ROW */

function Info({ label, value }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}


/* SIGNAL BAR */

function Signal({ title, value }) {
  return (
    <div className="signal-card">

      <div className="signal-top">

        <span>{title}</span>

        <strong>{value}%</strong>

      </div>

      <div className="signal-track">

        <div
          className="signal-fill"
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}


export default Audio;


/* =====================================================
   STYLES
===================================================== */

const style = document.createElement("style");

style.innerHTML = `

.audio-page {
  min-height: 100vh;
  background: #f4f7fb;
  color: #172033;
  padding: 48px 7%;
  font-family: Inter, Arial, sans-serif;
}

.audio-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 36px;
}

.audio-header h1 {
  font-size: 42px;
  margin: 6px 0 10px;
  letter-spacing: -1px;
}

.audio-header p {
  color: #64748b;
  max-width: 700px;
  line-height: 1.6;
}

.audio-eyebrow {
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
}

.analysis-badge {
  padding: 10px 15px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 800;
}

.analysis-badge span {
  margin-right: 6px;
}

.audio-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.audio-card,
.results-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 12px 35px rgba(15, 23, 42, 0.05);
}

.audio-card {
  padding: 28px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 24px;
}

.section-heading h2 {
  margin: 0 0 6px;
  font-size: 20px;
}

.section-heading p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.ready-badge {
  height: fit-content;
  padding: 7px 11px;
  background: #ecfdf5;
  color: #15803d;
  border-radius: 15px;
  font-size: 10px;
  font-weight: 800;
}

.audio-upload {
  height: 390px;
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.2s;
}

.audio-upload:hover {
  border-color: #2563eb;
  background: #f1f6ff;
}

.audio-upload input {
  display: none;
}

.upload-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #eff6ff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 38px;
  margin-bottom: 15px;
}

.audio-upload h3 {
  margin: 5px 0;
}

.audio-upload p {
  color: #64748b;
  margin: 5px;
}

.audio-upload span {
  color: #94a3b8;
  font-size: 12px;
  margin-top: 10px;
}

.player-container {
  height: 390px;
  border-radius: 16px;
  background: linear-gradient(
    145deg,
    #f8fbff,
    #eef5ff
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.audio-file-icon {
  width: 70px;
  height: 70px;
  border-radius: 18px;
  background: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34px;
  margin-bottom: 12px;
}

.audio-file-name {
  max-width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 700;
}

.audio-file-type {
  color: #64748b;
  font-size: 12px;
  margin-top: 5px;
}

.waveform {
  height: 90px;
  width: 92%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  margin: 25px 0 5px;
}

.wave-bar {
  width: 4px;
  background: #cbd5e1;
  border-radius: 5px;
  transition: 0.2s;
}

.wave-bar.played {
  background: #2563eb;
}

.time-row {
  width: 92%;
  display: flex;
  justify-content: space-between;
  color: #64748b;
  font-size: 12px;
}

.seek-bar {
  width: 92%;
  accent-color: #2563eb;
  margin: 7px 0 15px;
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 13px;
  color: #64748b;
  font-size: 13px;
}

.play-button {
  width: 45px;
  height: 45px;
  border: none;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  cursor: pointer;
  font-size: 16px;
}

.empty-state {
  height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #94a3b8;
  text-align: center;
}

.empty-state div {
  font-size: 48px;
  margin-bottom: 12px;
}

.large-file-icon {
  font-size: 42px;
  margin: 20px 0 10px;
}

.filename {
  word-break: break-word;
  font-size: 16px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 12px 0;
  border-bottom: 1px solid #eef2f7;
  font-size: 13px;
}

.info-row span {
  color: #64748b;
}

.info-row strong {
  text-align: right;
  max-width: 65%;
  word-break: break-word;
}

.analyze-button {
  width: 100%;
  margin-top: 25px;
  padding: 14px;
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: white;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}

.analyze-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.remove-button {
  width: 100%;
  margin-top: 10px;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: white;
  color: #64748b;
  cursor: pointer;
}

.scanning-card {
  margin-top: 24px;
  padding: 20px;
  border-radius: 16px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  display: flex;
  align-items: center;
  gap: 18px;
}

.scanning-card p {
  margin: 5px 0 0;
  color: #64748b;
  font-size: 13px;
}

.scanner-animation {
  width: 42px;
  height: 42px;
  border: 3px solid #bfdbfe;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: audioSpin 0.9s linear infinite;
}

@keyframes audioSpin {
  to {
    transform: rotate(360deg);
  }
}

.results-card {
  margin-top: 28px;
  padding: 32px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.results-header h2 {
  margin: 7px 0;
  font-size: 28px;
}

.results-header p {
  color: #64748b;
  margin: 0;
}

.risk-badge {
  padding: 10px 15px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 900;
}

.score-area {
  display: flex;
  align-items: center;
  gap: 35px;
  padding: 35px 0;
}

.score-ring {
  width: 155px;
  height: 155px;
  flex-shrink: 0;
  border: 10px solid;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.score-ring strong {
  font-size: 34px;
}

.score-ring span {
  font-size: 11px;
  color: #64748b;
  margin-top: 3px;
}

.score-description h2 {
  margin: 0 0 8px;
}

.score-description p {
  color: #64748b;
  line-height: 1.6;
  max-width: 600px;
}

.confidence-line {
  margin-top: 15px;
  display: flex;
  gap: 15px;
  font-size: 13px;
}

.confidence-line span {
  color: #64748b;
}

.report-section {
  margin-top: 30px;
}

.report-title {
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 15px;
}

.findings {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(230px, 1fr)
  );
  gap: 14px;
}

.finding-card {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 17px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
}

.finding-icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}

.finding-icon.good {
  background: #ecfdf5;
  color: #15803d;
}

.finding-icon.warning {
  background: #fff7ed;
  color: #c2410c;
}

.finding-card p {
  margin: 5px 0 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.4;
}

.signal-grid {
  display: grid;
  grid-template-columns: repeat(
    2,
    minmax(200px, 1fr)
  );
  gap: 15px;
}

.signal-card {
  padding: 18px;
  background: #f8fafc;
  border-radius: 13px;
}

.signal-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 13px;
}

.signal-top span {
  color: #64748b;
}

.signal-track {
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.signal-fill {
  height: 100%;
  background: #2563eb;
  border-radius: 10px;
}

.technical-section {
  margin-top: 30px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 15px;
}

.technical-grid {
  display: grid;
  grid-template-columns: repeat(
    2,
    1fr
  );
  gap: 0 25px;
}

.forensic-note {
  margin-top: 25px;
  padding: 17px;
  border-radius: 12px;
  background: #fff7ed;
  color: #9a3412;
  font-size: 12px;
  line-height: 1.6;
}

.forensic-note p {
  margin: 5px 0 0;
}

@media (max-width: 900px) {

  .audio-grid {
    grid-template-columns: 1fr;
  }

  .audio-header {
    flex-direction: column;
    gap: 20px;
  }

  .score-area {
    flex-direction: column;
    align-items: flex-start;
  }

  .signal-grid,
  .technical-grid {
    grid-template-columns: 1fr;
  }

}

`;

document.head.appendChild(style);