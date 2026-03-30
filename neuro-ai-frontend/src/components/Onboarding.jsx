import React, { useState } from 'react';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    interests: '',
    learningStyle: 'Standard'
  });
  const [loading, setLoading] = useState(false);

  const learningStyles = [
    { id: 'Standard', label: 'Standard', icon: '🧠', color: '#f5f3ff' },
    { id: 'ADHD', label: 'ADHD', icon: '⚡', color: '#fef3c7' },
    { id: 'ASD', label: 'ASD', icon: '🧩', color: '#dcfce7' },
    { id: 'Dyslexia', label: 'Dyslexia', icon: '📖', color: '#fee2e2' }
  ];

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    
    const payload = {
      age: parseInt(formData.age),
      grade: formData.grade,
      interests: formData.interests,
      contrast_mode: formData.learningStyle === 'ADHD' ? 'high' : 'standard',
      input_mode: formData.learningStyle === 'ASD' ? 'visual' : (formData.learningStyle === 'Dyslexia' ? 'verbal' : 'text')
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/student/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        onComplete();
      }
    } catch (err) {
      console.error("Onboarding failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card glass-card">
        <div className="onboarding-progress">
          <div className="progress-bar" style={{width: `${(step/3) * 100}%`}}></div>
        </div>

        {step === 1 && (
          <div className="onboarding-step">
            <h1>Welcome to CogniLearn! 👋</h1>
            <p>Let's personalize your AI tutoring experience. What should we call you?</p>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Alex Smith"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Age</label>
                <input 
                  type="number" 
                  placeholder="e.g. 15"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Grade/Year</label>
                <input 
                  type="text" 
                  placeholder="e.g. 10th Grade"
                  value={formData.grade}
                  onChange={(e) => setFormData({...formData, grade: e.target.value})}
                />
              </div>
            </div>
            <button className="auth-submit" onClick={handleNext} disabled={!formData.name}>Next Step</button>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-step">
            <h1>Learning Profile 🧠</h1>
            <p>Select a profile that best describes your learning needs. This helps the AI adapt its teaching style.</p>
            <div className="style-grid">
              {learningStyles.map(style => (
                <div 
                  key={style.id}
                  className={`style-card ${formData.learningStyle === style.id ? 'active' : ''}`}
                  onClick={() => setFormData({...formData, learningStyle: style.id})}
                >
                  <span className="style-icon" style={{background: style.color}}>{style.icon}</span>
                  <h3>{style.label}</h3>
                </div>
              ))}
            </div>
            <div className="step-btns">
              <button className="btn-secondary" onClick={handleBack}>Back</button>
              <button className="auth-submit" onClick={handleNext}>Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="onboarding-step">
            <h1>Interests & Goals ✨</h1>
            <p>Tell us what you're interested in! The AI can use these to create more engaging examples for you.</p>
            <div className="form-group">
              <label>Favorite Subjects or Hobbies</label>
              <textarea 
                placeholder="e.g. I love Space Exploration, Playing Guitar, and Biology..."
                value={formData.interests}
                onChange={(e) => setFormData({...formData, interests: e.target.value})}
                rows="4"
              />
            </div>
            <div className="step-btns">
              <button className="btn-secondary" onClick={handleBack}>Back</button>
              <button className="auth-submit" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Setting up...' : 'Complete Setup 🚀'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .onboarding-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #f8fafc;
          padding: 2rem;
        }
        .onboarding-card {
          width: 500px;
          padding: 40px;
          border-radius: 32px;
          position: relative;
          overflow: hidden;
        }
        .onboarding-progress {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 6px;
          background: #e2e8f0;
        }
        .progress-bar {
          height: 100%;
          background: var(--primary);
          transition: width 0.3s ease;
        }
        .onboarding-step h1 {
          margin-bottom: 8px;
          font-size: 1.8rem;
          color: var(--text-h);
        }
        .onboarding-step p {
          color: var(--text-p);
          margin-bottom: 32px;
        }
        .form-row {
          display: flex;
          gap: 16px;
        }
        .style-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 32px;
        }
        .style-card {
          padding: 24px;
          border: 2px solid var(--border);
          border-radius: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .style-card:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
        }
        .style-card.active {
          border-color: var(--primary);
          background: var(--accent-bg);
        }
        .style-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin: 0 auto 12px;
        }
        .step-btns {
          display: flex;
          gap: 16px;
          margin-top: 24px;
        }
        .btn-secondary {
          background: #f1f5f9;
          border: none;
          padding: 16px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        textarea {
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid var(--border);
          font-family: inherit;
          resize: none;
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
