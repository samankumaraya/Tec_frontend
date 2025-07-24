import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react'; // Optional icon package

const HomePage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ customers: 0, pendingJobs: 0, completedJobs: 0 });
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/dashboard-stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleViewProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user-profile'); // Adjust endpoint
      setProfile(res.data);
      setShowProfilePopup(true);
      setShowMenu(false); // close menu when opening profile
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    try {
      await axios.put('http://localhost:5000/api/update-profile', profile);
      alert('Profile updated successfully');
      setShowProfilePopup(false);
    } catch (err) {
      alert('Update failed');
    }
  };

  const buttons = [
    { label: 'Add Job Sheet', path: '/Add_jb', id: 'add' },
    { label: 'View Job Sheets', path: '/view_jb', id: 'view' },
    { label: 'Completed JOBS', path: '/view_com_jb', id: 'completed' },
  ];

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100vw' }}>
      {/* Background image with reduced opacity */}
      <div style={{
        backgroundColor: '#16a34a',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.2,   // reduced opacity
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none', // don't block interactions
      }} />

      {/* Actual content container */}
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <div style={topBarStyle}>
          <h1 style={titleStyle}>TECHNICAL <span style={{ color: 'black' }}>HUB</span></h1>

          <div
            style={{
              ...profileIconContainer,
              ...(showMenu ? profileIconContainerHover : {}),
            }}
            onClick={() => setShowMenu(!showMenu)}
            // Removed onMouseLeave to fix popup issue
          >
            <User color="black" size={28} />
            {showMenu && (
              <div style={dropdownMenuStyle}>
                <div style={dropdownItemStyle} onClick={() => navigate('/register')}>➕ Register</div>
                <hr style={dividerStyle} />
                <div style={dropdownItemStyle} onClick={handleViewProfile}>👤 Profile</div>
                <div style={dropdownItemStyle} onClick={() => navigate('/login')}>🚪 Logout</div>
              </div>
            )}
          </div>
        </div>

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

        {/* Profile Popup */}
        {showProfilePopup && profile && (
          <div style={popupOverlay}>
            <div style={popupContent}>
              <h2>Edit Profile</h2>
              {['firstName', 'lastName', 'email', 'phone'].map(field => (
                <div key={field}>
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type="text"
                    name={field}
                    value={profile[field] || ''}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </div>
              ))}
              <div style={{ marginTop: 20 }}>
                <button onClick={handleUpdateProfile} style={popupBtn}>Update</button>
                <button onClick={() => setShowProfilePopup(false)} style={popupBtn}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 🔧 Styles

const topBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const titleStyle = {
  color: 'red',
  fontSize: '3rem',
  margin: 0,
};

const profileIconContainer = {
  position: 'relative',
  cursor: 'pointer',
  backgroundColor: '#f0f0f0',
  padding: '6px 8px',
  borderRadius: '6px',
  display: 'inline-flex',
  alignItems: 'center',
  transition: 'background-color 0.3s ease',
};

const profileIconContainerHover = {
  backgroundColor: '#ddd',
};

const dropdownMenuStyle = {
  position: 'absolute',
  top: '40px',
  right: 0,
  background: 'white',
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '10px 0',
  zIndex: 100,
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  width: '160px',
};

const dropdownItemStyle = {
  padding: '10px 16px',
  cursor: 'pointer',
  fontSize: '1rem',
  color: '#333',
  transition: 'background 0.2s',
};

const dividerStyle = {
  margin: '5px 0',
  borderColor: '#eee',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '20px',
  marginTop: '40px',
  flexWrap: 'wrap',
  justifyContent: 'center',
};

const btnStyle = {
  padding: '16px 28px',
  fontSize: '1.2rem',
  background: '#fff',
  border: '1px solid #ccc',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

const statsGroupStyle = {
  display: 'flex',
  gap: '20px',
  marginTop: '40px',
  flexWrap: 'wrap',
  justifyContent: 'center',
};

const cardStyle = {
  background: '#eee',
  padding: '30px 20px',
  width: '200px',
  textAlign: 'center',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
};

const popupOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const popupContent = {
  background: '#fff',
  padding: '30px',
  borderRadius: '8px',
  width: '400px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '8px',
  marginBottom: '16px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const popupBtn = {
  marginRight: '10px',
  padding: '10px 20px',
  backgroundColor: '#388e3c',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

export default HomePage;
