import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import "../auth.form.scss";
import { useAuth } from '../hooks/useAuth';
import Loader from '../../components/Loader';

const VerifyOtp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, handleVerifyOtp, handleResendOtp } = useAuth();

    // Retrieve email passed via navigation state or query params
    const email = location.state?.email || new URLSearchParams(location.search).get('email') || "";

    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    // If no email is associated, redirect back to registration
    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    // Resend countdown timer
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleVerifyOtp({ email, otp });
            navigate('/');
        } catch (err) {
            // Handled in useAuth toast
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
        try {
            await handleResendOtp({ email });
            setTimer(60);
            setCanResend(false);
        } catch (err) {
            // Handled in useAuth toast
        }
    };

    if (loading) {
        return <Loader text="Verifying code..." />;
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                
                {/* Left Panel: Verification Form */}
                <div className="auth-card__form">
                    <h1>Verify Your Email</h1>
                    <p className="sub-text">
                        We sent a 6-digit verification code to <strong>{email}</strong>.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="otp">Enter 6-Digit Code</label>
                            <input
                                id="otp"
                                name="otp"
                                type="text"
                                maxLength={6}
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.trim())}
                                style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '1.25rem' }}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="button primary-button"
                            disabled={otp.length !== 6}
                        >
                            Verify & Proceed
                        </button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>
                            Didn't receive the code?{' '}
                            {canResend ? (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#4F46E5',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        textDecoration: 'underline'
                                    }}
                                >
                                    Resend Code
                                </button>
                            ) : (
                                <span>Resend in <strong>{timer}s</strong></span>
                            )}
                        </p>
                    </div>

                    <p className="toggle-link">
                        Wrong email address? <Link to="/register">Sign up again</Link>
                    </p>
                </div>

                {/* Right Panel: App Info */}
                <div className="auth-card__info">
                    <h2>Master Your Next Interview with <span>AI</span></h2>
                    <p className="description">
                        Confirming your email ensures your practice session records, personalized roadmaps, and custom feedback remain secure.
                    </p>

                    <div className="feature-list">
                        <div className="feature-item">
                            <span className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            </span>
                            <div>
                                <h4>Account Security</h4>
                                <p>Prevent unauthorized access and protect your generated interview history.</p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <span className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path></svg>
                            </span>
                            <div>
                                <h4>Session Updates</h4>
                                <p>Receive reminders and performance summaries straight to your inbox.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default VerifyOtp;