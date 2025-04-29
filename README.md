1. 
Right-click on index.html and select "Open with Live Server"

2. 
Open your browser's developer console:

Press F12 on your keyboard, or
Right-click anywhere on the page and select "Inspect" or "Inspect Element," then click on the "Console" tab

3. 
First, you need to copy the content of the exploit.js file into the console:

Open the exploit.js file in a text editor
Copy all the code (Ctrl+A to select all, then Ctrl+C to copy)
Paste it into the browser console (Ctrl+V), and press Enter
4. 
Now you can run individual exploit functions by typing their name followed by parentheses:

stealLocalStorageData()

Then press Enter to run the command.
5. 
For the specific WebSocket message injection, try:

injectMaliciousWebSocketMessage()

6. 
To run all exploits at once, you can use:

runAllExploits()

The console should display detailed output in red text showing what an attacker could access and how they could exploit each vulnerability. For the WebSocket message injection specifically, it will either fill the message input field with a malicious payload or show you what that payload would look like.
Note that some exploits are simulated rather than actually performing harmful actions (e.g., the hijackUserSession() function is commented out in runAllExploits() to avoid actually modifying your session).RetryClaude can make mistakes. Please double-check responses.