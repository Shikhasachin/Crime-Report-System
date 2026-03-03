import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { FaPhoneAlt, FaExclamationTriangle, FaUserSecret } from 'react-icons/fa';

import wanted1 from '../../assets/wanted1.png';
import wanted2 from '../../assets/wanted2.png';
import wanted3 from '../../assets/wanted3.png';

const SafetyInfo = () => {
    const [alerts, setAlerts] = useState([]);
    const [activeTab, setActiveTab] = useState('wanted');

    useEffect(() => {
        const storedAlerts = JSON.parse(localStorage.getItem('public_alerts') || '[]');
        if (storedAlerts.length === 0) {
            // Default demo alert if none exist
            setAlerts([{ id: 0, text: "Red Alert declared in Idukki and Ernakulam districts. Avoiding hilly ranges is advised.", type: 'danger', date: new Date().toLocaleDateString() }]);
        } else {
            setAlerts(storedAlerts);
        }
    }, []);

    return (
        <Container className="py-5">
            <div className="mb-5 text-center">
                <h2 className="fw-bold">Public Safety Information</h2>
                <p className="text-subtle">Stay informed and stay safe with these resources.</p>
            </div>

            <Row className="mb-4">
                <Col md={12}>
                    {alerts.map(alert => (
                        <Alert key={alert.id} variant={alert.type || 'danger'} className="d-flex align-items-center mb-3 border-0 shadow-sm">
                            <FaExclamationTriangle size={24} className="me-3" />
                            <div>
                                <h5 className="alert-heading fw-bold mb-1">Public Announcement ({alert.date})</h5>
                                <p className="mb-0">{alert.text}</p>
                            </div>
                        </Alert>
                    ))}
                </Col>
            </Row>

            <Row className="g-4 mb-5">
                <Col md={6}>
                    <Card className="card-custom border-0 h-100">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center mb-3 text-primary">
                                <FaPhoneAlt size={24} className="me-2" />
                                <h4 className="fw-bold mb-0">Emergency Contacts</h4>
                            </div>
                            <ul className="list-unstyled">
                                <li className="mb-3 border-bottom pb-2 d-flex justify-content-between">
                                    <span className="fw-medium">Police Control Room</span>
                                    <span className="fw-bold text-danger">100</span>
                                </li>
                                <li className="mb-3 border-bottom pb-2 d-flex justify-content-between">
                                    <span className="fw-medium">Fire Brigade</span>
                                    <span className="fw-bold text-danger">101</span>
                                </li>
                                <li className="mb-3 border-bottom pb-2 d-flex justify-content-between">
                                    <span className="fw-medium">Ambulance</span>
                                    <span className="fw-bold text-danger">102</span>
                                </li>
                                <li className="d-flex justify-content-between">
                                    <span className="fw-medium">Women Helpline ("Mitra")</span>
                                    <span className="fw-bold text-danger">1091 / 181</span>
                                </li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="card-custom border-0 h-100">
                        <Card.Body className="p-4">
                            <ul className="nav nav-tabs mb-4">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'wanted' ? 'active fw-bold' : 'text-muted'}`}
                                        onClick={() => setActiveTab('wanted')}
                                    >
                                        <FaUserSecret className="me-2" />Most Wanted
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'missing' ? 'active fw-bold' : 'text-muted'}`}
                                        onClick={() => setActiveTab('missing')}
                                    >
                                        Missing Persons
                                    </button>
                                </li>
                            </ul>

                            {activeTab === 'wanted' ? (
                                <Row>
                                    <Col xs={4}>
                                        <div className="ratio ratio-1x1 rounded-3 overflow-hidden border mb-2">
                                            <img src={wanted1} alt="Wanted" className="w-100 h-100 object-fit-cover" />
                                        </div>
                                        <p className="small text-center fw-medium mb-0">Shibu 'Spider'</p>
                                        <p className="text-center text-muted" style={{ fontSize: '0.7rem' }}>Robbery</p>
                                    </Col>
                                    <Col xs={4}>
                                        <div className="ratio ratio-1x1 rounded-3 overflow-hidden border mb-2">
                                            <img src={wanted2} alt="Wanted" className="w-100 h-100 object-fit-cover" />
                                        </div>
                                        <p className="small text-center fw-medium mb-0">Saritha S.</p>
                                        <p className="text-center text-muted" style={{ fontSize: '0.7rem' }}>Fraud</p>
                                    </Col>
                                    <Col xs={4}>
                                        <div className="ratio ratio-1x1 rounded-3 overflow-hidden border mb-2">
                                            <img src={wanted3} alt="Wanted" className="w-100 h-100 object-fit-cover" />
                                        </div>
                                        <p className="small text-center fw-medium mb-0">Unknown</p>
                                        <p className="text-center text-muted" style={{ fontSize: '0.7rem' }}>Cybercrime</p>
                                    </Col>
                                </Row>
                            ) : (
                                <Row>
                                    <Col xs={4}>
                                        <div className="ratio ratio-1x1 rounded-3 overflow-hidden border mb-2 bg-light d-flex align-items-center justify-content-center">
                                            <span className="text-muted small">Photo</span>
                                        </div>
                                        <p className="small text-center fw-medium mb-0">Raju K.</p>
                                        <p className="text-center text-muted" style={{ fontSize: '0.7rem' }}>Age: 12</p>
                                    </Col>
                                    <Col xs={4}>
                                        <div className="ratio ratio-1x1 rounded-3 overflow-hidden border mb-2 bg-light d-flex align-items-center justify-content-center">
                                            <span className="text-muted small">Photo</span>
                                        </div>
                                        <p className="small text-center fw-medium mb-0">Meena L.</p>
                                        <p className="text-center text-muted" style={{ fontSize: '0.7rem' }}>Age: 65</p>
                                    </Col>
                                    <Col xs={12} className="mt-3">
                                        <Alert variant="info" className="small py-2 mb-0">
                                            If you have seen these individuals, please report anonymously or contact control room.
                                        </Alert>
                                    </Col>
                                </Row>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="card-custom border-0 bg-primary text-white p-4 text-center" style={{ background: 'linear-gradient(135deg, #FF385C 0%, #bd1f3f 100%)' }}>
                <h3 className="fw-bold">Report Suspicious Activity</h3>
                <p className="mb-0 opacity-75">If you see something, say something. Your anonymity is guaranteed.</p>
            </Card>
        </Container>
    );
};

export default SafetyInfo;
