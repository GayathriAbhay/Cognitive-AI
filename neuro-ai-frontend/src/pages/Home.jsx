import React, { useState } from 'react';

const Home = ({ setActiveTab }) => {
  const [demoInput, setDemoInput] = useState('');
  const [demoOutput, setDemoOutput] = useState('');

  const handleDemoSimplify = () => {
    if (!demoInput.trim()) return;
    setDemoOutput("Simplifying...");
    setTimeout(() => {
      setDemoOutput("This tool helps people who learn differently by making hard lessons easier to understand. It breaks down big tasks into small, manageable steps so you can focus better.");
    }, 800);
  };

  return (
    <div className="home-page">
      {/* SECTION 1: HERO */}
      <section className="hero section-padding">
        <div className="hero-content">
          <div className="trust-shield">🛡️ Privacy-First AI</div>
          <h1>AI-powered assistant that simplifies learning for neurodivergent students</h1>
          <p>Helps with focus, comprehension, and personalized learning by breaking down the world's most complex information.</p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => setActiveTab('dashboard')}>Try Demo Now</button>
            <button className="btn-primary" onClick={() => document.getElementById('how-it-works').scrollIntoView({behavior: 'smooth'})}>Watch How It Learns</button>
          </div>
        </div>
        <div className="hero-img">
          <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" alt="Inclusive Learning" />
        </div>
      </section>

      {/* SECTION 2: PROBLEM (Empathetic) */}
      <section className="section-padding bg-light">
        <div className="section-title">
          <h2>🎯 We understand the challenges</h2>
          <p>Learning shouldn't feel like a battle against your own brain. We address the core barriers to education.</p>
        </div>
        <div className="problem-grid">
          <div className="problem-card">
            <h3>Difficulty Focusing</h3>
            <p>Traditional textbooks and long lectures can make it impossible to stay on track.</p>
          </div>
          <div className="problem-card">
            <h3>Overwhelming Content</h3>
            <p>Huge walls of text and dense information trigger anxiety and mental fatigue.</p>
          </div>
          <div className="problem-card">
            <h3>Complex Explanations</h3>
            <p>Most resources aren't written for neurodivergent processing styles.</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURES (Core) */}
      <section className="section-padding bg-white" id="features">
        <div className="section-title">
          <h2>⚙️ Built for Your Way of Thinking</h2>
          <p>CogniLearn adapts to YOU, not the other way around.</p>
        </div>
        <div className="features-grid-v2">
          <div className="feature-card">
            <div className="feature-icon" style={{background: '#f5f3ff'}}>✨</div>
            <h3>Smart Simplification</h3>
            <p>Converts complex academic text into simple, crystal-clear explanations instantly.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{background: '#fdf2f8'}}>🧩</div>
            <h3>Personalized Tone</h3>
            <p>Adjusts the explanation style from simple to detailed based on your preference.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{background: '#eff6ff'}}>🔊</div>
            <h3>Multi-format Output</h3>
            <p>Turn any lesson into bullet points, step-by-step guides, or summaries.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{background: '#f0fdf4'}}>🎧</div>
            <h3>TTS & Voice Support</h3>
            <p>Listen to any document with high-quality, friendly female voices for better focus.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{background: '#fff7ed'}}>📊</div>
            <h3>Focus Assistance</h3>
            <p>Breaks large assignments into tiny, manageable chunks that are easy to start.</p>
          </div>
        </div>
      </section>

      {/* SECTION 4: LIVE DEMO TEASER */}
      <section className="section-padding bg-light">
        <div className="section-title">
          <h2>🧪 See the Magic in Action</h2>
          <p>Paste any complex sentence below to see how CogniLearn simplifies it.</p>
        </div>
        <div className="demo-teaser">
          <div className="demo-input-group">
            <label>Input complex text:</label>
            <textarea 
              className="demo-textarea" 
              placeholder="e.g., The fundamental mechanism of neural plasticity involves the long-term potentiation of synaptic strength..."
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
            />
            <button className="btn-primary" style={{marginTop: '1rem', width: '100%'}} onClick={handleDemoSimplify}>
              Simplify Instantly
            </button>
          </div>
          {demoOutput && (
            <div className="demo-output-box">
              <strong>Simplified Version:</strong>
              <p>{demoOutput}</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5: HOW IT WORKS */}
      <section className="section-padding bg-white" id="how-it-works">
        <div className="section-title">
          <h2>🧠 How CogniLearn Works</h2>
          <p>We use state-of-the-art NLP and Large Language Models to re-process information for you.</p>
        </div>
        <div className="pipeline-flow">
          <div className="pipeline-step">
            <div className="step-icon">📥</div>
            <h4>Input</h4>
            <p>You paste text or upload a PDF.</p>
          </div>
          <div className="pipeline-arrow">➔</div>
          <div className="pipeline-step">
            <div className="step-icon">⚙️</div>
            <h4>Processing</h4>
            <p>AI scans for complexity and keywords.</p>
          </div>
          <div className="pipeline-arrow">➔</div>
          <div className="pipeline-step">
            <div className="step-icon">✨</div>
            <h4>Output</h4>
            <p>Simplified, focus-ready content appears.</p>
          </div>
        </div>
      </section>

      {/* SECTION 6 & 7: WHO IT HELPS & USE CASES */}
      <section className="section-padding bg-light">
        <div className="section-title">
          <h2>👥 Built for Inclusive Success</h2>
          <p>Specifically designed for students with ADHD, Dyslexia, and Autism.</p>
        </div>
        <div className="use-case-grid">
          <div className="use-case-card">
            <h4>ADHD Students</h4>
            <p>Avoid the "Wall of Text" and stay focused with chunks.</p>
          </div>
          <div className="use-case-card">
            <h4>Dyslexic Learners</h4>
            <p>Reduce reading fatigue with simplified phrasing and TTS.</p>
          </div>
          <div className="use-case-card">
            <h4>Autism Spectrum</h4>
            <p>Direct, literal explanations without confusing metaphors.</p>
          </div>
        </div>
      </section>

      {/* SECTION 8, 9, 10: TRUST, ABOUT, TECH */}
      <section className="section-padding bg-white">
        <div className="section-title">
          <h2>🛡️ Trust & Technology</h2>
        </div>
        <div style={{maxWidth: '800px', margin: '0 auto', textAlign: 'center'}}>
          <p style={{marginBottom: '3rem', fontSize: '1.1rem'}}>
            Built by a Computer Science student with a passion for inclusive education. 
            CogniLearn is assistive—it's designed to help you understand your textbooks, 
            not replace the learning process. Your data is private and never misused.
          </p>
          
          <div className="tech-stack">
            <div className="tech-item"><span className="tech-logo">⚛️</span> React / Vite</div>
            <div className="tech-item"><span className="tech-logo">🐍</span> Flask / Python</div>
            <div className="tech-item"><span className="tech-logo">🤖</span> Llama 3 / LLM</div>
            <div className="tech-item"><span className="tech-logo">🗄️</span> SQLite / SQLAlch</div>
          </div>
        </div>
      </section>

      {/* SECTION 11: FINAL CTA */}
      <section className="cta-section">
        <h2>Unlock Your Potential with CogniLearn</h2>
        <p>Ready to experience a better way to study?</p>
        <div className="hero-btns" style={{justifyContent: 'center'}}>
          <button className="btn-white" onClick={() => setActiveTab('dashboard')}>Get Started for Free &gt;</button>
        </div>
      </section>
    </div>
  );
};

export default Home;
