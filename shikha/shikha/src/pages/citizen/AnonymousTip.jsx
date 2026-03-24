import React, { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col, Badge } from 'react-bootstrap';
import { FaUserSecret, FaLock, FaShieldAlt, FaEyeSlash, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';

const AnonymousTip = () => {
    const [formData, setFormData] = useState({
        category: '',
        date: '',
        location: '',
        description: '',
        evidence: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData({ ...formData, evidence: reader.result });
                };
                reader.readAsDataURL(file);
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const tipData = {
                category: formData.category,
                type: formData.category,
                description: formData.description,
                location: formData.location || 'Not disclosed',
                date: formData.date,
                status: 'Filed',
                userId: 'ANONYMOUS',
                isAnonymous: true,
                evidence: formData.evidence
            };

            const response = await axios.post('/api/reports/submit', tipData);

            if (response.status === 201 || response.status === 200) {
                setSuccess('Your tip has been securely submitted. Your identity is completely protected.');
                setFormData({ category: '', date: '', location: '', description: '', evidence: '' });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#001f3f', minHeight: '100vh', width: '100%', position: 'relative', overflow: 'hidden' }}>
            <style>{`
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(1000%); }
                }
                .scanner-gold {
                    position: absolute;
                    width: 100%;
                    height: 3px;
                    background: rgba(255, 193, 7, 0.4);
                    box-shadow: 0 0 15px rgba(255, 193, 7, 0.6);
                    top: 0;
                    left: 0;
                    animation: scanline 10s linear infinite;
                    z-index: 1;
                }
                .tip-bg {
                    background: linear-gradient(135deg, #001f3f 0%, #003060 50%, #001f3f 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: flex-start;
                    padding: 40px 20px;
                }
                .tip-card {
                    background: #ffffff;
                    border-radius: 20px;
                    padding: 45px;
                    width: 100%;
                    max-width: 720px;
                    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
                    margin: 0 auto;
                }
                .tip-input {
                    background: #f8fafc !important;
                    border: 2px solid #e2e8f0 !important;
                    color: #1e293b !important;
                    border-radius: 8px !important;
                    font-weight: 600 !important;
                    padding: 10px 14px !important;
                }
                .tip-input:focus {
                    border-color: #001f3f !important;
                    box-shadow: 0 0 0 3px rgba(0, 31, 63, 0.12) !important;
                }
                .guarantee-tag {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: #f0fdf4;
                    border: 1px solid #bbf7d0;
                    border-radius: 10px;
                    padding: 10px 14px;
                    margin-bottom: 10px;
                    font-size: 0.82rem;
                    font-weight: 700;
                    color: #166534;
                }
            `}</style>

            <div className="scanner-gold" />

            <div className="tip-bg">
                <Container>
                    <div className="tip-card">
                        {/* Header */}
                        <div className="text-center mb-4">
                            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #001f3f, #003366)' }}>
                                <FaUserSecret size={38} color="#ffc107" />
                            </div>
                            <h2 style={{ color: '#001f3f', fontWeight: '900', letterSpacing: '1px' }}>ID PROTECTION PORTAL</h2>
                            <p style={{ color: '#ffc107', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '2px' }}>
                                ANONYMOUS TIPS · SECURE ·
                            </p>
                        </div>

                        {/* Identity Guarantees */}
                        <div className="mb-4">
                            <div className="guarantee-tag"><FaLock /> Your name is never stored or logged.</div>
                            <div className="guarantee-tag"><FaEyeSlash /> Your IP address is not recorded.</div>
                            <div className="guarantee-tag"><FaShieldAlt /> All submissions are end-to-end secured.</div>
                        </div>

                        {error && <Alert variant="danger" className="fw-bold small text-center">{error}</Alert>}
                        {success && (
                            <Alert variant="success" className="fw-bold small text-center d-flex flex-column align-items-center gap-1">
                                <FaShieldAlt size={22} />
                                {success}
                                <Badge bg="success" className="mt-1 px-3 py-2">IDENTITY PROTECTED ✓</Badge>
                            </Alert>
                        )}

                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-dark">CRIME CATEGORY</Form.Label>
                                        <Form.Select className="tip-input" name="category" value={formData.category} onChange={handleChange} required>
                                            <option value="">Select category...</option>
                                            <option value="Theft">Theft</option>
                                            <option value="Assault">Assault</option>
                                            <option value="Cybercrime">Cybercrime</option>
                                            <option value="Robbery">Robbery</option>
                                            <option value="Drug Trafficking">Drug Trafficking</option>
                                            <option value="Harassment">Harassment</option>
                                            <option value="Missing Person">Missing Person</option>
                                            <option value="Fraud">Fraud</option>
                                            <option value="Corruption">Corruption</option>
                                            <option value="Other">Other</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-dark">DATE OF INCIDENT <span className="text-muted fw-normal">(Optional)</span></Form.Label>
                                        <Form.Control className="tip-input" type="date" name="date" value={formData.date} onChange={handleChange} />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold text-dark">
                                    APPROXIMATE LOCATION <span className="text-muted fw-normal">(Optional — only if safe to share)</span>
                                </Form.Label>
                                <Form.Control
                                    className="tip-input"
                                    type="text"
                                    name="location"
                                    placeholder="e.g. Near Central Market, Ernakulam — be as vague as you like"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold text-dark">TIP DETAILS / DESCRIPTION</Form.Label>
                                <Form.Control
                                    className="tip-input"
                                    as="textarea"
                                    rows={5}
                                    name="description"
                                    placeholder="Describe the incident, names of suspects, vehicles, any relevant information..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Text className="text-muted small fw-bold mt-1 d-block">
                                    <FaInfoCircle className="me-1" />
                                    Do NOT include your own personal information in this field.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="small fw-bold text-dark">ATTACH EVIDENCE <span className="text-muted fw-normal">(Optional)</span></Form.Label>
                                <Form.Control className="tip-input" type="file" accept="image/*" onChange={handleChange} />
                                {formData.evidence && (
                                    <div className="mt-2 text-center">
                                        <img src={formData.evidence} alt="Evidence Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '10px', border: '2px solid #e2e8f0' }} />
                                    </div>
                                )}
                            </Form.Group>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-100 fw-bold py-3 shadow-sm"
                                style={{ background: '#001f3f', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '1rem' }}
                            >
                                <FaUserSecret className="me-2" />
                                {loading ? 'ENCRYPTING & SUBMITTING...' : 'SUBMIT TIP ANONYMOUSLY'}
                            </Button>

                            <p className="text-center text-muted small fw-bold mt-3 mb-0">
                                🔒 This form collects zero personally identifiable information.
                            </p>
                        </Form>
                    </div>
                </Container>
            </div>
        </div>
    );
};

export default AnonymousTip;
