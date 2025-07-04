import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    customers: 0,
    pendingJobs: 0,
    completedJobs: 0,
  });

  // Button hover state to mimic CSS :hover with inline styles
  const [hoveredBtn, setHoveredBtn] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/dashboard-stats') // Make sure backend path matches
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  const buttons = [
    { label: 'Add Job Sheet', path: '/Add_jb', id: 'add' },
    { label: 'View Job Sheets', path: '/view_jb', id: 'view' },
    { label: 'Completed JOBS', path: '/view_com_jb', id: 'completed' },
  ];

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>
        TECHNICAL <span style={{ color: 'black' }}>HUB</span>
      </h1>

      <div style={buttonGroupStyle}>
        {buttons.map(({ label, path, id }) => (
          <button
            key={id}
            style={{
              ...btnStyle,
              backgroundColor: hoveredBtn === id ? '#e0e0e0' : '#fff',
            }}
            onClick={() => navigate(path)}
            onMouseEnter={() => setHoveredBtn(id)}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={statsGroupStyle}>
        <div style={cardStyle}>
          <div>No of Customers</div>
          <h2>{stats.customers}</h2>
        </div>
        <div style={cardStyle}>
          <div>Pending Jobs</div>
          <h2>{stats.pendingJobs}</h2>
        </div>
        <div style={cardStyle}>
          <div>No of Completed Jobs</div>
          <h2>{stats.completedJobs}</h2>
        </div>
      </div>
    </div>
  );
};

// Your original styles here:
const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  background: '#f5f5f5',
  minHeight: '100vh',       // full viewport height
  width: '100vw',           // full viewport width
  padding: '40px 20px',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const titleStyle = {
  color: 'red',
  fontSize: '3rem',
  margin: 0,
  userSelect: 'none',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '20px',
  marginTop: '40px',
  flexWrap: 'wrap',
  justifyContent: 'center',
  width: '100%',
  maxWidth: '600px',
};

const btnStyle = {
  padding: '16px 28px',
  fontSize: '1.2rem',
  background: '#fff',
  border: '1px solid #ccc',
  borderRadius: '6px',
  cursor: 'pointer',
  flex: '1 1 180px', // grow and shrink with minimum width 180px
  transition: 'background-color 0.3s ease',
};

const statsGroupStyle = {
  display: 'flex',
  gap: '20px',
  marginTop: '40px',
  flexWrap: 'wrap',
  justifyContent: 'center',
  width: '100%',
  maxWidth: '700px',
};

const cardStyle = {
  background: '#eee',
  padding: '30px 20px',
  width: '200px',
  textAlign: 'center',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  flex: '1 1 180px',
  userSelect: 'none',
};

export default HomePage;
