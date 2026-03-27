import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, InputGroup, Form } from 'react-bootstrap';
import { FaUserSlash, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

const WantedList = () => {
    const [wanted, setWanted] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchWanted = async () => {
            try {
                const res = await axios.get('/api/criminal-records');
                setWanted(res.data.filter(c => c.status === 'Wanted'));
            } catch (error) {
                console.error("Failed to fetch wanted list:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWanted();
    }, []);

    const filteredWanted = wanted.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.crimeType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ background: 'var(--bg-light)', minHeight: '100vh', color: 'var(--text-dark)', padding: '40px 0', position: 'relative' }}>
            <style>
                {`
                .cyber-grid {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-image: linear-gradient(rgba(0, 31, 63, 0.03) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(0, 31, 63, 0.03) 1px, transparent 1px);
                    background-size: 50px 50px;
                    pointer-events: none;
                    z-index: 0;
                }
                .wanted-card {
                    transition: transform 0.2s; border: 1px solid #e2e8f0; background: #ffffff;
                }
                .wanted-card:hover {
                    transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
                }
                `}
            </style>
            <div className="cyber-grid"></div>

            <Container style={{ position: 'relative', zIndex: 1 }}>
                <div className="mb-5 text-center">
                    <FaUserSlash size={50} className="text-danger mb-3" />
                    <h2 className="fw-bold mb-2 text-dark" style={{ fontSize: '2.5rem', letterSpacing: '1px' }}>PUBLIC WANTED LIST</h2>
                    <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
                        The following individuals are wanted by law enforcement. Do not approach them. If you have information regarding their whereabouts, please contact authorities immediately or submit an anonymous tip.
                    </p>
                </div>



                {loading ? (
                    <div className="py-5 text-center">
                        <Spinner animation="border" variant="danger" />
                        <p className="mt-3 text-danger fw-bold">LOADING WANTED DATABASE...</p>
                    </div>
                ) : filteredWanted.length > 0 ? (
                    <Row className="g-4">
                        {filteredWanted.map((person, idx) => (
                            <Col key={idx} lg={3} md={4} sm={6}>
                                <Card className="wanted-card h-100 shadow-sm overflow-hidden text-center rounded-4">
                                    <div className="bg-light p-4" style={{ position: 'relative' }}>
                                        <Badge bg="danger" className="position-absolute px-3 py-2 fs-6 shadow-sm border border-white" style={{ top: '15px', right: '15px' }}>WANTED</Badge>
                                        <img
                                            src={person.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=991b1b&color=fff&size=200`}
                                            alt={person.name}
                                            style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '5px solid #fff', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                                        />
                                    </div>
                                    <Card.Body className="p-4 bg-white d-flex flex-column justify-content-between">
                                        <div>
                                            <h5 className="fw-bold text-dark mb-1">{person.name}</h5>
                                            <p className="text-danger fw-bold mb-3">{person.crimeType}</p>

                                            <hr className="my-2" style={{ borderColor: '#e2e8f0' }} />

                                            <div className="small text-start mb-2 mt-3">
                                                <span className="text-muted fw-bold">LAST SCANNED LOCATION:</span><br />
                                                <span className="fw-bold text-dark">{person.lastSeen || 'Unknown'}</span>
                                            </div>

                                            <div className="small text-start">
                                                <span className="text-muted fw-bold">AGE:</span> <span className="fw-bold text-dark">{person.age || 'Unknown'}</span>
                                            </div>

                                            {person.description && (
                                                <div className="small text-start mt-3 p-3 bg-light rounded-3 text-secondary border">
                                                    "{person.description}"
                                                </div>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <div className="text-center py-5">
                        <FaExclamationTriangle size={40} className="text-muted mb-3 opacity-50" />
                        <h5 className="fw-bold text-muted">NO WANTED RECORDS FOUND</h5>
                        <p className="text-muted">No records match your search criteria.</p>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default WantedList;
