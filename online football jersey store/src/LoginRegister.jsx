import { useState } from 'react';
import './LoginRegister.css';
import { register, login } from './services/api';

// Use public path instead of import
const logo = '/assets/logo.png';

function LoginRegister({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    dob: '',
    gender: '',
    phone: '',
    address: '',
    city: '',
    country: 'Nepal',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // ============ LOGIN WITH BACKEND API ============
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const response = await login({
        email: formData.email,
        password: formData.newPassword
      });
      
      if (response.data.success) {
        setSuccess('✅ Login successful! Redirecting...');
        setTimeout(() => {
          onLogin(response.data.user, response.data.token);
        }, 1500);
      }
    } catch (error) {
      setError(error.response?.data?.message || '❌ Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ============ CALCULATE AGE ============
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // ============ REGISTER WITH BACKEND API ============
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    // ===== VALIDATION =====
    if (!formData.fullName || !formData.email || !formData.newPassword || !formData.dob || !formData.gender) {
      setError('Please fill all required fields!');
      setLoading(false);
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters!');
      setLoading(false);
      return;
    }
    
    const age = calculateAge(formData.dob);
    if (age < 13) {
      setError('You must be at least 13 years old to register!');
      setLoading(false);
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address!');
      setLoading(false);
      return;
    }
    
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number!');
      setLoading(false);
      return;
    }
    
    // ===== SEND TO BACKEND =====
    try {
      const response = await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.newPassword,
        dob: formData.dob,
        gender: formData.gender,
        phone: formData.phone || '',
        address: formData.address || '',
        city: formData.city || '',
        country: formData.country || 'Nepal'
      });
      
      if (response.data.success) {
        setSuccess('✅ Registration successful! Please login.');
        setTimeout(() => {
          setIsLogin(true);
          setFormData({
            email: '',
            password: '',
            fullName: '',
            dob: '',
            gender: '',
            phone: '',
            address: '',
            city: '',
            country: 'Nepal',
            newPassword: '',
            confirmPassword: '',
          });
          setSuccess('');
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || '❌ Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <img 
              src={logo} 
              alt="Jersey Hub Logo" 
              style={{ 
                width: '45px', 
                height: '45px', 
                objectFit: 'contain',
                marginRight: '10px'
              }} 
            />
            JERSEY HUB
          </div>
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
            >
              Login
            </button>
            <button 
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
            >
              Register
            </button>
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        {isLogin ? (
          // ============ LOGIN FORM ============
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group password-group">
              <label>Password *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <button 
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            <p className="auth-footer">
              Don't have an account?{' '}
              <span onClick={() => setIsLogin(false)}>Register here</span>
            </p>

            {/* ========== ADMIN LOGIN LINK ========== */}
            <div className="admin-login-divider">
              <span>or</span>
            </div>
            <a href="/admin-login" className="admin-login-link">
              👑 Login as Admin
            </a>
          </form>
        ) : (
          // ============ REGISTER FORM ============
          <form onSubmit={handleRegister} className="auth-form register-form">
            <div className="form-row">
              <div className="form-group half">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group half">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group half">
                <label>Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9800000000 (10 digits)"
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
              />
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Kathmandu, Pokhara, etc."
                />
              </div>

              <div className="form-group half">
                <label>Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="Nepal">Nepal</option>
                  <option value="India">India</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half password-group">
                <label>Password *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    required
                  />
                  <button 
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div className="form-group half password-group">
                <label>Confirm Password *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                  <button 
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>
            </div>

            <div className="terms">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            
            <p className="auth-footer">
              Already have an account?{' '}
              <span onClick={() => setIsLogin(true)}>Login here</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginRegister;