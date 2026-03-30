import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>🧠 CogniLearn AI Assistant</h2>
          <p>Empowering neurodivergent students with personalized AI learning support. Breaking down barriers to education, one lesson at a time.</p>
        </div>
        
        <div className="footer-links">
          <h4>Product</h4>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#dashboard">Dashboard</a></li>
            <li><a href="#pricing">Pricing</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li><a href="#docs">Documentation</a></li>
            <li><a href="#help">Help Center</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2026 CogniLearn. Designed for accessibility and inclusivity.</p>
        <div className="footer-socials">
          <button className="nav-icon-btn">🌐</button>
          <button className="nav-icon-btn">🐦</button>
          <button className="nav-icon-btn">💼</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
