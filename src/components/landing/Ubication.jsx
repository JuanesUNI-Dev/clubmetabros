import React from 'react';

const Ubication = ({ className = '' }) => {
  const address = 'Club Meta, Cl. 47a #2911, Villavicencio, Meta';
  const mapsQuery = encodeURIComponent(address);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  const embedSrc = `https://maps.google.com/maps?q=${mapsQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section className={`ubication ${className}`} style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>
      <h2 style={{ marginBottom: '0.5rem' }}></h2>
      <p style={{ marginTop: 0, fontWeight: 600 }}>{address}</p>

      <div style={{ marginTop: '1rem', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
        <iframe
          title="Club Meta location"
          src={embedSrc}
          width="100%"
          height="350"
          style={{ border: 0, display: 'block' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1a73e8', textDecoration: 'none', fontWeight: 600 }}>
          Open in Google Maps
        </a>
      </div>
    </section>
  );
};

export default Ubication;
