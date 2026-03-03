import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { FaShieldAlt, FaInfoCircle, FaLock } from 'react-icons/fa';

const About = () => {
    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            width: '100vw',
            background: 'var(--bg-dark)',
            overflow: 'hidden',
            position: 'relative'
        }}>

            {/* --- SIDEBAR --- */}
            <aside style={{
                width: '260px',
                minWidth: '260px',
                background: '#001f3f', // Navy blue background
                padding: '40px 25px',
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid rgba(255,255,255,0.1)',
                height: '100vh',
                zIndex: 10,
                boxShadow: '4px 0 10px rgba(0,0,0,0.2)'
            }}>
                <div className="mb-5 text-center">
                    <Logo width={60} height={60} />
                    <h5 className="text-white mt-3 fw-bold">Kerala Police</h5>
                    <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', fontWeight: 'bold' }}>UNIT: INFO-PORTAL</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
                    <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '10px' }}>🏠 Home</Link>
                    <Link to="/about" style={{
                        color: 'rgba(255,255,255,0.9)',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        background: 'rgba(255,255,255,0.1)',
                        padding: '10px',
                        borderRadius: '8px',
                        borderLeft: '3px solid var(--secondary-color)'
                    }}>ℹ️ About</Link>
                </nav>

                <div className="mt-auto">
                    <Button as={Link} to="/register" style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }} className="w-100 rounded-pill py-2 fw-bold shadow">
                        Create Account
                    </Button>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main style={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 5,
                background: 'radial-gradient(circle at center, var(--bg-card) 0%, var(--bg-dark) 100%)'
            }}>
                <Container>
                    <div className="d-flex justify-content-center">
                        {/* BLACK BOX WITH GLOWING BORDER */}
                        <div className="card-custom shadow-custom" style={{
                            width: '100%',
                            maxWidth: '650px',
                            padding: '50px',
                            background: 'rgba(15, 23, 42, 0.8)',
                            borderRadius: '24px',
                            border: '1px solid rgba(0, 255, 136, 0.2)',
                            textAlign: 'center'
                        }}>
                            <div className="mb-4">
                                <FaInfoCircle size={40} color="#00ff88" className="mb-3" />
                                <h2 style={{ color: '#ffffff', fontWeight: '800', letterSpacing: '1px' }}>Portal Overview</h2>
                                <div style={{ width: '50px', height: '3px', background: '#00ff88', margin: '15px auto' }}></div>
                            </div>

                            <div style={{ color: '#ffffff', lineHeight: '1.8', fontSize: '1.05rem', textAlign: 'justify' }}>
                                <p>
                                    The <strong style={{ color: '#00ff88' }}>Kerala Police Citizen Safety Portal</strong> is a state-of-the-art digital infrastructure designed for the modern era of law enforcement.
                                </p>
                                <p>
                                    Our system integrates high-level encryption with real-time tracking to ensure that every report filed is processed with maximum efficiency and security.
                                </p>
                                <div style={{ display: 'flex', gap: '20px', marginTop: '30px', justifyContent: 'center' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <FaShieldAlt color="#00ff88" />
                                        <p style={{ fontSize: '0.7rem', marginTop: '5px' }}>Verified Safety</p>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <FaLock color="#00ff88" />
                                        <p style={{ fontSize: '0.7rem', marginTop: '5px' }}>Secure Data</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5">
                                <Button as={Link} to="/" variant="outline-light" className="rounded-pill px-5 py-2" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
                                    Return to Terminal
                                </Button>
                            </div>
                        </div>
                    </div>
                </Container>
            </main>
        </div>
    );
};

export default About;