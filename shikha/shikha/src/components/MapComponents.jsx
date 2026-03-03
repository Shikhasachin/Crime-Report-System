import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons not displaying correctly in standard React builds
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle click events on map for picking location
const LocationMarker = ({ setLocation }) => {
    const [position, setPosition] = useState(null);

    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            setLocation(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position}>
            <Popup>Selected Location</Popup>
        </Marker>
    );
};

export const LocationPicker = ({ onLocationSelect }) => {
    // Default center (Kerala, India)
    const defaultCenter = [9.9312, 76.2673];

    return (
        <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={false} style={{ height: '300px', width: '100%', borderRadius: '8px' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker setLocation={onLocationSelect} />
        </MapContainer>
    );
};

export const CrimeMap = ({ reports }) => {
    // Center map based on average of report locations or default (Kerala)
    const defaultCenter = [9.9312, 76.2673];

    return (
        <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={true} style={{ height: '400px', width: '100%', borderRadius: '12px' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {reports.map((report) => {
                if (!report.lat || !report.lng) return null;
                const isClosed = report.status?.toLowerCase() === 'closed';
                const hotspotColor = isClosed ? '#10b981' : '#ef4444'; // Emerald Green / Red

                return (
                    <CircleMarker
                        key={report.reportId || report._id || Math.random()}
                        center={[report.lat, report.lng]}
                        pathOptions={{ color: hotspotColor, fillColor: hotspotColor, fillOpacity: 0.5, weight: 2 }}
                        radius={15}
                    >
                        <Popup>
                            <strong>{report.category}</strong> <br />
                            {report.location} <br />
                            Status: <span style={{ color: hotspotColor, fontWeight: 'bold' }}>{report.status?.toUpperCase()}</span>
                        </Popup>
                    </CircleMarker>
                );
            })}
        </MapContainer>
    );
};
