import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge } from "react-bootstrap";
import { FaUserPlus, FaUserTie, FaPhone, FaEnvelope, FaIdBadge } from "react-icons/fa";
import axios from "axios";

const Officers = () => {
    const [officers, setOfficers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newOfficer, setNewOfficer] = useState({
        name: "",
        badgeNumber: "",
        rank: "Constable",
        department: "General",
        contact: "",
        email: ""
    });

    useEffect(() => {
        fetchOfficers();
    }, []);

    const fetchOfficers = async () => {
        try {
            const res = await axios.get("/api/officers");
            setOfficers(res.data);
        } catch (err) {
            console.error("Error fetching officers:", err);
        }
    };

    const handleAddOfficer = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/officers", newOfficer);
            setShowModal(false);
            setNewOfficer({ name: "", badgeNumber: "", rank: "Constable", department: "General", contact: "", email: "" });
            fetchOfficers();
        } catch (err) {
            alert("Error adding officer: " + (err.response?.data?.error || err.message));
        }
    };

    return (
        <Container fluid className="py-4 px-lg-5" style={{ backgroundColor: "#fdfdfd", minHeight: "100vh", color: "#111111" }}>
            <div className="d-flex justify-content-between align-items-center mb-5 p-4 rounded-3 shadow-sm border" style={{ backgroundColor: "#ffffff" }}>
                <h2 className="mb-0 fw-bold d-flex align-items-center" style={{ color: "#001f3f", letterSpacing: "-1px" }}>
                    <FaUserTie className="me-3 text-warning" /> Officers Registry
                </h2>
                <Button variant="warning" className="fw-bold px-4 shadow-sm" style={{ backgroundColor: "#ffc107", border: "none", color: "#001f3f", borderRadius: "8px" }} onClick={() => setShowModal(true)}>
                    <FaUserPlus className="me-2" /> Add New Officer
                </Button>
            </div>

            <Row>
                <Col>
                    <Card className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: "15px" }}>
                        <Card.Body className="p-0">
                            <Table responsive hover className="mb-0 align-middle bg-white">
                                <thead className="bg-light">
                                    <tr style={{ backgroundColor: "#f8fafc" }}>
                                        <th className="py-3 ps-4 text-secondary small fw-bold text-uppercase">Officer Name</th>
                                        <th className="py-3 text-secondary small fw-bold text-uppercase">Badge ID</th>
                                        <th className="py-3 text-secondary small fw-bold text-uppercase">Rank</th>
                                        <th className="py-3 text-secondary small fw-bold text-uppercase">Department</th>
                                        <th className="py-3 text-secondary small fw-bold text-uppercase">Contact Information</th>
                                        <th className="py-3 text-secondary small fw-bold text-uppercase">Duty Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {officers.length > 0 ? (
                                        officers.map((officer) => (
                                            <tr key={officer._id}>
                                                <td className="ps-4 fw-bold text-dark h6 mb-0">{officer.name}</td>
                                                <td><Badge bg="light" text="dark" className="border fw-bold px-3">{officer.badgeNumber}</Badge></td>
                                                <td className="fw-bold text-dark">{officer.rank}</td>
                                                <td className="text-secondary fw-bold">{officer.department}</td>
                                                <td>
                                                    <div className="fw-bold small text-dark"><FaPhone className="me-2 text-warning" /> {officer.contact}</div>
                                                    <div className="fw-bold small text-secondary"><FaEnvelope className="me-2 text-warning" /> {officer.email}</div>
                                                </td>
                                                <td>
                                                    <Badge bg={officer.status === 'Active' ? 'success' : 'danger'} className="px-3 py-2 fw-bold shadow-sm">
                                                        {officer.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5 text-secondary fw-bold">Initialize the database to see personnel records.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-bottom">
                    <Modal.Title className="fw-bold text-dark">Register Department Personnel</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 bg-white">
                    <Form onSubmit={handleAddOfficer}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-secondary">OFFICER FULL NAME</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        value={newOfficer.name}
                                        onChange={(e) => setNewOfficer({ ...newOfficer, name: e.target.value })}
                                        className="bg-light border-0 py-2 fw-bold"
                                        style={{ height: "45px" }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-secondary">BADGE ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        value={newOfficer.badgeNumber}
                                        onChange={(e) => setNewOfficer({ ...newOfficer, badgeNumber: e.target.value })}
                                        className="bg-light border-0 py-2 fw-bold"
                                        style={{ height: "45px" }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-secondary">OFFICIAL RANK</Form.Label>
                                    <Form.Select
                                        value={newOfficer.rank}
                                        onChange={(e) => setNewOfficer({ ...newOfficer, rank: e.target.value })}
                                        className="bg-light border-0 fw-bold"
                                        style={{ height: "45px" }}
                                    >
                                        <option value="Constable">Constable</option>
                                        <option value="Inspector">Inspector</option>
                                        <option value="Sub-Inspector">Sub-Inspector</option>
                                        <option value="Commissioner">Commissioner</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-secondary">DEPARTMENT/UNIT</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newOfficer.department}
                                        onChange={(e) => setNewOfficer({ ...newOfficer, department: e.target.value })}
                                        className="bg-light border-0 py-2 fw-bold"
                                        style={{ height: "45px" }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-secondary">OFFICIAL EMAIL</Form.Label>
                            <Form.Control
                                type="email"
                                required
                                value={newOfficer.email}
                                onChange={(e) => setNewOfficer({ ...newOfficer, email: e.target.value })}
                                className="bg-light border-0 py-2 fw-bold"
                                style={{ height: "45px" }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold text-secondary">CONTACT NUMBER</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={newOfficer.contact}
                                onChange={(e) => setNewOfficer({ ...newOfficer, contact: e.target.value })}
                                className="bg-light border-0 py-2 fw-bold"
                                style={{ height: "45px" }}
                            />
                        </Form.Group>
                        <div className="d-grid mt-4">
                            <Button variant="warning" type="submit" className="fw-bold py-3 shadow-sm" style={{ backgroundColor: "#ffc107", border: "none", color: "#001f3f", borderRadius: "10px" }}>
                                COMMIT TO REGISTRY
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <style>{`
                .form-control:focus, .form-select:focus { box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.15); border-color: #ffc107; background-color: #fff !important; }
            `}</style>
        </Container>
    );
};

export default Officers;
