import React from "react";
import { useNavigate } from "react-router-dom";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/labs/card/filled-card.js";
import "@material/web/textfield/outlined-text-field.js";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Top Bar */}
      <header className="top-bar">
        <h1 className="logo">LocalGov Connect</h1>
        <div className="search-login">
          <md-outlined-text-field
            label="Search issues..."
            class="search-field"
          ></md-outlined-text-field>
          <md-outlined-button onClick={() => navigate("/citizen/login")}>
            Citizen Login
          </md-outlined-button>
          <md-filled-button onClick={() => navigate("/gov/login")}>
            Official Login
          </md-filled-button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <h2 className="hero-title">Connecting Citizens. Solving Local Issues.</h2>
        <p className="hero-subtitle">
          A smarter way for citizens and governments to connect. Report,
          collaborate, and resolve civic issues effortlessly.
        </p>
        <div className="cta-buttons">
          <md-filled-button onClick={() => navigate("/citizen/login")}>
            Get Started
          </md-filled-button>
          <md-outlined-button onClick={() => navigate("/gov/login")}>
            Learn More
          </md-outlined-button>
        </div>
      </section>

      {/* Wave Divider
      <div className="wave-container">
        <div className="wave"></div>
        <div className="wave"></div>
      </div>*/}

{/* Wave Divider (replace previous .wave markup) */}
<div className="wave-container" aria-hidden="true">
  <svg
    className="wave-svg wave1"
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0,160L48,165.3C96,171,192,181,288,170.7C384,160,480,128,576,133.3C672,139,768,181,864,170.7C960,160,1056,96,1152,90.7C1248,85,1344,139,1392,165.3L1440,192L1440,320L0,320Z"
      fill="var(--md-sys-color-primary-container)"
    />
  </svg>

  <svg
    className="wave-svg wave2"
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0,96L48,117.3C96,139,192,181,288,197.3C384,213,480,203,576,170.7C672,139,768,85,864,90.7C960,96,1056,160,1152,170.7C1248,181,1344,139,1392,117.3L1440,96L1440,320L0,320Z"
      fill="var(--md-sys-color-primary-container)"
      fillOpacity="0.55"
    />
  </svg>
</div>


      {/* Features */}
      <section className="features-section">
        <h2>Why Choose LocalGov Connect?</h2>
        <div className="features-cards">
          <md-filled-card class="feature-card">
            <h3>📱 Report Issues</h3>
            <p>Raise complaints about roads, water, sanitation, and more.</p>
          </md-filled-card>
          <md-filled-card class="feature-card">
            <h3>⚡ Real-Time Updates</h3>
            <p>Get instant updates from government officials on reported issues.</p>
          </md-filled-card>
          <md-filled-card class="feature-card">
            <h3>🤝 Transparency</h3>
            <p>Track progress openly and build trust in your local government.</p>
          </md-filled-card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="landing-testimonials">
        <h2>What People Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial">
            <p>
              “Reporting potholes has never been this easy. My complaint was
              resolved in just 2 days!”
            </p>
            <span>- A Citizen</span>
          </div>
          <div className="testimonial">
            <p>
              “We can now prioritize issues better and respond faster. It’s a
              game-changer for officials.”
            </p>
            <span>- A Gov Official</span>
          </div>
        </div>
      </section>

      {/* Extra Call-to-Action */}
      <section className="get-started-section">
        <h2>Be Part of the Change</h2>
        <p>
          Join LocalGov Connect today and help create a transparent,
          collaborative, and citizen-friendly governance system.
        </p>
        <div className="cta-buttons">
          <md-filled-button onClick={() => navigate("/citizen/login")}>
            Sign Up Free
          </md-filled-button>
          <md-outlined-button onClick={() => navigate("/gov/login")}>
            Official Login
          </md-outlined-button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2025 LocalGov Connect — Empowering Communities</p>
      </footer>
    </div>
  );
}

export default LandingPage;
