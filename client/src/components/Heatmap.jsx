import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5001/api';

const Heatmap = () => {
  const [pageUrl, setPageUrl] = useState('/demo.html');
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHeatmap = () => {
    if (!pageUrl) return;
    setLoading(true);
    axios.get(`${BACKEND_URL}/heatmap/${encodeURIComponent(pageUrl)}`)
      .then(res => {
        setClicks(res.data.clicks);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch heatmap', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHeatmap();
  }, [pageUrl]);

  const maxClickX = clicks.length > 0 ? Math.max(...clicks.map(c => c.x)) : 1000;
  const maxClickY = clicks.length > 0 ? Math.max(...clicks.map(c => c.y)) : 600;
  
  const containerWidth = Math.max(1000, maxClickX + 100);
  const containerHeight = Math.max(600, maxClickY + 100);

  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h3 style={{ margin: '0 0 20px 0' }}>Heatmap View</h3>
      
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px' }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Target Page:</label>
        <input 
          type="text" 
          value={pageUrl} 
          onChange={e => setPageUrl(e.target.value)} 
          style={{ 
            flex: 1, 
            padding: '10px', 
            border: '1px solid #ccc', 
            borderRadius: '4px',
            marginRight: '10px'
          }}
          placeholder="e.g. /demo.html"
        />
        <button 
          onClick={fetchHeatmap} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </button>
      </div>
      
      <div style={{ width: '100%', overflow: 'auto', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f1f3f5', maxHeight: '700px' }}>
        <div style={{ 
          position: 'relative', 
          width: `${containerWidth}px`, 
          height: `${containerHeight}px`, 
          backgroundImage: 'linear-gradient(#e9ecef 1px, transparent 1px), linear-gradient(90deg, #e9ecef 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          margin: '0 auto'
        }}>
          <div style={{ position: 'sticky', top: 15, left: 15, color: '#6c757d', fontSize: '14px', fontWeight: 'bold', backgroundColor: 'rgba(255,255,255,0.9)', padding: '5px 10px', borderRadius: '4px', zIndex: 10, display: 'inline-block', margin: '15px' }}>
            Simplified Page Representation (Total Clicks: {clicks.length})
          </div>
          
          {clicks.map((click, index) => (
            <div 
              key={index}
              style={{
                position: 'absolute',
                left: `${click.x}px`,
                top: `${click.y}px`,
                width: '12px',
                height: '12px',
                backgroundColor: 'rgba(220, 53, 69, 0.6)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                boxShadow: '0 0 10px rgba(220, 53, 69, 0.8)',
                zIndex: 5
              }}
              title={`Time: ${new Date(click.timestamp).toLocaleTimeString()}`}
            />
          ))}
          
          {clicks.length === 0 && !loading && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '600px', color: '#6c757d', fontSize: '1.2em' }}>
              No click data available for "{pageUrl}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
