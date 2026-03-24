import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'citizen'
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(
                '/api/auth/register',
                formData
            );

            if (response.status === 201) {
                alert('Registration Successful!');
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container" style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: '#ffffff', overflow: 'hidden' }}>
            {/* Theme CSS */}
            <style>
                {`
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(1000%); }
                }
                .animated-bg {
                    background: #ffffff;
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
                    border: 2px solid #ffc107;
                    border-radius: 20px;
                    padding: 40px;
                    width: 100%;
                    max-width: 500px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    z-index: 2;
                }
                .form-control-cyber {
                    background: rgba(255,255,255,0.05) !important;
                    border: 1px solid rgba(255,255,255,0.2) !important;
                    color: white !important;
                    border-radius: 8px !important;
                }
                .form-control-cyber:focus {
                    border-color: #ffc107 !important;
                    box-shadow: 0 0 8px rgba(255, 193, 7, 0.3) !important;
                }
                `}
            </style>

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
                boxShadow: '4px 0 10px rgba(0,0,0,0.5)'
            }}>
                <div className="mb-5 text-center">
                    <Logo width={70} height={70} />
                    <h5 className="mt-3 fw-bold text-white" style={{ letterSpacing: '1px' }}>KERALA POLICE</h5>
                    <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', fontWeight: 'bold', letterSpacing: '2px' }}>DATA TERMINAL</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', flexGrow: 1 }}>
                    <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '10px 15px', fontWeight: '500' }}>Home</Link>
                    <Link to="/about" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '10px 15px', fontWeight: '500' }}>About System</Link>
                </nav>

                <div className="mt-auto">
                    <Button as={Link} to="/" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.2)' }} className="w-100 rounded-pill fw-bold py-2">
                        BACK TO LOGIN
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
                                <h2 style={{ color: '#ffffff', fontWeight: '800', letterSpacing: '1px' }}>CREATING ACCOUNT</h2>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>ENROLL IN SECURE PORTAL</p>
                            </div>

                            {error && <Alert variant="danger" className="py-2 small text-center" style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4d4d', border: '1px solid #ff4d4d' }}>{error}</Alert>}

                            <Form onSubmit={handleRegister}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-white">USERNAME</Form.Label>
                                    <Form.Control
                                        className="form-control-cyber"
                                        type="text"
                                        placeholder="Pick a unique ID"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-white">EMAIL ADDRESS</Form.Label>
                                    <Form.Control
                                        className="form-control-cyber"
                                        type="email"
                                        placeholder="security@terminal.gov"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-bold text-white">PASSWORD</Form.Label>
                                    <Form.Control
                                        className="form-control-cyber"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Button disabled={loading} variant="warning" type="submit" className="w-100 fw-bold py-2 shadow border-0" style={{ color: '#001f3f' }}>
                                    {loading ? 'ENROLLING...' : 'ENROLL SYSTEM'}
                                </Button>

                                <div className="text-center mt-4">
                                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>IDENTIFIED ALREADY? </span>
                                    <Link to="/" style={{ color: '#ffc107', textDecoration: 'none', fontWeight: 'bold' }}>
                                        LOGIN
                                    </Link>
                                </div>
                            </Form>
                        </div>
                    </div>
                </Container>
            </main>
        </div>
    );
};

export default Register;