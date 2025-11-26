# 🤖 SvelteKit AI Chatbot

> **Experience the future of conversation.** A modern, responsive, and intelligent chatbot built with **SvelteKit**, **TailwindCSS**, and powered by the incredible **Google Gemini API**. 🚀

---

## ✨ Features

Unlock a world of possibilities with these powerful features:

- 💬 **Real-time Chat Interface**: Enjoy a buttery-smooth, responsive chat experience that feels instantaneous.
- 🎭 **Multiple AI Personas**: Need a coding buddy? A creative muse? Or just a general assistant? Switch instantly between specialized agents like **Coding Expert**, **Creative Writer**, and more!
- 🎙️ **Voice Capabilities**:
  - 🗣️ **Speech-to-Text**: Don't type, just talk! Speak naturally to the bot using your microphone.
  - 🔊 **Text-to-Speech**: Listen to the AI's insightful responses with crystal-clear audio.
- 📱 **Responsive Design**: Whether you're on a massive desktop monitor or a mobile phone, the experience is flawless.
- 🎨 **Modern UI**: Sleek, beautiful, and easy on the eyes. Built with **TailwindCSS** and fully optimized for **Dark Mode** lovers. 🌙

---

## 🛠️ Prerequisites

Before you dive in, make sure you have your toolkit ready:

- 🟢 **[Node.js](https://nodejs.org/)** (v18 or higher recommended)
- 📦 **[npm](https://www.npmjs.com/)** (usually comes with Node.js)

You'll also need the keys to the kingdom:

- 🔑 **Google Gemini API Key**: Grab yours for free from [Google AI Studio](https://aistudio.google.com/).
- ☁️ **Cloudflare Account**: (Optional) If you want to deploy your creation to the world via Cloudflare Pages/Workers.

---

## 🚀 Setup & Installation

Get up and running in minutes!

1.  **📥 Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd svelte-ai-chatbot
    ```

2.  **📦 Install dependencies**:
    ```bash
    npm install
    ```

3.  **🔐 Environment Configuration**:
    Create a `.env` file in the root directory. This is where your secrets live.

    Add your Google Gemini API key:
    ```env
    GEMINI_API_KEY=your_actual_api_key_here
    ```

---

## 💻 Development

Ready to code? Start your local development server:

```bash
npm run dev
```

🎉 Open your browser and navigate to `http://localhost:5173`. Your personal AI assistant is waiting!

---

## 🌍 Building & Deployment

Take your bot global! This project is pre-configured for **Cloudflare Workers** using `@sveltejs/adapter-cloudflare`.

### ☁️ Deploy to Cloudflare

1.  **🔑 Login to Cloudflare** (one-time setup):
    ```bash
    npx wrangler login
    ```
    Follow the browser instructions to authorize the CLI.

2.  **🚀 Deploy**:
    Build and push your app to the edge with a single command:
    ```bash
    npm run deploy
    ```
    *(This runs `npm run build` followed by `wrangler deploy`)*

### 🏗️ Manual Build

Want to build locally without deploying?

```bash
npm run build
```

Preview your production build:

```bash
npm run preview
```

---

## 📂 Project Structure

Here's a quick map of the territory:

- 🛣️ `src/routes`: The heart of your app—contains pages and API endpoints.
- 🧩 `src/lib/components`: Your building blocks—reusable Svelte components like `Chatbot`, `Sidebar`,`Organic Sphere`. etc '.
- 🧠 `src/routes/api/chat`: The brain—the backend endpoint that talks to Gemini.

---
