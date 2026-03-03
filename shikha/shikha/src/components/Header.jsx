import React from 'react';
import { Container, Dropdown, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';
import Logo from './Logo';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <style>
                {`
                /* REINSTATED: Solid Navy Background for the main header */
                .main-header-fixed {
                    background-color: #001f3f !important; 
                    height: 70px;
                    display: flex;
                    align-items: center;
                    border-bottom: 3px solid #ffc107; /* Gold Honor Line */
                    width: 100%;
                    z-index: 9999;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                }

                .header-brand {
                    text-decoration: none !important;
                    display: flex;
                    align-items: center;
                }

                .header-brand-text {
                    color: #ffffff !important;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    font-size: 1.2rem;
                    margin-left: 10px;
                }

                /* Nav Links: Reverted to White/Gold */
                .header-nav-link {
                    color: #ffffff !important;
                    text-decoration: none !important;
                    font-weight: 700;
                    text-transform: uppercase;
                    font-size: 0.85rem;
                    margin: 0 15px;
                    padding: 5px 0;
                    border-bottom: 3px solid transparent;
                    transition: all 0.2s ease;
                }

                .header-nav-link:hover {
                    color: #ffc107 !important;
                    border-bottom: 3px solid #ffc107;
                }

                /* Right Side: User Profile Box */
                .user-profile-trigger {
                    background: rgba(255, 255, 255, 0.1) !important;
                    border: 1px solid rgba(255, 255, 255, 0.3) !important;
                    color: #ffffff !important;
                    padding: 6px 18px;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    font-weight: 700;
                }

                .user-profile-trigger:hover {
                    background: rgba(255, 255, 255, 0.2) !important;
                    border-color: #ffc107 !important;
                }

                .dropdown-menu-dark-navy {
                    background-color: #001f3f !important;
                    border: 2px solid #ffc107 !important;
                    margin-top: 10px;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
                }

                .dropdown-item-navy {
                    color: #ffffff !important;
                    font-weight: 600;
                }

                .dropdown-item-navy:hover {
                    background-color: #002d5b !important;
                    color: #ffc107 !important;
                }
                `}
            </style>

            <header className="main-header-fixed">
                <Container className="d-flex justify-content-between align-items-center">

                    {/* 1. LOGO & BRAND */}
                    <Link
                        to={user?.role === 'police' ? '/police/dashboard' : '/citizen/dashboard'}
                        className="header-brand"
                    >
                        <Logo width={40} height={40} />
                        <span className="header-brand-text">Kerala Police</span>
                    </Link>

                    {/* 2. NAVIGATION LINKS (Hidden on small screens) */}
                    <div className="d-none d-lg-flex">
                        {user?.role === 'citizen' && (
                            <>
                                <Link to="/citizen/dashboard" className="header-nav-link">Dashboard</Link>
                                <Link to="/citizen/report" className="header-nav-link">File Report</Link>
                                <Link to="/citizen/track" className="header-nav-link">Track Case</Link>
                            </>
                        )}
                        {user?.role === 'police' && (
                            <>
                                <Link to="/police/dashboard" className="header-nav-link">Console</Link>
                                <Link to="/police/records" className="header-nav-link">Records</Link>
                                <Link to="/police/officers" className="header-nav-link">Officers</Link>
                            </>
                        )}
                    </div>

                    {/* 3. USER ACCOUNT ACTIONS */}
                    <div className="d-flex align-items-center">
                        {user ? (
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="none" className="user-profile-trigger d-flex align-items-center shadow-none">
                                    <FaUserCircle size={18} className="me-2" />
                                    <span className="d-none d-sm-inline">{user.name}</span>
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="dropdown-menu-dark-navy">
                                    <Dropdown.Item as={Link} to="/profile" className="dropdown-item-navy">
                                        <FaShieldAlt className="me-2" /> Profile Settings
                                    </Dropdown.Item>
                                    <Dropdown.Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                                    <Dropdown.Item onClick={handleLogout} className="text-danger fw-bold">
                                        <FaSignOutAlt className="me-2" /> Secure Logout
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <Button as={Link} to="/" variant="warning" className="fw-bold btn-sm px-4">
                                LOGIN
                            </Button>
                        )}
                    </div>

                </Container>
            </header>
        </>
    );
};

export default Header;