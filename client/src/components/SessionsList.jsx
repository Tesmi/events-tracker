import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const SessionsList = ({ onSelectSession, selectedSessionId }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/sessions')
      .then(res => {
        setSessions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch sessions', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading sessions...</div>;

  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h3 style={{ margin: 0, padding: '15px 20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>Recent Sessions</h3>
      {sessions.length === 0 ? <p style={{ padding: '20px' }}>No sessions found.</p> : (
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0, maxHeight: '600px', overflowY: 'auto' }}>
          {sessions.map(session => (
            <li 
              key={session.session_id} 
              onClick={() => onSelectSession(session.session_id)}
              style={{
                padding: '15px 20px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                backgroundColor: selectedSessionId === session.session_id ? '#e6f2ff' : 'white',
                transition: 'background-color 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong style={{ color: '#0056b3' }}>ID: {session.session_id.replace('sess_', '').slice(0, 8)}...</strong>
                <span style={{ backgroundColor: '#28a745', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8em', fontWeight: 'bold' }}>
                  {session.event_count} events
                </span>
              </div>
              <div style={{ fontSize: '0.85em', color: '#6c757d' }}>
                Last active: {new Date(session.last_event).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SessionsList;
