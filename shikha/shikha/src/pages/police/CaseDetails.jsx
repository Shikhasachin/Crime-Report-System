import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Badge, Form, Button, ListGroup, Table } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHistory, FaUserShield, FaSave } from 'react-icons/fa';
import axios from 'axios';

const CaseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [status, setStatus] = useState('');
    const [note, setNote] = useState('');
    const [assignedOfficerId, setAssignedOfficerId] = useState('');
    const [officers, setOfficers] = useState([]);
    const [caseUpdates, setCaseUpdates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        fetchOfficers();
    }, [id]);

    const fetchData = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:5001/api/reports");
            // The route returns all reports, so find the one with reportId matching the URL param id
            const found = res.data.find(r => r.reportId === id || r._id === id);

            if (found) {
                setReport(found);
                setStatus(found.status);
                setAssignedOfficerId(found.assignedOfficer || '');

                // Fetch case updates for this specific report
                const updatesRes = await axios.get(`http://127.0.0.1:5001/api/reports/${found.reportId}/updates`);
                setCaseUpdates(updatesRes.data);
            } else {
                alert('Case not found');
                navigate('/police/dashboard');
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            alert("Failed to load case details. Is the server running?");
        } finally {
            setLoading(false);
        }
    };

    const fetchOfficers = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:5001/api/officers");
            setOfficers(res.data);
        } catch (err) {
            console.error("Error fetching officers:", err);
        }
    };

    const handleUpdate = async () => {
        const statusChanged = status !== report.status;
        const officerChanged = assignedOfficerId !== (report.assignedOfficer || '');

        if (!note && !statusChanged && !officerChanged) {
            alert("Please add a note, change the status, or assign an officer.");
            return;
        }

        try {
            // 1. If status or officer changed, PATCH the report
            if (statusChanged || officerChanged) {
                await axios.patch(`http://127.0.0.1:5001/api/reports/${report.reportId}`, {
                    status,
                    assignedOfficer: assignedOfficerId
                });
            }

            // 2. Always log a case update record when something changes
            const updateDescription = note ||
                [statusChanged ? `Status updated to "${status}"` : '',
                officerChanged ? `Assigned officer changed to "${assignedOfficerId || 'Unassigned'}"` : '']
                    .filter(Boolean).join('. ');

            await axios.post("http://127.0.0.1:5001/api/case-updates", {
                reportId: report.reportId,
                updateDescription,
                statusChange: statusChanged ? status : '',
                updatedBy: "Station Officer"
            });

            setNote('');
            alert('Case updated and logged successfully!');
            fetchData(); // Refresh details and activity timeline
        } catch (err) {
            console.error('Error updating case:', err);
            alert('Error updating case: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <div className="p-5 text-center text-white">Loading Official Case File...</div>;
    if (!report) return <div className="p-5 text-center text-white">Report not found.</div>;

    return (
        <Container fluid className="py-4 px-lg-5" style={{ backgroundColor: "#fdfdfd", minHeight: "100vh", color: "#111111" }}>
            <Button variant="outline-dark" onClick={() => navigate('/police/dashboard')} className="mb-4 fw-bold shadow-sm" style={{ borderRadius: "8px" }}>
                <FaArrowLeft className="me-2" /> Return to Command Console
            </Button>

            <Row>
                <Col lg={8}>
                    {/* Primary Report Details */}
                    <Card style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "15px", marginBottom: "2rem" }} className="shadow-sm">
                        <Card.Header className="p-4 border-bottom d-flex justify-content-between align-items-center" style={{ backgroundColor: "#ffffff" }}>
                            <div>
                                <h3 className="fw-bold mb-0 text-dark" style={{ letterSpacing: "-1px" }}>FIR #{report.reportId}</h3>
                                <Badge bg="warning" text="dark" className="mt-2 px-3 fw-bold">{report.category}</Badge>
                            </div>
                            <div className="text-end">
                                <Badge bg={report.status === 'Closed / Resolved' ? 'success' : 'warning'} text={report.status === 'Closed / Resolved' ? 'white' : 'dark'} style={{ fontSize: '0.9rem', padding: '10px 20px', fontWeight: "800" }}>
                                    {report.status}
                                </Badge>
                                <div className="small text-secondary mt-2 fw-bold">Incident Date: {report.date}</div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Row className="mb-4">
                                <Col md={6}>
                                    <h6 className="text-secondary text-uppercase small fw-extrabold mb-3">Incident Information</h6>
                                    <p className="mb-2 fw-bold"><span className="text-secondary fw-semibold">Location:</span> {report.location}</p>
                                    <p className="mb-2 fw-bold"><span className="text-secondary fw-semibold">Date/Time:</span> {report.date} | {report.time}</p>
                                    <p className="mb-2 fw-bold"><span className="text-secondary fw-semibold">Type:</span> {report.type}</p>
                                </Col>
                                <Col md={6}>
                                    <h6 className="text-secondary text-uppercase small fw-extrabold mb-3">Citizen Information</h6>
                                    <p className="mb-2 fw-bold"><span className="text-secondary fw-semibold">Filed By:</span> {report.isAnonymous ? "Anonymous Witness" : report.userId}</p>
                                    <p className="mb-2 fw-bold"><span className="text-secondary fw-semibold">Contact:</span> Records Protected</p>
                                </Col>
                            </Row>

                            <h6 className="text-dark text-uppercase small fw-extrabold mb-3">Narrative Report</h6>
                            <div className="p-4 rounded-3 mb-4" style={{ backgroundColor: "#f8fafc", borderLeft: "5px solid #ffc107", color: "#111", fontSize: "1.1rem", lineHeight: "1.7", fontWeight: "600" }}>
                                {report.description}
                            </div>

                            {/* Case Timeline / Updates */}
                            <h5 className="fw-bold mb-4 d-flex align-items-center text-dark mt-5">
                                <FaHistory className="me-3 text-warning" /> Investigation Activity Timeline
                            </h5>
                            <div className="timeline-container">
                                {caseUpdates.length > 0 ? (
                                    <Table responsive hover className="mb-0 align-middle border shadow-sm rounded-3">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="py-3 px-4 text-secondary small fw-bold text-uppercase">Time & Date</th>
                                                <th className="py-3 text-secondary small fw-bold text-uppercase">Activity Update</th>
                                                <th className="py-3 text-secondary small fw-bold text-uppercase">Status</th>
                                                <th className="py-3 text-secondary small fw-bold text-uppercase">Officer</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {caseUpdates.map((upd, idx) => (
                                                <tr key={idx}>
                                                    <td className="small px-4 fw-bold text-secondary">{new Date(upd.timestamp).toLocaleString()}</td>
                                                    <td className="fw-bold text-dark">{upd.updateDescription}</td>
                                                    <td>
                                                        {upd.statusChange && <Badge bg="light" text="dark" className="border fw-bold">{upd.statusChange}</Badge>}
                                                    </td>
                                                    <td className="small fw-extrabold text-navy">{upd.updatedBy}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-5 bg-light rounded-3 text-secondary fw-bold border">
                                        No intelligence or field updates recorded for this dossier.
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    {/* Management Sidebar */}
                    <Card style={{ backgroundColor: "#001f3f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", position: "sticky", top: "20px" }} className="shadow-sm">
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-4 d-flex align-items-center" style={{ color: "rgba(255,255,255,0.9)" }}>
                                <FaUserShield className="me-2 text-warning" /> Operational Control
                            </h5>

                            <Form.Group className="mb-4">
                                <Form.Label className="small fw-bold" style={{ color: "rgba(255,255,255,0.7)" }}>ASSIGNED OFFICER</Form.Label>
                                <Form.Select
                                    value={assignedOfficerId}
                                    onChange={(e) => setAssignedOfficerId(e.target.value)}
                                    className="bg-light border-0 py-2 fw-bold"
                                    style={{ height: "45px", borderRadius: "10px", color: "#111" }}
                                >
                                    <option value="">-- Unassigned --</option>
                                    {officers.map(off => (
                                        <option key={off._id} value={off.name}>
                                            {off.name} ({off.rank})
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="small fw-bold" style={{ color: "rgba(255,255,255,0.7)" }}>UPDATE STATUS</Form.Label>
                                <Form.Select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="bg-light border-0 py-2 fw-bold"
                                    style={{ height: "45px", borderRadius: "10px", color: "#111" }}
                                >
                                    <option value="Filed">Filed (New)</option>
                                    <option value="Under Investigation">Active Investigation</option>
                                    <option value="Pending Court">Submitted to Court</option>
                                    <option value="Closed / Resolved">Case Closed / Resolved</option>
                                    <option value="Rejected">Rejected / Dismissed</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="small fw-bold" style={{ color: "rgba(255,255,255,0.7)" }}>FIELD UPDATE / NOTES</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    placeholder="Enter case developments, evidence cataloging..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="bg-light border-0 fw-bold"
                                    style={{ borderRadius: "10px", color: "#111" }}
                                />
                            </Form.Group>

                            <Button
                                variant="warning"
                                className="w-100 py-3 fw-bold d-flex align-items-center justify-content-center shadow-sm"
                                onClick={handleUpdate}
                                style={{ backgroundColor: "#ffc107", border: "none", color: "#001f3f", borderRadius: "10px" }}
                            >
                                <FaSave className="me-2" /> Commit Case Update
                            </Button>

                            <div className="mt-3 text-center">
                                <small className="fw-bold" style={{ color: "rgba(255,255,255,0.5)" }}>All actions are recorded in the official log.</small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <style>{`
                .fw-extrabold { font-weight: 800; }
                .text-navy { color: #001f3f; }
            `}</style>
        </Container>
    );
};

export default CaseDetails;
