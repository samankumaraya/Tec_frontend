import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundImage: `url("data:image/svg+xml;utf8,
      <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' 
              fill='rgba(255, 0, 0, 0.05)' font-size='50' font-family='Arial' transform='rotate(-30, 200, 200)'>
          Technical Hub
        </text>
        <text x='50%' y='70%' dominant-baseline='middle' text-anchor='middle' 
              fill='rgba(0, 0, 255, 0.05)' font-size='50' font-family='Arial' transform='rotate(-30, 200, 200)'>
          Technical Hub
        </text>
      </svg>")`,
    backgroundRepeat: 'repeat',
    backgroundSize: '400px 400px',
    padding: '30px 0',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#d9f0d9',
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
  loginBtn: {
    marginTop: '15px',
    backgroundColor: '#1b5e20',
    color: 'white',
    padding: '10px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    width: '100%',
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
  const navigate = useNavigate();

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

      // Delay 1 second and redirect to login
      setTimeout(() => {
        navigate('/');
      }, 1000);

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

  const goToLogin = () => {
    navigate('/');
  };

  return (
    <div style={styles.pageWrapper}>
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
                type={
                  field.includes('password')
                    ? 'password'
                    : field === 'email'
                    ? 'email'
                    : field === 'phone'
                    ? 'tel'
                    : 'text'
                }
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

        {/* Login Button */}
        <button onClick={goToLogin} style={styles.loginBtn}>
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}
