# API Key Security Guide

## 🔒 How API Keys Are Protected

This app uses a **backend proxy server** to keep your API keys secure. The API key is **never** exposed in the mobile app code.

## Architecture

```
Mobile App → Backend Proxy Server → Google Gemini API
           (no API key)            (API key stored here)
```

## Setup Instructions

### 1. Install Backend Dependencies

```bash
npm install
```

### 2. Create Environment File

Create a `.env` file in the root directory:

```bash
GEMINI_API_KEY=your-actual-api-key-here
PORT=3001
```

**Get your API key:** [Google AI Studio](https://makersuite.google.com/app/apikey)

**⚠️ Important:** Never commit the `.env` file to git! It's already in `.gitignore`.

### 3. Start the Backend Server

In one terminal, start the proxy server:

```bash
npm run server
```

You should see:
```
🔒 Secure API proxy server running on http://localhost:3001
✅ API keys are safely stored on the server
```

### 4. Start the Mobile App

In another terminal, start Expo:

```bash
npm start
```

## For Production

### Option 1: Deploy Backend Separately

Deploy `server.js` to a hosting service (Heroku, Railway, Render, etc.):

1. Set `GEMINI_API_KEY` as an environment variable on your hosting service
2. Update `API_PROXY_URL` in your mobile app to point to your deployed server
3. Use `EXPO_PUBLIC_API_PROXY_URL` environment variable or update the constant in `App.jsx`

### Option 2: Use Environment Variables

For the mobile app, you can set:
```
EXPO_PUBLIC_API_PROXY_URL=https://your-backend-server.com
```

## Security Best Practices

✅ **DO:**
- Keep API keys in `.env` file (server-side only)
- Never commit `.env` to version control
- Use environment variables in production
- Deploy backend separately from frontend
- Use HTTPS in production

❌ **DON'T:**
- Put API keys in client-side code
- Use `EXPO_PUBLIC_*` for sensitive keys (they get bundled into the app)
- Commit `.env` files
- Share API keys in screenshots or documentation

## Why This Matters

Even with environment variables like `EXPO_PUBLIC_*`, any code in a React Native app can be inspected. The JavaScript bundle can be extracted and analyzed, exposing any keys in the code.

By using a backend proxy:
- API keys stay on the server
- You can add rate limiting
- You can add authentication
- You can monitor usage
- Keys can be rotated without updating the app

## Troubleshooting

**Error: "GEMINI_API_KEY not configured on server"**
- Make sure your `.env` file exists with `GEMINI_API_KEY` set
- Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Restart the server after creating/updating `.env`

**Error: "Network request failed"**
- Make sure the backend server is running (`npm run server`)
- Check that `API_PROXY_URL` in `App.jsx` matches your server URL
- For iOS Simulator, use `http://localhost:3001`
- For physical device, use your computer's IP: `http://10.0.0.189:3001` (update IP as needed)

