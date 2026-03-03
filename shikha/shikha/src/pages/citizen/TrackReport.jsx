import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Badge, Form, InputGroup, Button, Modal, Row, Col, Spinner } from 'react-bootstrap';
import { FaSearch, FaFilePdf, FaRedo } from 'react-icons/fa';
import { jsPDF } from "jspdf";
import axios from 'axios';

const TrackReport = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchReports = async () => {
        setLoading(true);
        try {
            console.log("📡 FETCHING REPORTS FROM API...");
            const response = await axios.get('http://127.0.0.1:5001/api/reports');
            console.log("📋 REPORTS RECEIVED:", response.data.length);
            setReports(response.data);
        } catch (error) {
            console.error("❌ FAILED TO FETCH REPORTS:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Filed': return 'primary';
            case 'In Progress': return 'warning';
            case 'Closed': return 'success';
            case 'Assigned': return 'info';
            default: return 'secondary';
        }
    };

    const handleViewDetails = (report) => {
        setSelectedReport(report);
        setShowModal(true);
    };

    const generatePDF = () => {
        if (!selectedReport) return;
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.setTextColor(220, 53, 69);
        doc.text("KERALA POLICE", 105, 20, null, null, "center");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("First Information Report (Official Copy)", 105, 30, null, null, "center");
        doc.line(20, 35, 190, 35);
        doc.text(`Complaint ID: ${selectedReport.reportId}`, 20, 50);
        doc.text(`Incident Date: ${selectedReport.date || 'N/A'}`, 140, 50);
        doc.text(`Category: ${selectedReport.category}`, 20, 60);
        doc.text(`Filed On: ${new Date(selectedReport.createdAt).toLocaleDateString()}`, 140, 60);
        doc.text(`Location: ${selectedReport.location}`, 20, 70);
        const splitDescription = doc.splitTextToSize(selectedReport.description, 170);
        doc.text(splitDescription, 20, 85);
        doc.save(`FIR_${selectedReport.reportId}.pdf`);
    };

    const filteredReports = reports.filter(r =>
        (r.reportId?.toLowerCase().includes(searchId.toLowerCase())) ||
        (r.category?.toLowerCase().includes(searchId.toLowerCase()))
    );

    const [chatMessage, setChatMessage] = useState('');
    const handleSendMessage = () => {
        // Chat logic to be implemented or connected to backend
        setChatMessage('');
    };

    return (
        <div style={{ background: 'var(--bg-light)', minHeight: '100vh', color: 'var(--text-dark)', padding: '40px 0' }}>
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ letterSpacing: '-0.5px', color: 'var(--primary-color)' }}>Track Filed Reports</h2>
                        <p className="mb-0 text-subtle fw-bold" style={{ fontSize: '0.85rem' }}>RECORDS TERMINAL · LIVE SYNC v2.0</p>
                    </div>
                    <Button variant="outline-dark" onClick={fetchReports} className="rounded-pill px-4 fw-bold">
                        <FaRedo className={`me-2 ${loading ? 'fa-spin' : ''}`} /> REFRESH
                    </Button>
                </div>

                <Card className="card-custom border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                    <Card.Body className="p-3">
                        <InputGroup>
                            <InputGroup.Text className="bg-light border-0 text-secondary">
                                <FaSearch />
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Search by Complaint ID or Category..."
                                className="bg-light border-0 fw-bold"
                                style={{ color: 'var(--text-dark)' }}
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                            />
                        </InputGroup>
                    </Card.Body>
                </Card>

                <Card className="card-custom border-0 shadow-sm overflow-hidden" style={{ borderRadius: '15px' }}>
                    <Table responsive hover className="mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="py-3 ps-4 text-secondary small fw-bold text-uppercase">Complaint ID</th>
                                <th className="py-3 text-secondary small fw-bold text-uppercase">Category</th>
                                <th className="py-3 text-secondary small fw-bold text-uppercase">Incident Date</th>
                                <th className="py-3 text-secondary small fw-bold text-uppercase">Status</th>
                                <th className="py-3 text-end pe-4 text-secondary small fw-bold text-uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <Spinner animation="border" variant="primary" />
                                        <p className="mt-2 small text-muted fw-bold">Syncing with secure server...</p>
                                    </td>
                                </tr>
                            ) : filteredReports.length > 0 ? (
                                filteredReports.map((report, index) => (
                                    <tr key={index}>
                                        <td className="ps-4 fw-bold" style={{ color: 'var(--primary-color)' }}>{report.reportId}</td>
                                        <td className="fw-bold text-dark">{report.category}</td>
                                        <td className="text-secondary fw-medium">{report.date || 'N/A'}</td>
                                        <td>
                                            <Badge bg={getStatusBadge(report.status)} className="px-3 py-2 rounded-pill fw-bold">
                                                {report.status.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="text-end pe-4">
                                            <Button variant="outline-dark" size="sm" className="rounded-pill fw-bold px-3" onClick={() => handleViewDetails(report)}>
                                                Details
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted fw-bold">
                                        No records found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card>

                {/* Details Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                    <Modal.Header closeButton className="border-0 pb-0">
                        <Modal.Title className="fw-bold text-dark">Complaint Details: {selectedReport?.reportId}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="pt-3">
                        {selectedReport && (
                            <div>
                                <Row className="mb-4">
                                    <Col md={6}>
                                        <h6 className="fw-bold text-secondary text-uppercase small mb-2">Category</h6>
                                        <p className="fw-bold text-dark mb-0">{selectedReport.category}</p>
                                    </Col>
                                    <Col md={6}>
                                        <h6 className="fw-bold text-secondary text-uppercase small mb-2">Status</h6>
                                        <Badge bg={getStatusBadge(selectedReport.status)} className="px-3 py-2 fw-bold">{selectedReport.status}</Badge>
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col md={6}>
                                        <h6 className="fw-bold text-secondary text-uppercase small mb-2">Location</h6>
                                        <p className="fw-bold text-dark mb-0">{selectedReport.location || 'Not specified'}</p>
                                    </Col>
                                    <Col md={6}>
                                        <h6 className="fw-bold text-secondary text-uppercase small mb-2">Incident Date</h6>
                                        <p className="fw-bold text-dark mb-0">{selectedReport.date || 'N/A'}</p>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col md={12}>
                                        <h6 className="fw-bold text-secondary text-uppercase small mb-2">Description</h6>
                                        <div className="p-3 rounded-3 bg-light border" style={{ fontWeight: '600', color: 'var(--text-dark)', lineHeight: '1.7' }}>
                                            {selectedReport.description}
                                        </div>
                                    </Col>
                                </Row>

                                {selectedReport.evidence && (
                                    <Row className="mb-3">
                                        <Col md={12}>
                                            <h6 className="fw-bold text-secondary text-uppercase small mb-2">Photo Evidence</h6>
                                            <img src={selectedReport.evidence} alt="Evidence" style={{ maxWidth: '100%', borderRadius: '10px', border: '2px solid #e2e8f0' }} />
                                        </Col>
                                    </Row>
                                )}

                                <div className="d-flex justify-content-end mt-3">
                                    <Button variant="outline-danger" size="sm" className="fw-bold px-4" onClick={generatePDF}>
                                        <FaFilePdf className="me-2" /> Download Acknowledgment
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                        <Button variant="light" className="fw-bold" onClick={() => setShowModal(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default TrackReport;
