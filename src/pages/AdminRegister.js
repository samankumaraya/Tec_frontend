import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    backgroundColor: '#e8f5e9',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
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
  },
  error: {
    color: '#d32f2f',
  },
  success: {
    color: '#2e7d32',
  },
};

export default function AdminRegister() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setIsSuccess(false);
      setMessage('Please fill all fields');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setIsSuccess(false);
      setMessage('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/admin/register', form);
      setIsSuccess(true);
      setMessage(res.data.message);

      setTimeout(() => {
        navigate('/admin'); // Redirect to admin login page
      }, 1500);
    } catch (error) {
      setIsSuccess(false);
      setMessage(
        error.response?.data?.message || 'Registration failed'
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>🛡️ Admin Register</div>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="username" style={styles.label}>Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <button type="submit" style={styles.button}>Register</button>
      </form>

      {message && (
        <p
          style={{
            ...styles.message,
            ...(isSuccess ? styles.success : styles.error),
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
