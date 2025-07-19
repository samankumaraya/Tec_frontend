import React, { useState } from 'react';
import axios from 'axios';

const styles = {
  container: {
    maxWidth: '600px',
    margin: '30px auto',
    backgroundColor: '#d9f0d9', // light green background
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    backgroundColor: '#2e7d32', // dark green
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
    color: '#2e7d32',
  },
};

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [focused, setFocused] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFocus = (field) => {
    setFocused({ ...focused, [field]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/register', form);
      setMessage(res.data.message);
      setForm({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>🛠️ Register New User</div>
      <form onSubmit={handleSubmit}>
        {['firstName', 'lastName', 'phone', 'email', 'password', 'confirmPassword'].map((field) => (
          <div key={field} style={styles.formGroup}>
            <label htmlFor={field} style={styles.label}>
              {field === 'firstName'
                ? 'First Name'
                : field === 'lastName'
                ? 'Last Name'
                : field === 'phone'
                ? 'Phone Number'
                : field === 'email'
                ? 'Email'
                : field === 'password'
                ? 'Password'
                : 'Confirm Password'}
            </label>
            <input
              type={field.includes('password') ? 'password' : field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
              id={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
              onFocus={() => handleFocus(field)}
              style={{
                ...styles.input,
                ...(focused[field] ? styles.inputFocus : {}),
              }}
              required
            />
          </div>
        ))}
        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}
