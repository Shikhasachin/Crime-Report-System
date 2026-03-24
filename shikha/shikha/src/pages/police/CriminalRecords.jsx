import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Form, Button, Modal, Row, Col, Badge } from 'react-bootstrap';
import { FaPlus, FaSearch, FaUserSecret, FaHistory } from 'react-icons/fa';
import axios from 'axios';

const CriminalRecords = () => {
    const [records, setRecords] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newRecord, setNewRecord] = useState({ name: '', age: '', crimeType: '', status: 'Wanted', description: '', lastSeen: '', imageUrl: '' });
    const [selectedCriminal, setSelectedCriminal] = useState(null);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const response = await axios.get('/api/criminal-records');
            setRecords(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching records:", err);
            setLoading(false);
        }
    };

    const handleAddRecord = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/criminal-records', newRecord);
            setShowModal(false);
            setNewRecord({ name: '', age: '', crimeType: '', status: 'Wanted', description: '', lastSeen: '', imageUrl: '' });
            fetchRecords();
        } catch (err) {
            alert("Error adding record: " + err.message);
        }
    };

    const [filterStatus, setFilterStatus] = useState('All');

    const filteredRecords = records.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <Container fluid className="py-4 px-lg-5" style={{ backgroundColor: "#fdfdfd", minHeight: "100vh", color: "#111111" }}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3 p-4 rounded-3 shadow-sm border" style={{ backgroundColor: "#ffffff" }}>
                <div>
                    <h2 className="fw-bold mb-0" style={{ color: "#001f3f", letterSpacing: "-1px" }}><FaUserSecret className="me-2 text-warning" /> Intelligence Database</h2>
                    <p className="text-secondary mb-0 fw-bold opacity-75">Registry of known offenders and persons of interest.</p>
                </div>
                <Button variant="warning" className="fw-bold px-4 shadow-sm" style={{ backgroundColor: "#ffc107", border: "none", color: "#001f3f", borderRadius: "8px" }} onClick={() => setShowModal(true)}>
                    <FaPlus className="me-2" /> Register New Record
                </Button>
            </div>

            <Card className="p-4 mb-4 shadow-sm border" style={{ backgroundColor: "#ffffff", borderRadius: "15px" }}>
                <Row className="g-3 align-items-center">
                    <Col md={8}>
                        <div className="d-flex align-items-center bg-light p-2 rounded border">
                            <FaSearch className="text-muted me-2 ms-2" />
                            <Form.Control
                                placeholder="Search by suspect name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border-0 shadow-none bg-transparent fw-bold"
                                style={{ color: "#111" }}
                            />
                        </div>
                    </Col>
                    <Col md={4}>
                        <Form.Select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="fw-bold text-dark border-0 bg-light"
                            style={{ height: '48px', borderRadius: "10px" }}
                        >
                            <option value="All">All Operational Statuses</option>
                            <option value="Wanted">Wanted / At Large</option>
                            <option value="In Custody">In Custody</option>
                            <option value="Released">Released on Bail</option>
                        </Form.Select>
                    </Col>
                </Row>
            </Card>

            <Card className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: "15px" }}>
                <Table hover responsive className="mb-0 align-middle bg-white">
                    <thead className="bg-light">
                        <tr style={{ backgroundColor: "#f8fafc" }}>
                            <th className="py-3 ps-4 text-secondary small fw-bold text-uppercase">Subject Name</th>
                            <th className="py-3 text-secondary small fw-bold text-uppercase">Age</th>
                            <th className="py-3 text-secondary small fw-bold text-uppercase">Primary Offense</th>
                            <th className="py-3 text-secondary small fw-bold text-uppercase">Operational Status</th>
                            <th className="py-3 text-secondary small fw-bold text-uppercase">Last Known Location</th>
                            <th className="py-3 text-end pe-4 text-secondary small fw-bold text-uppercase">Dossier</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-5 fw-bold">Accessing encrypted archives...</td></tr>
                        ) : filteredRecords.length > 0 ? (
                            filteredRecords.map(r => (
                                <tr key={r._id}>
                                    <td className="ps-4 fw-bold h6 mb-0 text-dark">{r.name}</td>
                                    <td className="fw-bold">{r.age}</td>
                                    <td><Badge bg="light" text="dark" className="border fw-bold px-3 py-2">{r.crimeType || "N/A"}</Badge></td>
                                    <td>
                                        <Badge bg={r.status === 'In Custody' ? 'success' : 'danger'} className="px-3 py-2 fw-bold shadow-sm">
                                            {r.status}
                                        </Badge>
                                    </td>
                                    <td className="small text-secondary fw-bold">{r.lastSeen || "Unknown"}</td>
                                    <td className="text-end pe-4">
                                        <Button variant="outline-dark" size="sm" className="fw-bold px-3" onClick={() => { setSelectedCriminal(r); setShowHistoryModal(true); }}>
                                            View Intel
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="text-center py-5 text-muted fw-bold">No records matching search criteria.</td></tr>
                        )}
                    </tbody>
                </Table>
            </Card>

            {/* Add Record Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-bottom">
                    <Modal.Title className="fw-bold text-dark">New Intelligence Entry</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 bg-white">
                    <Form onSubmit={handleAddRecord}>
                        <Row>
                            <Col md={8}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">SUBJECT FULL NAME</Form.Label>
                                    <Form.Control
                                        required
                                        value={newRecord.name}
                                        onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
                                        className="bg-light border-0 fw-bold py-2"
                                        style={{ height: "45px" }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">AGE</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={newRecord.age}
                                        onChange={(e) => setNewRecord({ ...newRecord, age: e.target.value })}
                                        className="bg-light border-0 fw-bold py-2"
                                        style={{ height: "45px" }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">PRIMARY CRIME</Form.Label>
                                    <Form.Control
                                        value={newRecord.crimeType}
                                        onChange={(e) => setNewRecord({ ...newRecord, crimeType: e.target.value })}
                                        className="bg-light border-0 fw-bold py-2"
                                        style={{ height: "45px" }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">OPERATIONAL STATUS</Form.Label>
                                    <Form.Select
                                        value={newRecord.status}
                                        onChange={(e) => setNewRecord({ ...newRecord, status: e.target.value })}
                                        className="bg-light border-0 fw-bold"
                                        style={{ height: "45px" }}
                                    >
                                        <option value="Wanted">Wanted / At Large</option>
                                        <option value="In Custody">In Custody</option>
                                        <option value="Released">Released</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">LAST KNOWN LOCATION</Form.Label>
                            <Form.Control
                                value={newRecord.lastSeen}
                                onChange={(e) => setNewRecord({ ...newRecord, lastSeen: e.target.value })}
                                className="bg-light border-0 fw-bold py-2"
                                style={{ height: "45px" }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">PORTRAIT URL (PHOTO)</Form.Label>
                            <Form.Control
                                placeholder="https://image-link.com/photo.jpg"
                                value={newRecord.imageUrl}
                                onChange={(e) => setNewRecord({ ...newRecord, imageUrl: e.target.value })}
                                className="bg-light border-0 fw-bold py-2"
                                style={{ height: "45px" }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold">MODUS OPERANDI / DESCRIPTION</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newRecord.description}
                                onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                                className="bg-light border-0 fw-bold"
                            />
                        </Form.Group>
                        <div className="d-grid">
                            <Button variant="warning" type="submit" className="fw-bold py-3 shadow-sm" style={{ backgroundColor: "#ffc107", border: "none", color: "#001f3f", borderRadius: "10px" }}>
                                COMMIT TO PERMANENT RECORD
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Intel Modal */}
            <Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-bottom">
                    <Modal.Title className="fw-bold text-dark h4">Subject Dossier: {selectedCriminal?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 bg-white">
                    <div className="p-4 rounded-3 mb-3 border shadow-sm" style={{ backgroundColor: "#f8fafc" }}>
                        <div className="d-flex align-items-center mb-4">
                            <img src={selectedCriminal?.imageUrl || 'https://via.placeholder.com/150'} alt={selectedCriminal?.name} style={{ width: "120px", height: "120px", borderRadius: "15px", objectFit: "cover", border: "3px solid #ffc107" }} className="me-4 shadow-sm" />
                            <div>
                                <h6 className="text-warning fw-bold small text-uppercase mb-1">Intelligence Summary</h6>
                                <p className="text-dark fw-bold mb-0" style={{ lineHeight: "1.5", fontSize: "1rem" }}>{selectedCriminal?.description || "No detailed dossier available for this subject."}</p>
                            </div>
                        </div>
                        <hr />
                        <div className="row g-4">
                            <div className="col-md-6">
                                <p className="mb-1 small text-secondary fw-bold text-uppercase">Primary Offense</p>
                                <p className="fw-bold text-dark h5">{selectedCriminal?.crimeType}</p>
                            </div>
                            <div className="col-md-6">
                                <p className="mb-1 small text-secondary fw-bold text-uppercase">Last Known Location</p>
                                <p className="fw-bold text-dark h5">{selectedCriminal?.lastSeen || "Not tracked"}</p>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-top">
                    <Button variant="outline-dark" className="fw-bold px-4" onClick={() => setShowHistoryModal(false)}>Close Archive</Button>
                </Modal.Footer>
            </Modal>
        </Container >
    );
};

export default CriminalRecords;
