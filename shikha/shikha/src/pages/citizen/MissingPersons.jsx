import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, InputGroup, Form } from 'react-bootstrap';
import { FaSearch, FaUserShield, FaExclamationCircle } from 'react-icons/fa';
import axios from 'axios';

const MissingPersons = () => {
    const [missing, setMissing] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchMissing = async () => {
            try {
                // For demonstration, we mix 'Wanted' records with 'Missing' status
                // If backend does not have exact categories, we fetch all and mock some as "Missing" 
                // Alternatively, we just display ones tagged "Missing"
                const res = await axios.get('http://127.0.0.1:5001/api/criminal-records');

                // MOCK DATA GENERATION: Create a standalone missing persons directory visually
                const mockMissingList = [
                    { _id: '1', name: 'Ayesha Rahman', age: 24, crimeType: 'Missing Person', status: 'Missing', lastSeen: 'Ernakulam South Station', description: 'Wearing blue salwar, carrying brown bag. Last spotted on CCTV at 14:00.', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&fit=crop' },
                    { _id: '2', name: 'Rahul K.V', age: 10, crimeType: 'Missing Child', status: 'Missing', lastSeen: 'Fort Kochi Beach', description: 'Wearing yellow T-shirt and shorts. Speak Malayalam.', imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=200&h=200&fit=crop' },
                    { _id: '3', name: 'Gopalakrishnan', age: 72, crimeType: 'Senior Citizen', status: 'Missing', lastSeen: 'Trivandrum Temple', description: 'Has Alzheimer. Wearing traditional white mundu.', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&fit=crop' }
                ];

                // Append any actual missing from DB (if any)
                const realMissing = res.data.filter(c => c.status === 'Missing');
                setMissing([...mockMissingList, ...realMissing]);
            } catch (error) {
                console.error("Failed to fetch records:", error);
            }
        };

        fetchMissing();
    }, []);

    const filtered = missing.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={{ background: 'var(--bg-light)', minHeight: '100vh', color: 'var(--text-dark)', padding: '40px 0' }}>
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-4">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: 'var(--primary-color)' }}>Missing Persons Directory</h2>
                        <p className="mb-0 text-muted fw-bold">Help Kerala Police reunite families. If you have information, dial 112 immediately.</p>
                    </div>
                </div>

                <Row className="mb-4">
                    <Col md={6}>
                        <InputGroup className="shadow-sm rounded-pill overflow-hidden">
                            <InputGroup.Text className="bg-white border-0 text-primary px-4"><FaSearch /></InputGroup.Text>
                            <Form.Control
                                placeholder="Search by name or description..."
                                className="border-0 bg-white py-3 fw-bold shadow-none"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                </Row>

                <Row className="g-4">
                    {filtered.map((person) => (
                        <Col lg={4} md={6} key={person._id}>
                            <Card className="h-100 border-0 shadow-sm card-custom" style={{ overflow: 'hidden', borderRadius: '15px' }}>
                                <div style={{ height: '4px', background: '#3b82f6', width: '100%' }}></div>
                                <Card.Body className="p-4 d-flex flex-column">
                                    <div className="d-flex align-items-center mb-4">
                                        <div style={{ position: 'relative' }}>
                                            <img src={person.imageUrl} alt={person.name} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', border: '3px solid #e2e8f0' }} className="shadow-sm" />
                                            <Badge bg="danger" className="position-absolute" style={{ bottom: '-10px', left: '50%', transform: 'translateX(-50%)', border: '2px solid white' }}>CRITICAL</Badge>
                                        </div>
                                        <div className="ms-3">
                                            <h5 className="fw-bold mb-0 text-dark">{person.name}</h5>
                                            <Badge bg="light" text="dark" className="mt-1 border fw-bold">Age: {person.age} • {person.crimeType}</Badge>
                                        </div>
                                    </div>

                                    <div className="bg-light p-3 rounded-3 mb-4 flex-grow-1 border">
                                        <p className="small mb-2"><strong className="text-secondary d-block">Last Seen:</strong> {person.lastSeen}</p>
                                        <p className="small mb-0"><strong className="text-secondary d-block">Description:</strong> {person.description}</p>
                                    </div>

                                    <Button variant="outline-primary" className="w-100 fw-bold rounded-pill text-uppercase" style={{ letterSpacing: '0.5px' }} onClick={() => alert("Redirecting to Anonymous Tips portal with reference ID.")}>
                                        <FaExclamationCircle className="me-2" /> I Have Information
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                    {filtered.length === 0 && (
                        <Col xs={12}>
                            <div className="text-center p-5 text-muted fw-bold border rounded-3 bg-white">
                                <FaUserShield size={40} className="mb-3 opacity-50" />
                                <p>No matching missing persons records found.</p>
                            </div>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    );
};

export default MissingPersons;
