import { useNavigate } from "react-router-dom";

import "./App.css";

function App() {
  const navigate = useNavigate();
  const features = [
    {
      icon: "🎥",
      title: "Video Detection",
      desc: "Detect face swaps, lip-sync manipulation and synthetic videos."
    },
    {
      icon: "🎤",
      title: "Audio Verification",
      desc: "Identify AI-generated speech and cloned voices."
    },
    {
      icon: "🖼️",
      title: "Image Analysis",
      desc: "Find AI-generated images, morphing and editing artifacts."
    },
    {
      icon: "📄",
      title: "Document Verification",
      desc: "Validate metadata and document authenticity."
    }
  ];

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">TruthLens AI</h2>

        <ul className="nav-links">
          <li>Features</li>
          <li>How it Works</li>
          <li>API</li>
          <li>Contact</li>
        </ul>

        <button className="login-btn">Sign In</button>
      </nav>

      {/* Hero */}
      <section className="hero">

        <div className="hero-left">

          <span className="badge">
            🚀 Universal Cross-Modal Deepfake Detection
          </span>

          <h1>
            Detect AI Generated
            <br />
            Videos, Audio,
            <br />
            Images &
            Documents
          </h1>

          <p>
            One intelligent platform that scans videos,
            cloned voices, AI-generated images and
            document metadata to produce a unified
            authenticity score.
          </p>

          <div className="buttons">
            <button className="primary">
              Start Free Scan
            </button>

            <button className="secondary">
              Live Demo
            </button>
          </div>

        </div>

        <div className="hero-right">

          <div className="scan-card">

            <h3>Authenticity Score</h3>

            <div className="score">
              92%
            </div>

            <p className="status">
              ✔ Likely Authentic
            </p>

            <div className="line"></div>

            <div className="result">
              🎥 Video Analysis
              <span>Passed</span>
            </div>

            <div className="result">
              🎤 Audio Analysis
              <span>Passed</span>
            </div>

            <div className="result">
              🖼️ Image Analysis
              <span>Passed</span>
            </div>

            <div className="result">
              📄 Metadata
              <span>Verified</span>
            </div>

          </div>

        </div>

      </section>

      {/* Features */}

      <section className="features">

        <h2>Everything You Need</h2>

        <div className="cards">

          {features.map((item) => (

            <div className="card" 
            key={item.title}
            onClick={() => {
    if (item.title === "Image Analysis") {
      navigate("/image");
    }
    if (item.title === "Video Detection") {
      navigate("/video");
    }

    if (item.title === "Audio Verification") {
     navigate("/audio");
  }

    if (item.title === "Document Verification") {
       navigate("/document");
    }
  }}
  style={{ cursor: "pointer" }}
            >

              <div className="icon">
                {item.icon}
              </div>

              <h3>{item.title}</h3>

              <p>{item.desc}</p>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}

export default App;
