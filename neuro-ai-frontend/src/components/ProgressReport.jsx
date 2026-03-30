import React, { useState, useEffect, useCallback } from 'react';

const ProgressReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  const refresh = () => {
    setLoading(true);
    setError(null);
    setData(null);
    setTick(t => t + 1);
  };

  useEffect(() => {
    let cancelled = false;
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('access_token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const res = await fetch(`${API_URL}/student/progress-report`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (cancelled) return;
        if (res.ok) {
          const json = await res.json();
          setData(json);
          setError(null);
        } else {
          const text = await res.text();
          setError(`Server error ${res.status}`);
          console.error('Progress report error:', text);
        }
      } catch (e) {
        if (!cancelled) {
          setError('Could not connect to server');
          console.error('Progress report fetch failed:', e);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchReport();
    return () => { cancelled = true; };
  }, [tick]);

  const header = (
    <div className="pr-header">
      <h3>📊 Progress Report</h3>
      <button className="pr-refresh-btn" onClick={refresh} title="Refresh">🔄</button>
    </div>
  );

  if (loading) {
    return (
      <div className="insight-card progress-card">
        {header}
        <p className="pr-loading">Loading your progress...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="insight-card progress-card">
        {header}
        <p className="pr-error">{error || 'Could not load progress.'}</p>
        <button className="pr-retry-btn" onClick={refresh}>Try Again</button>
      </div>
    );
  }

  const maxCount = Math.max(...data.weekly_activity.map(d => d.count), 1);

  return (
    <div className="insight-card progress-card">
      {header}

      {/* Stats */}
      <div className="pr-stats-row">
        <div className="pr-stat">
          <span className="pr-stat-value">{data.total_sessions}</span>
          <span className="pr-stat-label">Sessions</span>
        </div>
        <div className="pr-stat-divider" />
        <div className="pr-stat">
          <span className="pr-stat-value">{data.streak_days}</span>
          <span className="pr-stat-label">🔥 Day Streak</span>
        </div>
      </div>

      {/* Weekly bar chart */}
      <div className="pr-section-label">This Week</div>
      <div className="pr-bar-chart">
        {data.weekly_activity.map((d, i) => (
          <div key={i} className="pr-bar-col">
            <div className="pr-bar-track">
              <div
                className="pr-bar-fill"
                style={{ height: `${Math.round((d.count / maxCount) * 100)}%` }}
                title={`${d.count} session${d.count !== 1 ? 's' : ''}`}
              />
            </div>
            <span className="pr-bar-label">{d.day}</span>
          </div>
        ))}
      </div>

      {/* Recent topics */}
      {data.recent_topics.length > 0 && (
        <>
          <div className="pr-section-label">Recent Topics</div>
          <ul className="pr-topic-list">
            {data.recent_topics.map((t, i) => (
              <li key={i} className="pr-topic-item">
                <span className="pr-topic-dot" />
                <div className="pr-topic-info">
                  <span className="pr-topic-text">{t.topic}</span>
                  <span className="pr-topic-time">{t.timestamp}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {data.recent_topics.length === 0 && (
        <p className="pr-empty">Start chatting to build your progress! 🚀</p>
      )}
    </div>
  );
};

export default ProgressReport;
