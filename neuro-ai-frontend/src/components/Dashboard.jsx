import React from 'react';

const Dashboard = ({ userName }) => {
  const previousLessons = [
    { id: 1, title: "Introduction to React", date: "2024-03-20", status: "Completed" },
    { id: 2, title: "Understanding Hooks", date: "2024-03-22", status: "In Progress" },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome Back, {userName}</h1>
        <p>Your learning journey is 65% complete this week.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Daily Target</h3>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: '75%' }}></div>
          </div>
          <p>3/4 modules completed today</p>
        </div>

        <div className="stat-card">
          <h3>Focus Streak</h3>
          <div className="streak-badge">🔥 12 Days</div>
          <p>Consistency is key!</p>
        </div>
      </div>

      <section className="history-section">
        <h2>Previous Lessons</h2>
        <div className="lesson-list">
          {previousLessons.map(lesson => (
            <div key={lesson.id} className="lesson-card">
              <div>
                <h4>{lesson.title}</h4>
                <span>{lesson.date}</span>
              </div>
              <span className={`status-tag ${lesson.status.toLowerCase().replace(' ', '-')}`}>
                {lesson.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;