import React from 'react';

const DebugPanel = ({ debugData, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="debug-panel-overlay">
      <div className="debug-panel">
        <header className="debug-header">
          <h3>🔍 AI Communication Log</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </header>
        
        <div className="debug-content">
          <section>
            <h4>Outgoing Payload (to Backend)</h4>
            <pre className="json-display">
              {JSON.stringify(debugData.request, null, 2)}
            </pre>
          </section>

          <section>
            <h4>Incoming Response (from Backend)</h4>
            <pre className="json-display">
              {JSON.stringify(debugData.response, null, 2)}
            </pre>
          </section>

          <section>
            <h4>Processing Context</h4>
            <p><strong>Profile:</strong> {debugData.profile || 'Default'}</p>
            <p><strong>Latency:</strong> {debugData.latency}ms</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
