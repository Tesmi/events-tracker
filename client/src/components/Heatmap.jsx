import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Heatmap = () => {
  const [pageUrl, setPageUrl] = useState('/demo.html');
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(0);

  const fetchHeatmap = () => {
    if (!pageUrl) return;
    setLoading(true);
    api.get(`/heatmap/${encodeURIComponent(pageUrl)}`)
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

  const handleIframeLoad = (e) => {
    try {
      const iframe = e.target;
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const height = Math.max(
        doc.body.scrollHeight, doc.documentElement.scrollHeight,
        doc.body.offsetHeight, doc.documentElement.offsetHeight,
        doc.body.clientHeight, doc.documentElement.clientHeight
      );
      setIframeHeight(height);
    } catch (err) {
      console.error("Could not read iframe content height", err);
      setIframeHeight(3000); // Fallback height if CORS blocked
    }
  };

  const maxClickY = clicks.length > 0 ? Math.max(...clicks.map(c => c.y)) : 600;
  
  const containerHeight = Math.max(600, maxClickY + 100, iframeHeight);

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
          width: '100%', 
          minWidth: '1000px',
          height: `${containerHeight}px`, 
          backgroundImage: 'linear-gradient(#e9ecef 1px, transparent 1px), linear-gradient(90deg, #e9ecef 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          margin: '0 auto'
        }}>
          <div style={{ position: 'sticky', top: 15, left: 15, color: '#6c757d', fontSize: '14px', fontWeight: 'bold', backgroundColor: 'rgba(255,255,255,0.9)', padding: '5px 10px', borderRadius: '4px', zIndex: 10, display: 'inline-block', margin: '15px' }}>
            Page Overlay (Total Clicks: {clicks.length})
          </div>

          <iframe 
            src={pageUrl} 
            onLoad={handleIframeLoad}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              opacity: 0.6,
              pointerEvents: 'none',
              zIndex: 1
            }}
            title="Page Overlay"
          />
          
          {clicks.map((click, index) => (
            <div 
              key={index}
              style={{
                position: 'absolute',
                left: `calc(50% + ${click.x}px)`,
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
