# SvelteKit AI Chatbot

A modern, responsive AI chatbot application built with SvelteKit, TailwindCSS, and powered by the Google Gemini API.

## Features

- **Real-time Chat Interface**: Smooth and responsive chat experience.
- **Multiple AI Personas**: Switch between different agents like General Assistant, Coding Expert, Creative Writer, and more.
- **Voice Capabilities**:
  - **Speech-to-Text**: Speak to the bot using your microphone.
  - **Text-to-Speech**: Hear the AI's responses read aloud.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Modern UI**: Built with TailwindCSS for a sleek, dark-mode compatible look.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

You will also need:

- A **Google Gemini API Key**. You can get one from [Google AI Studio](https://aistudio.google.com/).
- A **Cloudflare Account** (if you plan to deploy to Cloudflare Pages/Workers).

## Setup & Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd svelte-ai-chatbot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the root directory of the project. You can copy the example if provided, or simply create a new file.

   Add your Google Gemini API key to the `.env` file:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## Development

To start the development server locally:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Building & Deployment

This project is configured to deploy to **Cloudflare Workers** using `@sveltejs/adapter-cloudflare`.

### Deploy to Cloudflare

1. **Login to Cloudflare** (one-time setup):
   ```bash
   npx wrangler login
   ```
   Follow the instructions in your browser to authorize the CLI.

2. **Deploy**:
   Run the deploy script, which builds the application and pushes it to Cloudflare:
   ```bash
   npm run deploy
   ```

   This command runs `npm run build` followed by `wrangler deploy`.

### Manual Build

To create a production build without deploying immediately:

```bash
npm run build
```

You can preview the production build locally using:

```bash
npm run preview
```

## Project Structure

- `src/routes`: Contains the application pages and API endpoints.
- `src/lib/components`: Reusable Svelte components (Chatbot, Sidebar, etc.).
- `src/routes/api/chat`: The backend endpoint that communicates with the Gemini API.
