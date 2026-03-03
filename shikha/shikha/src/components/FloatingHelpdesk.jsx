import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { FaCommentDots, FaTimes, FaPaperPlane } from 'react-icons/fa';

const FloatingHelpdesk = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! Welcome to the Kerala Police Citizen Portal. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');

    const faqs = [
        { q: "How to file FIR?", a: "Navigate to the 'Lodge FIR' tab on your dashboard. Fill all mandatory details. If it's an emergency, dial 112 instead." },
        { q: "Is anonymous tip safe?", a: "Yes. Our Anonymous Tip portal uses end-to-end encryption. Your IP and identity are strictly stripped from the request." },
        { q: "How to track status?", a: "Go to the 'Track Report' page and enter your Complaint ID or check the 'Recent System Logs' on your dashboard." }
    ];

    const sendMessage = (text) => {
        if (!text.trim()) return;

        // Add user message
        const newMessages = [...messages, { text, isBot: false }];
        setMessages(newMessages);
        setInput('');

        // Simulate bot reply
        setTimeout(() => {
            let botReply = "I've recorded your query. A human operator will respond within 24 hours via your registered email.";

            // Basic keyword matching
            const lowerText = text.toLowerCase();
            if (lowerText.includes('fir')) botReply = faqs[0].a;
            else if (lowerText.includes('tip') || lowerText.includes('anonymous')) botReply = faqs[1].a;
            else if (lowerText.includes('track') || lowerText.includes('status')) botReply = faqs[2].a;

            setMessages(prev => [...prev, { text: botReply, isBot: true }]);
        }, 1000);
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
            {/* Chat Window */}
            {isOpen && (
                <Card className="shadow-lg border-0 mb-3 overflow-hidden" style={{ width: '320px', borderRadius: '15px', right: 0, bottom: '60px' }}>
                    <div className="bg-primary text-white p-3 d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(45deg, #0f172a, #3b82f6)' }}>
                        <div>
                            <h6 className="mb-0 fw-bold">Virtual Assistant</h6>
                            <small className="opacity-75" style={{ fontSize: '0.7rem' }}>Automated Helpdesk 24/7</small>
                        </div>
                        <Button variant="link" className="text-white p-0" onClick={() => setIsOpen(false)}>
                            <FaTimes />
                        </Button>
                    </div>

                    <Card.Body className="bg-light p-3" style={{ height: '300px', overflowY: 'auto' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`d-flex ${msg.isBot ? 'justify-content-start' : 'justify-content-end'} mb-3`}>
                                <div className={`p-2 rounded-3 ${msg.isBot ? 'bg-white border text-dark' : 'bg-primary text-white'}`} style={{ maxWidth: '85%', fontSize: '0.85rem' }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </Card.Body>

                    {/* Quick FAQ Buttons */}
                    <div className="bg-white border-top p-2 d-flex gap-2 overflow-auto" style={{ whiteSpace: 'nowrap' }}>
                        {faqs.map((faq, idx) => (
                            <Badge key={idx} as="button" bg="light" text="dark" className="border py-1 px-2 pointer" onClick={() => sendMessage(faq.q)}>
                                {faq.q}
                            </Badge>
                        ))}
                    </div>

                    <div className="p-2 bg-white border-top">
                        <div className="d-flex">
                            <Form.Control
                                size="sm"
                                placeholder="Type a question..."
                                className="border-0 shadow-none bg-light rounded-pill px-3"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && sendMessage(input)}
                            />
                            <Button variant="primary" size="sm" className="rounded-circle ms-2" style={{ width: '32px', height: '32px' }} onClick={() => sendMessage(input)}>
                                <FaPaperPlane size={12} />
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Bubble Button */}
            <Button
                className="rounded-circle shadow-lg d-flex align-items-center justify-content-center"
                style={{ width: '60px', height: '60px', background: 'linear-gradient(45deg, #0f172a, #3b82f6)', border: 'none' }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FaTimes size={24} color="white" /> : <FaCommentDots size={24} color="white" />}
            </Button>
        </div>
    );
};

// Also exporting a small dummy Badge component just in case it isn't completely imported from bootstrap above
const Badge = (props) => {
    return (
        <button {...props} style={{ fontSize: '0.75rem', borderRadius: '10px', cursor: 'pointer', ...props.style }}>{props.children}</button>
    );
};

export default FloatingHelpdesk;
