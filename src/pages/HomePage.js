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

  useEffect(() => {
    axios.get('http://localhost:5000/api/dashboard')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>
        TECHNICAL <span style={{ color: 'black' }}>HUB</span>
      </h1>

      <div style={buttonGroupStyle}>
        <button style={btnStyle} onClick={() => navigate('/Add_jb')}>Add Job Sheet</button>
        <button style={btnStyle}>View Job Sheets</button>
        <button style={btnStyle}>Completed JOBS</button>
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

// Full page container with flex column layout, centered horizontally and vertically
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

// Title with responsive font size
const titleStyle = {
  color: 'red',
  fontSize: '3rem',
  margin: 0,
  userSelect: 'none',
};

// Buttons container with gap and wrap for small screens
const buttonGroupStyle = {
  display: 'flex',
  gap: '20px',
  marginTop: '40px',
  flexWrap: 'wrap',
  justifyContent: 'center',
  width: '100%',
  maxWidth: '600px',
};

// Responsive button style
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

btnStyle[':hover'] = {
  backgroundColor: '#e0e0e0',
};

// Stats cards container with gap and wrap
const statsGroupStyle = {
  display: 'flex',
  gap: '20px',
  marginTop: '40px',
  flexWrap: 'wrap',
  justifyContent: 'center',
  width: '100%',
  maxWidth: '700px',
};

// Individual card style with responsive width
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
