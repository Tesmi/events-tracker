import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000/api';

const SessionDetail = ({ sessionId }) => {
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${BACKEND_URL}/sessions/${sessionId}`)
      .then(res => {
        setSessionData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch session detail', err);
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) return <div style={{ padding: '20px' }}>Loading details for session...</div>;
  if (!sessionData) return <div style={{ padding: '20px' }}>No data available.</div>;

  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
        <h3 style={{ margin: 0 }}>User Journey</h3>
        <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#6c757d' }}>Session ID: {sessionData.session_id}</p>
      </div>
      
      <div style={{ padding: '20px', maxHeight: '560px', overflowY: 'auto' }}>
        <div style={{ position: 'relative', borderLeft: '2px solid #e9ecef', marginLeft: '10px', paddingLeft: '20px' }}>
          {sessionData.events.map((event, index) => (
            <div key={index} style={{ position: 'relative', marginBottom: '25px' }}>
              <div style={{ 
                position: 'absolute', 
                left: '-26px', 
                top: '0', 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%', 
                backgroundColor: event.event_type === 'page_view' ? '#17a2b8' : '#fd7e14',
                border: '2px solid white',
                boxShadow: '0 0 0 1px #e9ecef'
              }}></div>
              
              <div style={{ 
                backgroundColor: '#fff', 
                border: '1px solid #f0f0f0', 
                borderRadius: '6px', 
                padding: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ 
                    display: 'inline-block',
                    padding: '3px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.75em', 
                    fontWeight: 'bold',
                    backgroundColor: event.event_type === 'page_view' ? '#e0f7fa' : '#fff3cd',
                    color: event.event_type === 'page_view' ? '#00838f' : '#856404',
                    marginRight: '10px',
                    textTransform: 'uppercase'
                  }}>
                    {event.event_type}
                  </span>
                  <span style={{ fontWeight: '500', color: '#333' }}>{event.page_url}</span>
                </div>
                
                <div style={{ fontSize: '0.85em', color: '#888', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{new Date(event.timestamp).toLocaleString()}</span>
                  
                  {event.event_type === 'click' && event.click_x !== undefined && (
                    <span style={{ backgroundColor: '#f1f3f5', padding: '2px 6px', borderRadius: '4px' }}>
                      X: {event.click_x}, Y: {event.click_y}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;
