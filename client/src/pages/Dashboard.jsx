import React, { useState } from 'react';
import SessionsList from '../components/SessionsList';
import SessionDetail from '../components/SessionDetail';
import Heatmap from '../components/Heatmap';

const Dashboard = () => {
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [activeTab, setActiveTab] = useState('sessions'); // 'sessions' or 'heatmap'

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eaeaea', paddingBottom: '20px' }}>
        <h1 style={{ margin: 0, color: '#333' }}>Analytics Dashboard</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setActiveTab('sessions')}
            style={{ 
              padding: '10px 20px', 
              fontWeight: activeTab === 'sessions' ? 'bold' : 'normal',
              backgroundColor: activeTab === 'sessions' ? '#007bff' : '#f0f0f0',
              color: activeTab === 'sessions' ? 'white' : '#333',
              border: 'none', borderRadius: '4px', cursor: 'pointer'
            }}
          >
            Sessions View
          </button>
          <button 
            onClick={() => setActiveTab('heatmap')}
            style={{ 
              padding: '10px 20px', 
              fontWeight: activeTab === 'heatmap' ? 'bold' : 'normal',
              backgroundColor: activeTab === 'heatmap' ? '#007bff' : '#f0f0f0',
              color: activeTab === 'heatmap' ? 'white' : '#333',
              border: 'none', borderRadius: '4px', cursor: 'pointer'
            }}
          >
            Heatmap View
          </button>
        </div>
      </header>

      <main>
        {activeTab === 'sessions' && (
          <div style={{ display: 'flex', gap: '30px' }}>
            <div style={{ flex: 1, minWidth: '350px', maxWidth: '400px' }}>
              <SessionsList onSelectSession={setSelectedSessionId} selectedSessionId={selectedSessionId} />
            </div>
            <div style={{ flex: 2 }}>
              {selectedSessionId ? (
                <SessionDetail sessionId={selectedSessionId} />
              ) : (
                <div style={{ padding: '40px', border: '2px dashed #ddd', borderRadius: '8px', textAlign: 'center', color: '#888', marginTop: '10px' }}>
                  Select a session from the list to view its journey details.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'heatmap' && (
           <Heatmap />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
