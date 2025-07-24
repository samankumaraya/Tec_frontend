import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23e0e0e0%22 font-size=%2240%22 font-family=%22Arial%22 transform=%22rotate(-45, 200, 200)%22>Technical Hub</text></svg>')",
    backgroundRepeat: 'repeat',
    backgroundSize: '400px 400px',
    padding: '30px 0',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#e8f5e9',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    backgroundColor: '#2e7d32',
    color: 'white',
    padding: '15px',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    borderRadius: '6px 6px 0 0',
    textAlign: 'center',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '6px',
    fontWeight: '600',
    color: '#1b5e20',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #a5d6a7',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  inputFocus: {
    borderColor: '#388e3c',
  },
  button: {
    backgroundColor: '#388e3c',
    color: 'white',
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '1.1rem',
    marginTop: '10px',
  },
  message: {
    marginTop: '15px',
    textAlign: 'center',
    fontWeight: '600',
    color: '#d32f2f',
  },
  success: {
    color: '#2e7d32',
  }
};

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [focused, setFocused] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleFocus = (field) => {
    setFocused({ ...focused, [field]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/admin-login', form);
      setSuccess(true);
      setMessage(res.data.message);

      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 1000);

      setForm({ email: '', password: '' });
    } catch (err) {
      setSuccess(false);
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.header}>🔐 Admin Login</div>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onFocus={() => handleFocus('email')}
              style={{
                ...styles.input,
                ...(focused.email ? styles.inputFocus : {}),
              }}
              autoComplete="off"
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => handleFocus('password')}
              style={{
                ...styles.input,
                ...(focused.password ? styles.inputFocus : {}),
              }}
              autoComplete="new-password"
              required
            />
          </div>
          <button type="submit" style={styles.button}>Login</button>
        </form>

        {/* Message (success or error) */}
        {message && (
          <p style={{ ...styles.message, ...(success ? styles.success : {}) }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
