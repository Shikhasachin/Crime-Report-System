import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFileSignature, FaSearchLocation, FaShieldAlt, FaUserSecret, FaHistory, FaPhoneAlt, FaExclamationTriangle, FaUserSlash, FaUsers, FaChartArea } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [wanted, setWanted] = useState([]);
    const [loading, setLoading] = useState(true);

    const trendData = [
        { month: 'Jan', rate: 45 }, { month: 'Feb', rate: 52 },
        { month: 'Mar', rate: 38 }, { month: 'Apr', rate: 29 },
        { month: 'May', rate: 34 }, { month: 'Jun', rate: 22 } // Dropping crime rate shows police effectiveness!
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [repRes, alertRes, wantedRes] = await Promise.all([
                    axios.get('/api/reports'),
                    axios.get('/api/alerts'),
                    axios.get('/api/criminal-records')
                ]);

                // Filter reports for the current user
                const userReports = repRes.data.filter(r => r.userId === user?._id || r.userId === user?.email);
                setReports(userReports);
                setAlerts(alertRes.data);
                setWanted(wantedRes.data.filter(c => c.status === 'Wanted'));
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchDashboardData();
    }, [user]);

    const ActionCard = ({ title, icon, description, link, btnText, color }) => (
        <Card className="h-100 card-custom shadow-sm border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
            <div style={{ height: '4px', background: color, width: '100%' }}></div>
            <Card.Body className="p-4 d-flex flex-column align-items-center text-center">
                <div className="mb-3 rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '70px', height: '70px', backgroundColor: `${color}15`, color: color, boxShadow: `0 0 20px ${color}15` }}>
                    {icon}
                </div>
                <Card.Title className="fw-bold mb-2 text-uppercase" style={{ letterSpacing: '0.5px' }}>{title}</Card.Title>
                <Card.Text className="small mb-4 opacity-75">{description}</Card.Text>
                <Button as={Link} to={link} style={{ backgroundColor: color, border: 'none', color: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} className="w-100 fw-bold rounded-pill stretched-link">
                    {btnText}
                </Button>
            </Card.Body>
        </Card>
    );

    return (
        <div style={{ background: 'var(--bg-light)', minHeight: '100vh', color: 'var(--text-dark)', padding: '40px 0', position: 'relative' }}>
            <style>
                {`
                .cyber-grid {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-image: linear-gradient(rgba(15, 23, 42, 0.02) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(15, 23, 42, 0.02) 1px, transparent 1px);
                    background-size: 40px 40px;
                    pointer-events: none;
                    z-index: 0;
                }
                `}
            </style>
            <div className="cyber-grid"></div>

            <Container style={{ position: 'relative', zIndex: 1 }}>
                <div className="mb-5 d-flex justify-content-between align-items-end">
                    <div>
                        <Badge bg="success" className="mb-2 px-3 py-2 text-dark fw-bold">SYSTEM ACTIVE</Badge>
                        <h2 className="fw-bold mb-0" style={{ fontSize: '2.5rem' }}>Welcome, {user?.username || user?.name || "Citizen"}</h2>
                        <p className="opacity-50">KYC Verified Portal | Terminal Session: 0x{Math.floor(Math.random() * 1000000).toString(16)}</p>
                    </div>
                </div>

                <Row className="g-4 mb-5">
                    <Col lg={3} md={6}>
                        <ActionCard
                            title="Lodge FIR"
                            icon={<FaFileSignature size={26} />}
                            description="File a new incident report direct."
                            link="/citizen/report"
                            btnText="START FILING"
                            color="#0f172a"
                        />
                    </Col>
                    <Col lg={3} md={6}>
                        <ActionCard
                            title="Trace Report"
                            icon={<FaSearchLocation size={26} />}
                            description="Monitor active investigation status."
                            link="/citizen/track"
                            btnText="OPEN TRACKER"
                            color="#3b82f6"
                        />
                    </Col>
                    <Col lg={3} md={6}>
                        <ActionCard
                            title="ID Protection"
                            icon={<FaUserSecret size={26} />}
                            description="Submit anonymous evidence or tips."
                            link="/citizen/tips"
                            btnText="TIPS PORTAL"
                            color="#8b5cf6"
                        />
                    </Col>
                    <Col lg={3} md={6}>
                        <ActionCard
                            title="Missing Persons"
                            icon={<FaUsers size={26} />}
                            description="Help reunite families in your area."
                            link="/citizen/missing"
                            btnText="VIEW DIRECTORY"
                            color="#10b981"
                        />
                    </Col>
                </Row>

                <Row className="g-4">
                    <Col lg={8}>
                        <h4 className="fw-bold mb-4 d-flex align-items-center">
                            <FaHistory className="me-2" color="#0a0c0bff" /> RECENT SYSTEM LOGS
                        </h4>
                        <Card className="card-custom shadow-md border-0 h-100" style={{ borderRadius: '15px' }}>
                            {loading ? (
                                <div className="p-5 text-center">
                                    <Spinner animation="border" variant="success" />
                                    <p className="mt-3 text-success small">LOADING SECURE RECORDS...</p>
                                </div>
                            ) : reports.length > 0 ? (
                                <div className="list-group list-group-flush">
                                    {reports.slice(0, 5).map((report, idx) => (
                                        <div key={idx} className="list-group-item bg-transparent p-4 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                                            <Row className="align-items-center">
                                                <Col xs={8}>
                                                    <h6 className="fw-bold mb-1" style={{ color: 'var(--primary-color)' }}>{report.reportId || `REF-${idx}`}</h6>
                                                    <p className="mb-0 small text-subtle fw-medium">{report.category} | Incident: {report.date || new Date(report.createdAt).toLocaleDateString()}</p>
                                                </Col>
                                                <Col xs={4} className="text-end">
                                                    <Badge pill bg={report.status === 'Closed' ? 'success' : 'primary'} className="px-3 py-2 fw-normal small">
                                                        {report.status.toUpperCase()}
                                                    </Badge>
                                                </Col>
                                            </Row>
                                        </div>
                                    ))}
                                    <div className="p-3 text-center">
                                        <Button as={Link} to="/citizen/track" variant="link" className="text-success text-decoration-none small fw-bold">VIEW ALL TERMINAL HISTORY →</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-5 text-center opacity-50">
                                    <FaShieldAlt size={50} className="mb-3" />
                                    <p>NO ACTIVE REPORTS FOUND FOR THIS ACCOUNT IDENTITY.</p>
                                    <Button as={Link} to="/citizen/report" variant="outline-success" size="sm" className="rounded-pill px-4">FILE FIRST REPORT</Button>
                                </div>
                            )}
                        </Card>
                    </Col>

                    <Col lg={4}>
                        <h4 className="fw-bold mb-4 d-flex align-items-center">
                            <FaChartArea className="me-2 text-primary" /> PUBLIC SAFETY KPI
                        </h4>
                        <Card className="card-custom shadow-md border-0 p-4 h-100" style={{ borderRadius: '15px', background: 'linear-gradient(145deg, #ffffff, #f8fafc)' }}>
                            <div className="mb-4">
                                <h6 className="fw-bold text-muted small text-uppercase">Area Crime Rate</h6>
                                <h2 className="fw-bold text-success mb-0">-32% <span style={{ fontSize: '0.8rem', color: '#64748b' }}>YTD Reduction</span></h2>
                            </div>
                            <div style={{ flexGrow: 1, minHeight: '200px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trendData}>
                                        <defs>
                                            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                                        <Area type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                </Row>


                <Row className="mt-5 g-4">
                    {/* EMERGENCY INFORMATION */}
                    <Col lg={4}>
                        <h4 className="fw-bold mb-4 d-flex align-items-center">
                            <FaPhoneAlt className="me-2 text-danger" /> EMERGENCY 24/7
                        </h4>
                        <Card className="card-custom border-0 shadow-sm p-4" style={{ background: 'linear-gradient(135deg, #fff 0%, #fff5f5 100%)' }}>
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', fontSize: '1.5rem', fontWeight: '900' }}>112</div>
                                <div>
                                    <h6 className="fw-bold mb-0">Unified Emergency</h6>
                                    <p className="small text-muted mb-0">Police, Ambulance, Fire</p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', fontSize: '1.5rem', fontWeight: '900' }}>100</div>
                                <div>
                                    <h6 className="fw-bold mb-0">Police Control Room</h6>
                                    <p className="small text-muted mb-0">Immediate assistance</p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', fontSize: '1.5rem', fontWeight: '900' }}>101</div>
                                <div>
                                    <h6 className="fw-bold mb-0">Fire Force</h6>
                                    <p className="small text-muted mb-0">Fire & Rescue Services</p>
                                </div>
                            </div>
                            <Button variant="danger" className="w-100 fw-bold rounded-pill mt-2 py-2">ONE-TOUCH DIAL</Button>
                        </Card>
                    </Col>

                    {/* PUBLIC ALERTS */}
                    <Col lg={4}>
                        <h4 className="fw-bold mb-4 d-flex align-items-center">
                            <FaExclamationTriangle className="me-2 text-warning" /> PUBLIC ALERTS
                        </h4>
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {alerts.length > 0 ? alerts.map((alert, idx) => (
                                <Alert key={idx} variant={alert.type || 'warning'} className="border-0 shadow-sm mb-3" style={{ borderRadius: '12px' }}>
                                    <div className="d-flex justify-content-between small fw-bold mb-1">
                                        <span>SYSTEM BROADCAST</span>
                                        <span>{alert.date}</span>
                                    </div>
                                    <p className="mb-0 small fw-medium">{alert.text}</p>
                                </Alert>
                            )) : <p className="text-muted small">No active alerts at this time.</p>}
                        </div>
                    </Col>

                    {/* WANTED CRIMINALS */}
                    <Col lg={4}>
                        <h4 className="fw-bold mb-4 d-flex align-items-center">
                            <FaUserSlash className="me-2 text-dark" /> WANTED LIST
                        </h4>
                        <Card className="card-custom border-0 shadow-sm overflow-hidden" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <div className="p-0">
                                {wanted.length > 0 ? wanted.map((person, idx) => (
                                    <div key={idx} className="d-flex p-3 border-bottom hover-bg-light" style={{ transition: '0.2s' }}>
                                        <img src={person.imageUrl || 'https://via.placeholder.com/60'} alt={person.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} className="me-3 shadow-sm" />
                                        <div>
                                            <h6 className="fw-bold mb-0 text-danger">{person.name}</h6>
                                            <p className="small mb-1 fw-bold text-dark">{person.crimeType}</p>
                                            <p className="mb-0 text-muted" style={{ fontSize: '0.7rem' }}>Last Seen: {person.lastSeen}</p>
                                        </div>
                                    </div>
                                )) : <div className="p-4 text-center text-muted small">No active pursuit logs found.</div>}
                            </div>
                            <div className="p-3 bg-light text-center border-top">
                                <Link to="/citizen/wanted-list" className="text-decoration-none">
                                    <small className="fw-bold text-primary cursor-pointer">VIEW ALL PUBLIC WANTED LIST →</small>
                                </Link>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <style>{`.hover-bg-light:hover { background: #f8fafc; }`}</style>
        </div >
    );
};

export default Dashboard;
