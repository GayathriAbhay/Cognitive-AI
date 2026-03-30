import React from 'react';

const Features = () => {
  const features = [
    { title: "Lesson Simplification", desc: "AI-driven reduction of complex academic content.", icon: "📚", color: "#f5f3ff" },
    { title: "Task Breakdown", desc: "Step-by-step guidance for any academic assignment.", icon: "✅", color: "#fdf2f8" },
    { title: "Multimodal Support", desc: "Support for visual, auditory, and kinesthetic learning.", icon: "🔊", color: "#eff6ff" },
    { title: "AI Tutoring", desc: "24/7 personalized tutoring tailored to your needs.", icon: "🧠", color: "#f0fdf4" },
    { title: "Social Support", desc: "Tools to help navigate social scenarios and group work.", icon: "👤", color: "#fff7ed" },
    { title: "Focus Mode", desc: "Minimize distractions and stay on track with smart timers.", icon: "⏱️", color: "#fff1f2" }
  ];

  return (
    <div className="features-page">
      <section className="features-hero" style={{textAlign: 'center', padding: '60px 2rem'}}>
        <h1 style={{fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-h)'}}>Platform Capabilities</h1>
        <p style={{fontSize: '1.25rem', color: 'var(--text-p)', maxWidth: '700px', margin: '0 auto'}}>
          Explore how CogniLearn uses advanced AI to create an inclusive and productive learning environment for every student.
        </p>
      </section>

      <section className="features-grid" style={{
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem', 
        padding: '0 2rem 80px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {features.map((f, i) => (
          <div key={i} className="feature-card" style={{
            padding: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            background: 'white',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform 0.2s'
          }}>
            <div className="feature-icon" style={{
              background: f.color,
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              marginBottom: '1.5rem'
            }}>
              {f.icon}
            </div>
            <h3 style={{marginBottom: '0.75rem', fontSize: '1.4rem'}}>{f.title}</h3>
            <p style={{color: 'var(--text-p)', lineHeight: '1.6'}}>{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Features;
