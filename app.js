// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const saveProfileBtn = document.getElementById('save-profile');
    const loadProfileBtn = document.getElementById('load-profile');
    const profileResult = document.getElementById('profile-result');
    
    const connectChatBtn = document.getElementById('connect-chat');
    const disconnectChatBtn = document.getElementById('disconnect-chat');

    const sendMessageBtn = document.getElementById('send-message');
    const messageInput = document.getElementById('message-input');
    const chatMessages = document.getElementById('chat-messages');
    
    const loadTransactionsBtn = document.getElementById('load-transactions');
    const transactionsList = document.getElementById('transactions-list');
    
    // ========================================
    // VULNERABILITY 1: Insecure LocalStorage
    // ========================================
    
    saveProfileBtn.addEventListener('click', function() {
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const accountNumber = document.getElementById('account-number').value;
        const balance = document.getElementById('balance').value;
        const pin = document.getElementById('pin').value;
        
        localStorage.setItem('simplebank_username', username);
        localStorage.setItem('simplebank_email', email);
        localStorage.setItem('simplebank_account', accountNumber);
        localStorage.setItem('simplebank_balance', balance);
        localStorage.setItem('simplebank_pin', pin);
        
        const insecureToken = `${username}_${Date.now()}`;
        localStorage.setItem('simplebank_auth_token', insecureToken);
        
        profileResult.innerHTML = '<div class="success">Profile saved successfully!</div>';
    });
    
    loadProfileBtn.addEventListener('click', function() {
        const username = localStorage.getItem('simplebank_username') || '';
        const email = localStorage.getItem('simplebank_email') || '';
        const accountNumber = localStorage.getItem('simplebank_account') || '';
        const balance = localStorage.getItem('simplebank_balance') || '';
        const pin = localStorage.getItem('simplebank_pin') || '';
        
        if (username) {
            document.getElementById('username').value = username;
            document.getElementById('email').value = email;
            document.getElementById('account-number').value = accountNumber;
            document.getElementById('balance').value = balance;
            document.getElementById('pin').value = pin;
            profileResult.innerHTML = '<div class="success">Profile loaded successfully!</div>';
        } else {
            profileResult.innerHTML = '<div class="error">No profile found!</div>';
        }
    });

    // ========================================
    // VULNERABILITY 2: Insecure WebSockets
    // ========================================
    
    let socket = null;
    
    connectChatBtn.addEventListener('click', function() {
        try {
            socket = {
                connected: true,
                send: function(data) {
                    console.log('WebSocket message sent:', data);
                    // Simulate server response with chat message
                    setTimeout(() => {
                        const message = JSON.parse(data);
                        if (message.type === 'auth') {
                            addChatMessage('Authentication successful! Welcome to SimpleBank support.', 'system');
                        } else if (message.type === 'message') {
                            // Simulate response from support
                            addChatMessage('Thank you for your message. An agent will respond shortly.', 'support');
                        }
                    }, 1000);
                },
                close: function() {
                    this.connected = false;
                    console.log('WebSocket connection closed');
                }
            };
            
            addChatMessage('Connected to chat server!', 'system');
            
            // Send authentication data with user info (vulnerable to CSRF/XSS)
            const authData = {
                type: 'auth',
                username: localStorage.getItem('simplebank_username'),
                accountNumber: localStorage.getItem('simplebank_account'),
                token: localStorage.getItem('simplebank_auth_token')
            };
            
            socket.send(JSON.stringify(authData));
        } catch (e) {
            addChatMessage('Failed to connect to chat server.', 'system');
            console.error('WebSocket connection error:', e);
        }
    });
    
    disconnectChatBtn.addEventListener('click', function() {
        if (socket && socket.connected) {
            socket.close();
            addChatMessage('Disconnected from chat server.', 'system');
            socket = null;
        } else {
            addChatMessage('Not connected to any chat server.', 'system');
        }
    });
    
    sendMessageBtn.addEventListener('click', function() {
        const message = messageInput.value.trim();
        
        if (message && socket && socket.connected) {
            // VULNERABILITY: No input sanitization
            const messageData = {
                type: 'message',
                text: message
            };
            
            // Inject a malicious payload for XSS demonstration
            if (message.includes("<script>")) {
                messageData.text = '<img src="x" onerror="alert(\'XSS via WebSocket message!\')">';
            }
            
            socket.send(JSON.stringify(messageData));
            addChatMessage(message, 'user');
            messageInput.value = '';
        } else if (!socket || !socket.connected) {
            addChatMessage('Please connect to the chat server first.', 'system');
        }
    });
    
    function addChatMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        
        if (sender === 'user') {
            messageElement.classList.add('user-message');
            messageElement.textContent = `You: ${message}`;
        } else if (sender === 'support') {
            messageElement.classList.add('support-message');
            messageElement.textContent = `Support: ${message}`;
        } else {
            messageElement.classList.add('system-message');
            messageElement.textContent = `System: ${message}`;
        }

        // Add HTML content directly into the message if it's an XSS payload
        if (sender === 'user' && message.includes("<img")) {
            messageElement.innerHTML = `You: ${message}`;
        }
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ========================================
    // VULNERABILITY 3: Improper CORS handling
    // ========================================
    
    loadTransactionsBtn.addEventListener('click', function() {
        transactionsList.innerHTML = '<p>Loading transactions...</p>';
        
        // Simulate API request with CORS vulnerability
        setTimeout(() => {
            const authToken = localStorage.getItem('simplebank_auth_token');
            
            const transactions = [
                { date: '2023-03-15', description: 'Salary Deposit', amount: '+$2,500.00' },
                { date: '2023-03-14', description: 'Grocery Store', amount: '-$125.65' },
                { date: '2023-03-12', description: 'Gas Station', amount: '-$45.30' },
                { date: '2023-03-10', description: 'Online Shopping', amount: '-$78.99' },
                { date: '2023-03-05', description: 'Restaurant', amount: '-$65.40' }
            ];
            
            displayTransactions(transactions);
        }, 1000);
    });
    
    function displayTransactions(transactions) {
        if (!transactions || transactions.length === 0) {
            transactionsList.innerHTML = '<p>No transactions found.</p>';
            return;
        }
        
        let html = '<div class="transaction-header transaction-item">' +
                  '<div class="transaction-date"><strong>Date</strong></div>' +
                  '<div class="transaction-description"><strong>Description</strong></div>' +
                  '<div class="transaction-amount"><strong>Amount</strong></div>' +
                  '</div>';

        transactions.forEach(transaction => {
            const amountClass = transaction.amount.startsWith('+') ? 'positive' : 'negative';
            
            html += `<div class="transaction-item">
                      <div class="transaction-date">${transaction.date}</div>
                      <div class="transaction-description">${transaction.description}</div>
                      <div class="transaction-amount ${amountClass}">${transaction.amount}</div>
                    </div>`;
        });
        
        transactionsList.innerHTML = html;
    }

    // Initialize the app by trying to load profile data if available
    if (localStorage.getItem('simplebank_username')) {
        loadProfileBtn.click();
    }
});
