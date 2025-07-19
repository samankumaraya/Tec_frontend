import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- add this

const styles = {
  container: {
    maxWidth: '600px',
    margin: '30px auto',
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

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [focused, setFocused] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate(); // <-- initialize hook

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
      const res = await axios.post('http://localhost:5000/api/login', form);
      setSuccess(true);
      setMessage(res.data.message);

      // optional: store token or user info here if needed
      setTimeout(() => {
        navigate('/home'); // <-- redirect to home
      }, 1000); // wait 1 second before redirecting

      setForm({ email: '', password: '' });
    } catch (err) {
      setSuccess(false);
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>🔐 Login</div>
      <form onSubmit={handleSubmit}>
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
            required
          />
        </div>
        <button type="submit" style={styles.button}>Login</button>
      </form>
      {message && (
        <p style={{ ...styles.message, ...(success ? styles.success : {}) }}>
          {message}
        </p>
      )}
    </div>
  );
}
