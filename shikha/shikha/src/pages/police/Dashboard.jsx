import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, InputGroup, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaSpinner, FaCheckCircle, FaUsers, FaMapMarkedAlt, FaRegBell, FaChartBar, FaUserShield, FaUserNinja, FaPlus, FaSearch, FaTrash, FaHistory } from 'react-icons/fa';
import { CrimeMap } from '../../components/MapComponents';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const PoliceDashboard = () => {
    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState({ total: 0, active: 0, closed: 0 });
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Analytics State
    const [chartData, setChartData] = useState([]);

    // Alerts State
    const [alerts, setAlerts] = useState([]);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [newAlert, setNewAlert] = useState({ text: '', type: 'danger' });

    // Recent Updates State
    const [recentUpdates, setRecentUpdates] = useState([]);

    // Evidence View State
    const [selectedEvidence, setSelectedEvidence] = useState(null);
    const [showEvidenceModal, setShowEvidenceModal] = useState(false);

    // Wanted Criminals State
    const [criminals, setCriminals] = useState([]);
    const [showAddCriminalModal, setShowAddCriminalModal] = useState(false);
    const [criminalSearch, setCriminalSearch] = useState('');
    const [newCriminal, setNewCriminal] = useState({ name: '', age: '', crimeType: '', status: 'Wanted', lastSeen: '', description: '', imageUrl: '' });
    const [addingCriminal, setAddingCriminal] = useState(false);

    useEffect(() => {
        fetchReports();
        fetchCriminals();
        fetchRecentUpdates();
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:5001/api/alerts");
            setAlerts(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchRecentUpdates = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:5001/api/case-updates/recent");
            setRecentUpdates(res.data);
        } catch (err) { console.error(err); }
    };

    const handleDeleteReport = async (id) => {
        if (!window.confirm("WARNING: This will permanently delete this Official Case Log. Proceed?")) return;
        try {
            await axios.delete(`http://127.0.0.1:5001/api/reports/${id}`);
            fetchReports();
        } catch (err) {
            alert("Failed to delete report.");
        }
    };

    const handleAddAlert = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:5001/api/alerts', newAlert);
            setNewAlert({ text: '', type: 'danger' });
            setShowAlertModal(false);
            fetchAlerts();
            alert('Public alert broadcasted correctly!');
        } catch (err) {
            alert('Failed to broadcast alert: ' + err.message);
        }
    };

    const handleDeleteAlert = async (id) => {
        if (!window.confirm("Remove this alert broadcast from public view?")) return;
        try {
            await axios.delete(`http://127.0.0.1:5001/api/alerts/${id}`);
            fetchAlerts();
        } catch (err) {
            alert('Failed to delete alert: ' + err.message);
        }
    };

    const fetchCriminals = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5001/api/criminal-records');
            setCriminals(res.data);
        } catch (err) {
            console.error('Error fetching criminals:', err);
        }
    };

    const handleAddCriminal = async (e) => {
        e.preventDefault();
        setAddingCriminal(true);
        try {
            await axios.post('http://127.0.0.1:5001/api/criminal-records', newCriminal);
            setNewCriminal({ name: '', age: '', crimeType: '', status: 'Wanted', lastSeen: '', description: '', imageUrl: '' });
            setShowAddCriminalModal(false);
            fetchCriminals();
            alert('Criminal record broadcasted to public portal!');
        } catch (err) {
            alert('Failed to add record: ' + err.message);
        } finally {
            setAddingCriminal(false);
        }
    };

    const handleDeleteCriminal = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this criminal record?")) return;
        try {
            await axios.delete(`http://127.0.0.1:5001/api/criminal-records/${id}`);
            fetchCriminals();
        } catch (err) {
            alert('Failed to delete record: ' + err.message);
        }
    };

    const handleCriminalImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setNewCriminal({ ...newCriminal, imageUrl: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const fetchReports = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:5001/api/reports");
            const data = res.data;
            setReports(data);

            const closedCount = data.filter(r => r.status === 'Closed' || r.status === 'Closed / Resolved').length;
            setStats({
                total: data.length,
                active: data.length - closedCount,
                closed: closedCount
            });

            // Prepare Chart Data
            const categoryCounts = data.reduce((acc, curr) => {
                acc[curr.category] = (acc[curr.category] || 0) + 1;
                return acc;
            }, {});

            const chart = Object.keys(categoryCounts).map(key => ({
                name: key,
                count: categoryCounts[key]
            }));
            setChartData(chart);
        } catch (err) {
            console.error("Error fetching reports:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredReports = reports.filter(r => {
        // Status Filter
        let matchesStatus = true;
        if (filter === 'Closed') matchesStatus = (r.status === 'Closed' || r.status === 'Closed / Resolved');
        if (filter === 'Active') matchesStatus = (r.status !== 'Closed' && r.status !== 'Closed / Resolved');

        // Search Filter
        let matchesSearch = true;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            matchesSearch = (r.reportId?.toLowerCase().includes(term) ||
                r.location?.toLowerCase().includes(term) ||
                r.category?.toLowerCase().includes(term));
        }

        return matchesStatus && matchesSearch;
    });

    const getStatusBadge = (status) => {
        if (status === 'Closed' || status === 'Closed / Resolved') return 'success';
        if (status === 'In Progress' || status === 'Under Investigation') return 'warning';
        if (status === 'Filed') return 'primary';
        return 'secondary';
    };

    const StatCard = ({ title, count, icon, color }) => (
        <Card className="card-custom h-100 shadow-custom border-0" style={{ borderLeft: `5px solid ${color}`, borderRadius: "12px" }}>
            <Card.Body className="d-flex align-items-center p-4">
                <div className="rounded-circle p-3 me-3" style={{ backgroundColor: color + '15', color: color }}>
                    {icon}
                </div>
                <div>
                    <h6 className="text-muted mb-1 text-uppercase fw-bold small" style={{ letterSpacing: "1px" }}>{title}</h6>
                    <h2 className="mb-0 fw-bold text-dark" style={{ fontSize: "2rem" }}>{count}</h2>
                </div>
            </Card.Body>
        </Card>
    );

    return (
        <Container fluid className="py-4 px-lg-5 bg-light" style={{ minHeight: "100vh" }}>
            <style>{`
                .card-custom { transition: transform 0.2s; border: 1px solid #e2e8f0; background: #ffffff; }
                .card-custom:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; }
            `}</style>

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3 p-4 rounded-3 shadow-sm card-custom border-0">
                <div>
                    <h2 className="fw-bold mb-0 text-dark" style={{ letterSpacing: "-1px" }}>Police Command Center</h2>
                    <p className="text-secondary mb-0 fw-bold">Strategic overview and management of jurisdiction activity.</p>
                </div>
                <div className="d-flex gap-2 flex-wrap">

                    <Button className="fw-bold shadow-sm d-flex align-items-center" onClick={() => setShowAddCriminalModal(true)} style={{ background: '#dc2626', border: 'none', color: 'white', borderRadius: '8px' }}>
                        <FaUserNinja className="me-2" /> Add Wanted Criminal
                    </Button>
                    <Button as={Link} to="/police/officers" variant="warning" className="d-flex align-items-center fw-bold shadow-sm" style={{ backgroundColor: "#ffc107", border: "none", color: "#001f3f", borderRadius: "8px" }}>
                        <FaUserShield className="me-2" /> Officers
                    </Button>
                    <Button as={Link} to="/police/records" variant="outline-dark" className="d-flex align-items-center fw-bold shadow-sm" style={{ borderRadius: "8px" }}>
                        <FaUsers className="me-2" /> All Criminals
                    </Button>
                </div>
            </div>

            <Row className="g-4 mb-5">
                <Col md={4}><StatCard title="Total FIRs Filed" count={stats.total} icon={<FaClipboardList size={22} />} color="#001f3f" /></Col>
                <Col md={4}><StatCard title="Open Investigations" count={stats.active} icon={<FaSpinner size={22} />} color="#ffc107" /></Col>
                <Col md={4}><StatCard title="Resolved Cases" count={stats.closed} icon={<FaCheckCircle size={22} />} color="#10b981" /></Col>
            </Row>

            <Row className="mb-5 g-4">
                <Col lg={8}>
                    <Card className="card-custom h-100 overflow-hidden shadow-sm border-0">
                        <Card.Header className="bg-transparent py-3 px-4 border-bottom d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0 text-dark">Live Case Tracking</h5>
                            <div className="d-flex gap-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Search cases..."
                                    className="form-control-sm bg-light border-0 fw-bold"
                                    style={{ width: '180px' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Form.Select
                                    className="form-select-sm bg-light border-0 fw-bold"
                                    style={{ width: 'auto' }}
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                >
                                    <option value="All">All Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Closed">Closed</option>
                                </Form.Select>
                            </div>
                        </Card.Header>
                        <Table hover responsive className="mb-0 align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="py-3 ps-4 text-secondary small fw-bold text-uppercase border-0">Case ID</th>
                                    <th className="py-3 text-secondary small fw-bold text-uppercase border-0">Category</th>
                                    <th className="py-3 text-secondary small fw-bold text-uppercase border-0">Incident Date</th>
                                    <th className="py-3 text-secondary small fw-bold text-uppercase border-0">Location</th>
                                    <th className="py-3 text-secondary small fw-bold text-uppercase border-0">Status</th>
                                    <th className="py-3 text-end pe-4 text-secondary small fw-bold text-uppercase border-0">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center py-5 fw-bold text-muted">Loading operational data...</td></tr>
                                ) : filteredReports.length > 0 ? (
                                    filteredReports.map((report) => (
                                        <tr key={report.reportId || report.id}>
                                            <td className="ps-4 fw-bold text-dark">{report.reportId || report.id}</td>
                                            <td className="fw-bold text-secondary">{report.category}</td>
                                            <td className="text-muted fw-bold">{report.date || 'N/A'}</td>
                                            <td className="text-muted fw-bold">{report.location}</td>
                                            <td>
                                                <Badge bg={getStatusBadge(report.status)} className="px-3 py-2 fw-bold">
                                                    {report.status}
                                                </Badge>
                                            </td>
                                            <td className="text-end pe-4">
                                                <div className="d-flex gap-2 justify-content-end">
                                                    {report.evidence && (
                                                        <Button variant="outline-primary" size="sm" className="fw-bold px-3 rounded-pill" onClick={() => { setSelectedEvidence(report.evidence); setShowEvidenceModal(true); }}>
                                                            Evidence
                                                        </Button>
                                                    )}
                                                    <Button as={Link} to={`/police/case/${report.reportId || report.id}`} variant="outline-dark" size="sm" className="fw-bold px-3 rounded-pill">
                                                        Examine
                                                    </Button>
                                                    <Button variant="outline-danger" size="sm" className="fw-bold px-3 rounded-pill" onClick={() => handleDeleteReport(report._id || report.reportId)}>
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" className="text-center py-5 text-muted fw-bold">No tactical logs found.</td></tr>
                                )}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="card-custom h-100 shadow-sm overflow-hidden border-0">
                        <Card.Header className="bg-transparent py-3 px-4 border-bottom d-flex align-items-center">
                            <FaChartBar className="me-2 text-warning" />
                            <h5 className="fw-bold mb-0 text-dark">Case Analytics</h5>
                        </Card.Header>
                        <Card.Body>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#475569', fontWeight: "700", fontSize: "0.8rem" }} />
                                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#111', borderRadius: "8px" }} />
                                        <Bar dataKey="count" fill="#001f3f" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* WANTED CRIMINALS BROADCAST SECTION */}
            <Card className="card-custom shadow-sm overflow-hidden mt-4 border-0">
                <Card.Header className="bg-transparent py-3 px-4 border-bottom">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-2">
                            <FaUserNinja className="text-danger" size={18} />
                            <h5 className="fw-bold mb-0 text-dark">Wanted Criminals — Public Broadcast Board</h5>
                            <Badge bg="danger" className="px-2 py-1 tooltip-badge">{criminals.filter(c => c.status === 'Wanted').length} Active</Badge>
                        </div>
                        <div className="d-flex gap-2">
                            <InputGroup size="sm" style={{ width: '200px' }}>
                                <InputGroup.Text className="bg-light border-0"><FaSearch size={12} /></InputGroup.Text>
                                <Form.Control
                                    className="bg-light border-0 fw-bold"
                                    placeholder="Search name..."
                                    value={criminalSearch}
                                    onChange={e => setCriminalSearch(e.target.value)}
                                />
                            </InputGroup>
                            <Button size="sm" className="fw-bold d-flex align-items-center gap-1" style={{ background: '#dc2626', border: 'none', color: 'white', borderRadius: '8px' }} onClick={() => setShowAddCriminalModal(true)}>
                                <FaPlus size={11} /> Add
                            </Button>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className="p-4 bg-light">
                    {criminals.length === 0 ? (
                        <div className="text-center py-5 text-muted fw-bold">No criminal records in system.</div>
                    ) : (
                        <Row className="g-3">
                            {criminals
                                .filter(c => c.name?.toLowerCase().includes(criminalSearch.toLowerCase()))
                                .map((c, idx) => (
                                    <Col key={idx} xl={2} lg={3} md={4} sm={6}>
                                        <div className="text-center p-3 rounded-3 border shadow-sm h-100" style={{ background: c.status === 'Wanted' ? '#fff5f5' : '#ffffff', borderColor: c.status === 'Wanted' ? '#fecaca' : '#e2e8f0', transition: '0.2s' }}>
                                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                                <img
                                                    src={c.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=991b1b&color=fff&size=120`}
                                                    alt={c.name}
                                                    style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', border: `3px solid ${c.status === 'Wanted' ? '#dc2626' : '#94a3b8'}` }}
                                                />
                                                <Badge
                                                    bg={c.status === 'Wanted' ? 'danger' : c.status === 'In Custody' ? 'success' : 'secondary'}
                                                    style={{ position: 'absolute', bottom: '-6px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem', whiteSpace: 'nowrap', border: '1px solid white' }}
                                                >
                                                    {c.status?.toUpperCase()}
                                                </Badge>
                                            </div>
                                            <div className="mt-3">
                                                <p className="fw-bold mb-0 text-dark" style={{ fontSize: '0.82rem' }}>{c.name}</p>
                                                <p className="text-danger fw-bold mb-0" style={{ fontSize: '0.72rem' }}>{c.crimeType}</p>
                                                <p className="text-muted mb-0" style={{ fontSize: '0.68rem' }}>Last: {c.lastSeen || 'Unknown'}</p>
                                                <div className="mt-2 pt-2 border-top">
                                                    <Button variant="outline-danger" size="sm" className="w-100 rounded-pill" style={{ fontSize: '0.7rem' }} onClick={() => handleDeleteCriminal(c._id)}>
                                                        <FaTrash className="me-1" /> Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                        </Row>
                    )}
                </Card.Body>
            </Card>

            {/* Incident Map & Activity Feed */}
            <Row className="g-4 mt-2 border-0">
                <Col lg={8}>
                    <Card className="card-custom shadow-sm overflow-hidden h-100 border-0">
                        <Card.Header className="bg-transparent py-3 px-4 border-bottom d-flex align-items-center">
                            <FaMapMarkedAlt className="me-2 text-warning" />
                            <h5 className="fw-bold mb-0 text-dark">Incident Map Geometry</h5>
                        </Card.Header>
                        <Card.Body className="p-0" style={{ height: "400px" }}>
                            <CrimeMap reports={reports} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="card-custom shadow-sm overflow-hidden h-100 border-0">
                        <Card.Header className="bg-transparent py-3 px-4 border-bottom d-flex align-items-center">
                            <FaHistory className="me-2 text-primary" />
                            <h5 className="fw-bold mb-0 text-dark">Recent Case Updates</h5>
                        </Card.Header>
                        <Card.Body className="p-0" style={{ height: "400px", overflowY: "auto", background: "#f8fafc" }}>
                            {recentUpdates.length > 0 ? (
                                <ListGroup variant="flush">
                                    {recentUpdates.map((upd, idx) => (
                                        <ListGroup.Item key={idx} className="p-3 border-bottom bg-transparent">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <Badge bg="dark" className="fw-bold">FIR #{upd.reportId}</Badge>
                                                <span className="small text-muted fw-bold">{new Date(upd.timestamp).toLocaleDateString()}</span>
                                            </div>
                                            <p className="mb-0 small fw-bold text-dark">{upd.updateDescription}</p>
                                            {upd.statusChange && <Badge bg="warning" text="dark" className="mt-2 fw-bold">{upd.statusChange}</Badge>}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <div className="p-5 text-center text-muted fw-bold">No recent case activity.</div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* PUBLIC ALERTS BROADCAST SECTION */}
            <Card className="card-custom shadow-sm overflow-hidden mt-4 border-0">
                <Card.Header className="bg-transparent py-3 px-4 border-bottom d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                        <FaRegBell className="text-warning" size={18} />
                        <h5 className="fw-bold mb-0 text-dark">Active Public Broadcast Alerts</h5>
                        <Badge bg="warning" className="px-2 py-1 tooltip-badge text-dark">{alerts.length} Active</Badge>
                    </div>
                    <Button size="sm" className="fw-bold d-flex align-items-center gap-1" style={{ background: '#f59e0b', border: 'none', color: '#000', borderRadius: '8px' }} onClick={() => setShowAlertModal(true)}>
                        <FaPlus size={11} /> New Alert
                    </Button>
                </Card.Header>
                <Card.Body className="p-4 bg-light">
                    {alerts.length === 0 ? (
                        <div className="text-center py-5 text-muted fw-bold">No active public alerts.</div>
                    ) : (
                        <Row className="g-3">
                            {alerts.map((alert, idx) => (
                                <Col key={idx} md={6} xl={4}>
                                    <div className="p-3 rounded-3 border shadow-sm position-relative d-flex flex-column" style={{ background: alert.type === 'danger' ? '#fff5f5' : alert.type === 'warning' ? '#fffbeb' : '#f0fdfa', borderColor: alert.type === 'danger' ? '#fecaca' : alert.type === 'warning' ? '#fef3c7' : '#ccfbf1', height: '100%' }}>
                                        <div className="d-flex justify-content-between mb-2">
                                            <Badge bg={alert.type === 'warning' ? 'warning' : alert.type === 'danger' ? 'danger' : 'info'} className={alert.type === 'warning' ? 'text-dark' : ''}>{alert.type?.toUpperCase()}</Badge>
                                            <span className="small text-muted fw-bold">{alert.date}</span>
                                        </div>
                                        <p className="fw-bold text-dark mb-4 flex-grow-1" style={{ fontSize: '0.9rem' }}>{alert.text}</p>
                                        <div className="mt-auto pt-2 border-top" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                                            <Button variant="outline-danger" size="sm" className="w-100 rounded-pill fw-bold" style={{ fontSize: '0.7rem' }} onClick={() => handleDeleteAlert(alert._id)}>
                                                <FaTrash className="me-1" /> Remove Broadcast
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Card.Body>
            </Card>

            {/* Evidence Preview Modal */}
            <Modal show={showEvidenceModal} onHide={() => setShowEvidenceModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold text-dark">Examine Photo Evidence</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center p-4">
                    {selectedEvidence ? (
                        <img src={selectedEvidence} alt="Evidence" style={{ maxWidth: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }} />
                    ) : (
                        <p className="text-muted">No visual data available for this sector.</p>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="dark" className="fw-bold" onClick={() => setShowEvidenceModal(false)}>Close Wrapper</Button>
                </Modal.Footer>
            </Modal>

            {/* Add Alert Modal */}
            <Modal show={showAlertModal} onHide={() => setShowAlertModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2">
                        <FaRegBell className="text-warning" /> Broadcast Public Alert
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-3">
                    <Form onSubmit={handleAddAlert}>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">ALERT LEVEL / TYPE</Form.Label>
                            <Form.Select className="bg-light border-0 fw-bold" value={newAlert.type} onChange={e => setNewAlert({ ...newAlert, type: e.target.value })}>
                                <option value="danger">Danger (Red - Critical)</option>
                                <option value="warning">Warning (Yellow - Caution)</option>
                                <option value="info">Info (Blue - General notice)</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold">BROADCAST MESSAGE</Form.Label>
                            <Form.Control className="bg-light border-0 fw-bold" as="textarea" rows={3} value={newAlert.text} onChange={e => setNewAlert({ ...newAlert, text: e.target.value })} required placeholder="Enter the public alert message..." />
                        </Form.Group>
                        <div className="d-grid">
                            <Button type="submit" className="fw-bold py-3" style={{ background: '#f59e0b', border: 'none', borderRadius: '10px', color: '#000' }}>
                                📢 PUSH TO CITIZEN PORTAL
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Add Wanted Criminal Modal */}
            <Modal show={showAddCriminalModal} onHide={() => setShowAddCriminalModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2">
                        <FaUserNinja className="text-danger" /> Broadcast New Wanted Criminal
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-3">
                    <div className="p-2 mb-3 rounded-3" style={{ background: '#fff5f5', border: '1px solid #fecaca' }}>
                        <small className="fw-bold text-danger">⚠️ This record will be immediately visible on the Public Citizen Portal.</small>
                    </div>
                    <Form onSubmit={handleAddCriminal}>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label className="small fw-bold">FULL NAME</Form.Label>
                                <Form.Control className="bg-light border-0 fw-bold" value={newCriminal.name} onChange={e => setNewCriminal({ ...newCriminal, name: e.target.value })} required placeholder="Full name or alias" />
                            </Col>
                            <Col md={3}>
                                <Form.Label className="small fw-bold">AGE</Form.Label>
                                <Form.Control className="bg-light border-0 fw-bold" type="number" value={newCriminal.age} onChange={e => setNewCriminal({ ...newCriminal, age: e.target.value })} placeholder="Age" />
                            </Col>
                            <Col md={3}>
                                <Form.Label className="small fw-bold">STATUS</Form.Label>
                                <Form.Select className="bg-light border-0 fw-bold" value={newCriminal.status} onChange={e => setNewCriminal({ ...newCriminal, status: e.target.value })}>
                                    <option value="Wanted">Wanted / At Large</option>
                                    <option value="In Custody">In Custody</option>
                                    <option value="Released">Released</option>
                                </Form.Select>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label className="small fw-bold">CRIME TYPE</Form.Label>
                                <Form.Control className="bg-light border-0 fw-bold" value={newCriminal.crimeType} onChange={e => setNewCriminal({ ...newCriminal, crimeType: e.target.value })} required placeholder="e.g. Armed Robbery" />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold">LAST KNOWN LOCATION</Form.Label>
                                <Form.Control className="bg-light border-0 fw-bold" value={newCriminal.lastSeen} onChange={e => setNewCriminal({ ...newCriminal, lastSeen: e.target.value })} placeholder="e.g. Kochi, Ernakulam" />
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">UPLOAD PHOTO <span className="text-muted fw-normal">(from device)</span></Form.Label>
                            <Form.Control className="bg-light border-0" type="file" accept="image/*" onChange={handleCriminalImageUpload} />
                            {newCriminal.imageUrl && (
                                <div className="mt-2 text-center">
                                    <img src={newCriminal.imageUrl} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '12px', border: '3px solid #dc2626' }} />
                                    <div className="mt-1"><small className="text-muted fw-bold">Or paste URL below instead</small></div>
                                </div>
                            )}
                            {!newCriminal.imageUrl && (
                                <Form.Control className="bg-light border-0 fw-bold mt-2" placeholder="...or paste image URL here" onChange={e => setNewCriminal({ ...newCriminal, imageUrl: e.target.value })} />
                            )}
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold">MODUS OPERANDI / DESCRIPTION</Form.Label>
                            <Form.Control className="bg-light border-0 fw-bold" as="textarea" rows={3} value={newCriminal.description} onChange={e => setNewCriminal({ ...newCriminal, description: e.target.value })} placeholder="Known behaviour, associates, vehicles..." />
                        </Form.Group>
                        <div className="d-grid">
                            <Button type="submit" disabled={addingCriminal} className="fw-bold py-3" style={{ background: '#dc2626', border: 'none', borderRadius: '10px', color: 'white' }}>
                                {addingCriminal ? 'BROADCASTING...' : '📢 BROADCAST TO PUBLIC PORTAL'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

        </Container>
    );
};

export default PoliceDashboard;