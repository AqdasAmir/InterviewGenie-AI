import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import Loader from '../../components/Loader'

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleRegister({ username, email, password })
        navigate("/")
    }

    if (loading) {
        return (<Loader text="Creating your account..." />)
    }

    return (
        <div className="auth-page">
            <div className="auth-card">

                {/* Left Panel: Register Form */}
                <div className="auth-card__form">
                    <h1>Create an Account</h1>
                    <p className="sub-text">Start your journey to acing your next interview.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                onChange={(e) => setUsername(e.target.value)}
                                type="text" id="username" name='username' placeholder='Choose a username' required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                type="email" id="email" name='email' placeholder='name@example.com' required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                type="password" id="password" name='password' placeholder='Create a strong password' required />
                        </div>

                        <button className='button primary-button'>Register</button>
                    </form>

                    <p className="toggle-link">
                        Already have an account? <Link to={"/login"}>Log in</Link>
                    </p>
                </div>

                {/* Right Panel: App Info */}
                <div className="auth-card__info">
                    <h2>Master Your Next Interview with <span>AI</span></h2>
                    <p className="description">
                        Join today to analyze job descriptions against your resume, uncover skill gaps, and practice with realistic mock interviews.
                    </p>

                    <div className="feature-list">
                        <div className="feature-item">
                            <span className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </span>
                            <div>
                                <h4>Smart Preparation Plans</h4>
                                <p>Get a custom day-by-day roadmap, tailored questions, and identified skill gaps instantly.</p>
                            </div>
                        </div>
                        
                        <div className="feature-item">
                            <span className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            </span>
                            <div>
                                <h4>Interactive Mock Sessions</h4>
                                <p>Practice answering technical and behavioral questions with real-time AI evaluation and feedback.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Register