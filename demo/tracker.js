// tracker.js
(function() {
  const BACKEND_URL = 'http://localhost:5001/api/events';
  
  // 1. Session Management
  function getSessionId() {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  const sessionId = getSessionId();

  // 2. Event Sending
  function sendEvent(eventType, additionalData = {}) {
    // Determine the page path, or default to a demo path if we are on file://
    let pageUrl = window.location.pathname;
    if (pageUrl === '/' || pageUrl === '' || pageUrl.endsWith('demo.html')) {
        pageUrl = '/demo.html';
    }

    const payload = {
      session_id: sessionId,
      event_type: eventType,
      page_url: pageUrl,
      timestamp: new Date().toISOString(),
      ...additionalData
    };

    fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).catch(err => console.error('Error tracking event:', err));
  }

  // 3. Track Page View
  window.addEventListener('load', () => {
    sendEvent('page_view');
  });

  // 4. Track Clicks
  window.addEventListener('click', (event) => {
    sendEvent('click', {
      click_x: event.clientX,
      click_y: event.clientY
    });
  });
})();
