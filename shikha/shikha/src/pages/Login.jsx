import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Form, Button, Tabs, Tab, Alert } from 'react-bootstrap';
import axios from 'axios';
import Logo from '../components/Logo';

const Login = () => {
    const [role, setRole] = useState('citizen');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState(null);
    const [userData, setUserData] = useState(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:5001/api/auth/login', { email, password });
            const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedOtp(mockOtp);
            setUserData(response.data.user);
            alert(`[SECURE ACCESS] Your code is: ${mockOtp}`);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Check server connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (otp === generatedOtp || otp === '123456') {
            login({ ...userData, role: role });
            navigate(role === 'citizen' ? '/citizen/dashboard' : '/police/dashboard');
        } else {
            setError('Invalid Code. Use 123456 for testing.');
        }
    };

    return (
        <div className="login-container" style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: '#ffffff', overflow: 'hidden' }}>
            {/* Theme CSS */}
            <style>
                {`
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(1000%); }
                }
                .animated-bg {
                    background: var(--bg-light);
                    flex-grow: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                }
                .scanner {
                    position: absolute;
                    width: 100%;
                    height: 5px;
                    background: rgba(255, 193, 7, 0.2);
                    box-shadow: 0 0 15px #ffc107;
                    top: 0;
                    left: 0;
                    animation: scanline 8s linear infinite;
                    z-index: 1;
                }
                .black-card {
                    background: #001f3f;
                    border: none;
                    border-radius: 20px;
                    padding: 45px;
                    width: 100%;
                    max-width: 460px;
                    box-shadow: 0 20px 40px rgba(0,31,63,0.3);
                    z-index: 2;
                }
                .custom-tabs .nav-link {
                    color: rgba(255, 255, 255, 0.7) !important;
                    border: none !important;
                    font-weight: 700;
                }
                .custom-tabs .nav-link.active {
                    color: #ffc107 !important;
                    background: transparent !important;
                    border-bottom: 3px solid #ffc107 !important;
                }
                `}
            </style>

            {/* --- SIDEBAR --- */}
            {/* --- SIDEBAR --- */}
            <aside style={{
                width: '260px',
                minWidth: '260px',
                background: '#001f3f', // Navy blue background
                padding: '40px 25px',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                zIndex: 10,
                borderRight: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '4px 0 15px rgba(0,0,0,0.5)'
            }}>
                <div className="mb-5 text-center">
                    <Logo width={70} height={70} />
                    <h5 className="mt-3 fw-bold text-white" style={{ letterSpacing: '1px' }}>KERALA POLICE</h5>
                    <p style={{ fontSize: '0.65rem', color: '#ffc107', fontWeight: 'bold', letterSpacing: '2px' }}>DATA TERMINAL</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', flexGrow: 1 }}>
                    <Link to="/" style={{
                        color: '#ffffff',
                        textDecoration: 'none',
                        padding: '12px 15px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        fontWeight: '700'
                    }}>Home</Link>
                    <Link to="/about" style={{
                        color: 'rgba(255,255,255,0.7)',
                        textDecoration: 'none',
                        padding: '10px 15px',
                        fontWeight: '500'
                    }}>About System</Link>
                </nav>

                <div className="mt-auto">
                    <Button as={Link} to="/register" style={{
                        background: '#ffc107',
                        color: '#0a0c0b',
                        border: 'none'
                    }} className="w-100 rounded-pill fw-bold py-2 shadow">
                        CREATE ACCOUNT
                    </Button>
                </div>
            </aside>

            {/* --- MAIN AREA --- */}
            <main className="animated-bg">
                <div className="scanner"></div>
                <Container>
                    <div className="d-flex justify-content-center">
                        <div className="black-card">
                            <div className="text-center mb-4">
                                <h2 style={{ color: '#ffffff', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                    {step === 1 ? 'Command Login' : 'Auth Verified'}
                                </h2>
                                <p style={{ color: 'rgba(255,193,7,0.8)', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>SECURE ACCESS TERMINAL</p>
                            </div>

                            {error && <Alert variant="danger" className="py-2 small text-center" style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4d4d', border: '1px solid #ff4d4d' }}>{error}</Alert>}

                            {step === 1 ? (
                                <Form onSubmit={handleLoginSubmit}>
                                    <Tabs activeKey={role} onSelect={(k) => setRole(k)} className="mb-4 justify-content-center border-0 custom-tabs">
                                        <Tab eventKey="citizen" title="CITIZEN PORTAL" />
                                        <Tab eventKey="police" title="OFFICIAL ACCESS" />
                                    </Tabs>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-bold text-white mb-2">IDENTIFICATION (EMAIL)</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', padding: '12px' }}
                                            required value={email} onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label className="small fw-bold text-white mb-2">SECURITY KEY (PASSWORD)</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="••••••••"
                                            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', padding: '12px' }}
                                            required value={password} onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Button disabled={loading} variant="warning" type="submit" className="w-100 fw-bold py-2 shadow border-0" style={{ color: '#001f3f' }}>
                                        {loading ? 'AUTHORIZING...' : 'AUTHORIZE ENTRY'}
                                    </Button>
                                </Form>
                            ) : (
                                <Form onSubmit={handleVerifyOtp}>
                                    <Form.Group className="mb-4 text-center">
                                        <Form.Label className="small mb-3 text-white">ENTER SECURITY TOKEN</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className="text-center fs-3 fw-bold"
                                            style={{ background: 'transparent', color: '#ffc107', letterSpacing: '10px', border: '2px solid #ffc107' }}
                                            maxLength={6} onChange={(e) => setOtp(e.target.value)} autoFocus
                                        />
                                    </Form.Group>
                                    <Button variant="warning" type="submit" className="w-100 mb-3 fw-bold py-2" style={{ color: '#001f3f' }}>VERIFY IDENTITY</Button>
                                    <Button variant="link" className="w-100 text-white opacity-50 small" onClick={() => setStep(1)}>&larr; CANCEL</Button>
                                </Form>
                            )}
                        </div>
                    </div>
                </Container>
            </main>
        </div>
    );
};

export default Login;