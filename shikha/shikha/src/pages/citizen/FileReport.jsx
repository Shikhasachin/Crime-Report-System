import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt } from 'react-icons/fa';
import { LocationPicker } from '../../components/MapComponents';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const FileReport = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        category: '',
        date: '',
        location: '',
        lat: null,
        lng: null,
        description: '',
        isAnonymous: false,
        evidence: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
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
            setFormData({
                ...formData,
                [name]: type === "checkbox" ? checked : value
            });
        }
    };

    const handleLocationSelect = (latlng) => {
        setFormData({
            ...formData,
            lat: latlng.lat,
            lng: latlng.lng,
            location: `Lat: ${latlng.lat.toFixed(4)}, Lng: ${latlng.lng.toFixed(4)}`
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("🚀 SUBMISSION INITIATED");
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const reportData = {
                category: formData.category,
                type: formData.category,
                description: formData.description,
                location: formData.location || "Not specified",
                lat: formData.lat || 0,
                lng: formData.lng || 0,
                date: formData.date,
                status: "Filed",
                userId: formData.isAnonymous ? "ANONYMOUS" : (user?._id || "VOLUNTEER"),
                isAnonymous: formData.isAnonymous,
                evidence: formData.evidence
            };

            console.log("📤 SENDING DATA TO API:", reportData);

            // Using 127.0.0.1 instead of localhost for Windows reliability
            const response = await axios.post(
                "/api/reports/submit",
                reportData
            );

            console.log("📥 SERVER RESPONSE:", response.data);

            if (response.status === 201 || response.status === 200) {
                setSuccess("INCIDENT LOGGED IN SECURE DATABASE");
                setTimeout(() => navigate('/citizen/track'), 2000);
            }
        } catch (err) {
            console.error("❌ SUBMISSION ERROR:", err);
            setError(err.response?.data?.message || "TERMINAL ERROR: DATABASE CONNECTION FAILED");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#001f3f', minHeight: '100vh', width: '100%', overflow: 'hidden', position: 'relative' }}>
            <style>
                {`
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(1000%); }
                }
                .animated-bg {
                    background: linear-gradient(135deg, #001f3f 0%, #003366 50%, #001f3f 100%);
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 40px 20px;
                }
                .scanner {
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
                .black-card {
                    background: #ffffff;
                    border: none;
                    border-radius: 20px;
                    padding: 45px;
                    width: 100%;
                    max-width: 720px;
                    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
                    z-index: 2;
                }
                .form-control-cyber {
                    background: #f8fafc !important;
                    border: 2px solid #e2e8f0 !important;
                    color: #1e293b !important;
                    border-radius: 8px !important;
                    font-weight: 600 !important;
                }
                .form-control-cyber:focus {
                    border-color: #001f3f !important;
                    box-shadow: 0 0 0 3px rgba(0, 31, 63, 0.15) !important;
                }
                `}
            </style>

            <div className="scanner"></div>

            <div className="animated-bg">
                <Container>
                    <div className="d-flex justify-content-center">
                        <div className="black-card">
                            <div className="text-center mb-4">
                                <FaShieldAlt size={50} color="#001f3f" className="mb-3" />
                                <h2 style={{ color: '#001f3f', fontWeight: '900', letterSpacing: '1px' }}>INCIDENT LOGGING</h2>
                                <p style={{ color: '#ffc107', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '2px' }}>DPT UNIT: KERALA STATE POLICE</p>
                            </div>

                            {error && <Alert variant="danger" className="py-2 small text-center fw-bold">{error}</Alert>}
                            {success && <Alert variant="success" className="py-2 small text-center fw-bold">{success}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Label className="small fw-bold text-dark">CRIME CATEGORY</Form.Label>
                                        <Form.Select
                                            className="form-control-cyber"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select crime category...</option>
                                            <option value="Theft">Theft</option>
                                            <option value="Assault">Assault</option>
                                            <option value="Cybercrime">Cybercrime</option>
                                            <option value="Robbery">Robbery</option>
                                            <option value="Harassment">Harassment</option>
                                            <option value="Missing Person">Missing Person</option>
                                            <option value="Fraud">Fraud</option>
                                            <option value="Other">Other</option>
                                        </Form.Select>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label className="small fw-bold text-dark">DATE OF INCIDENT</Form.Label>
                                        <Form.Control
                                            className="form-control-cyber"
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-dark">INCIDENT LOCATION</Form.Label>
                                    <Form.Control
                                        className="form-control-cyber"
                                        type="text"
                                        name="location"
                                        placeholder="Address or Terminal ID"
                                        value={formData.location}
                                        onChange={handleChange}
                                    />
                                    <div className="mt-2 rounded overflow-hidden" style={{ border: '2px solid #e2e8f0' }}>
                                        <LocationPicker onLocationSelect={handleLocationSelect} />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-dark">DETAILED DESCRIPTION</Form.Label>
                                    <Form.Control
                                        className="form-control-cyber"
                                        as="textarea"
                                        rows={4}
                                        name="description"
                                        placeholder="Enter all known details..."
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-dark">PHOTO EVIDENCE</Form.Label>
                                    <Form.Control
                                        className="form-control-cyber"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleChange}
                                    />
                                    {formData.evidence && (
                                        <div className="mt-2 text-center">
                                            <img src={formData.evidence} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '10px', border: '2px solid #e2e8f0' }} />
                                        </div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Check
                                        className="text-dark small fw-bold"
                                        type="checkbox"
                                        label="FILE ANONYMOUSLY"
                                        name="isAnonymous"
                                        id="anonymous-check"
                                        checked={formData.isAnonymous}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Button
                                    disabled={loading}
                                    style={{ background: '#001f3f', color: '#ffffff', border: 'none', borderRadius: '10px' }}
                                    type="submit"
                                    className="w-100 fw-bold py-3 shadow-sm"
                                >
                                    {loading ? 'UPLOADING TO SECURE DATABASE...' : '🚔 SUBMIT REPORT TO HEADQUARTERS'}
                                </Button>
                            </Form>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
};

export default FileReport;