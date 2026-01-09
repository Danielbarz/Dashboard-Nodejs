import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix ikon default leaflet yang kadang hilang di Webpack/React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const HsiMap = ({ data }) => {
    // Pusat peta default (Sekitar Bali/Jatim)
    const position = [-7.98, 112.63]; 

    const getColor = (status) => {
        if (status === 'Completed') return '#10B981'; // Green
        if (status === 'Cancel') return '#EF4444'; // Red
        return '#3B82F6'; // Blue (Open)
    };

    return (
        <MapContainer center={position} zoom={7} style={{ height: '100%', width: '100%', borderRadius: '0.5rem', zIndex: 0 }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data.map((item, idx) => (
                <CircleMarker 
                    key={idx} 
                    center={[item.lat, item.lng]} 
                    pathOptions={{ color: getColor(item.status_group), fillColor: getColor(item.status_group), fillOpacity: 0.7 }}
                    radius={5}
                >
                    <Popup>
                        <div className="text-sm">
                            <p className="font-bold">{item.name}</p>
                            <p>Order ID: {item.id}</p>
                            <p>Witel: {item.witel}</p>
                            <p>Status: <span style={{ color: getColor(item.status_group), fontWeight: 'bold' }}>{item.status_group}</span></p>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    );
};

export default HsiMap;