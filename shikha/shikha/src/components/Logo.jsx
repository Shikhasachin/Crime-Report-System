import React from 'react';

const Logo = ({ width = 48, height = 48, className = "" }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0F4C81" />
                    <stop offset="100%" stopColor="#536dfe" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Outer stylized shield */}
            <path
                d="M50 8C50 8 20 20 20 40C20 65 50 90 50 90C50 90 80 65 80 40C80 20 50 8 50 8Z"
                fill="url(#shieldGradient)"
                stroke="rgba(83, 109, 254, 0.4)"
                strokeWidth="2"
                filter="url(#glow)"
            />

            {/* Inner minimalist tech/safety lines */}
            <path
                d="M50 16L30 24V42C30 58 50 78 50 78C50 78 70 58 70 42V24L50 16Z"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Center focal star (Ashoka Chakra inspiration combined with safety vibe) */}
            <circle cx="50" cy="42" r="6" fill="#ffffff" />
            <path d="M50 28V36M50 48V56M36 42H44M56 42H64" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

            {/* Connecting dot for mesh/network trace feeling */}
            <circle cx="50" cy="20" r="2.5" fill="#38ef7d" />
            <circle cx="50" cy="84" r="2.5" fill="#38ef7d" />
        </svg>
    );
};

export default Logo;
