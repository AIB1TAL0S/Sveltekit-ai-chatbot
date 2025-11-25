# Test Cases for SvelteKit AI Chatbot

## TC001: Send Text Message
**Test Case ID:** TC001  
**Test Scenario:** Verify that the user can send a text message to the chatbot and receive a response.  
**Pre-condition:** 
- Application is running and accessible.
- User is on the main chat interface.
- Internet connection is active.

**Test Case Steps:**
1. Click on the chat input field at the bottom of the screen.
2. Type "Hello, how are you?" into the input field.
3. Click the "Send" button or press the "Enter" key.

**Expected Result:**
- The user's message "Hello, how are you?" immediately appears in the message list aligned to the right.
- A loading indicator (e.g., "Thinking..." or spinner) appears while the bot is processing.
- The input field is cleared.
- After a brief delay, the AI's response appears in the message list aligned to the left.
- The chat view automatically scrolls to the newest message.

---

## TC002: Switch AI Agent
**Test Case ID:** TC002  
**Test Scenario:** Verify that the user can switch between different AI agents (e.g., from General Assistant to Coding Expert).  
**Pre-condition:** 
- Application is running.
- Sidebar is visible (or accessible via toggle on mobile).

**Test Case Steps:**
1. Locate the Sidebar containing the list of agents (General Assistant, Coding Expert, etc.).
2. Click on the "Coding Expert" agent card.

**Expected Result:**
- The selected agent is highlighted in the sidebar.
- The chat header updates to display "Coding Expert".
- The message history updates to show the conversation context specific to the "Coding Expert" (or clears if new).
- A hidden system prompt is sent to the backend to switch the persona.

---

## TC003: Voice Input (Speech-to-Text)
**Test Case ID:** TC003  
**Test Scenario:** Verify that the user can use the microphone to input text.  
**Pre-condition:** 
- Application is running.
- Device has a working microphone.
- Browser permissions for microphone access are granted.

**Test Case Steps:**
1. Click the microphone icon in the input area.
2. Speak a clear sentence (e.g., "What is the weather today?").
3. Click the microphone icon again to stop recording (or wait for silence detection if enabled).

**Expected Result:**
- The microphone icon indicates active recording (e.g., changes color or pulses).
- The spoken words are transcribed and appear in the input field (or are sent automatically depending on configuration).
- If sent automatically, the flow follows the expected result of TC001.

---

## TC004: Clear Chat History
**Test Case ID:** TC004  
**Test Scenario:** Verify that the user can clear the current conversation history.  
**Pre-condition:** 
- Application is running.
- There are existing messages in the chat window.

**Test Case Steps:**
1. Locate the "Clear Chat" or "Trash" icon in the chat header.
2. Click the icon.

**Expected Result:**
- All messages are removed from the view.
- A system message (e.g., "Chat cleared. How can I help you?") appears.
- The conversation history in the backend/local state is reset.

---

## TC005: Text-to-Speech (Auto-Speak)
**Test Case ID:** TC005  
**Test Scenario:** Verify that the AI's response is read aloud when Auto-Speak is enabled.  
**Pre-condition:** 
- Application is running.
- "Auto-speak" toggle in the header is enabled.
- Device volume is audible.

**Test Case Steps:**
1. Ensure the "Auto-speak" toggle is ON.
2. Send a message to the chatbot (e.g., "Tell me a short joke").
3. Wait for the response.

**Expected Result:**
- The AI text response appears on screen.
- The device audio output plays the spoken version of the AI's response.
- A visual indicator (like a speaker icon) might show that audio is playing.
