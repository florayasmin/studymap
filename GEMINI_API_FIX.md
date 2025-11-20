# Fix Gemini API "Blocked" Error

## The Problem
The error "Requests to this API generativelanguage.googleapis.com method google.ai.generativelanguage.v1.GenerativeService.GenerateContent are blocked" means:

1. **Gemini API is not enabled** in your Google Cloud project
2. **API key doesn't have access** to Gemini API
3. **API key restrictions** are blocking the request

## Solution Steps

### Step 1: Enable Gemini API in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Go to **APIs & Services** → **Library**
4. Search for **"Generative Language API"** or **"Gemini API"**
5. Click on it and click **Enable**

### Step 2: Check API Key Restrictions

1. Go to **APIs & Services** → **Credentials**
2. Click on your API key
3. Under **API restrictions**:
   - Make sure **"Don't restrict key"** is selected, OR
   - If restricted, ensure **"Generative Language API"** is checked
4. Click **Save**

### Step 3: Verify the API Key Works

After enabling, restart your server:
```bash
# Stop the server (Ctrl+C)
# Then restart:
node server.js
```

### Step 4: Test Again

Try getting recommendations in the app again.

## Alternative: Use a Different API Key

If you want to keep your Maps API key separate:

1. Create a **new API key** in Google Cloud Console
2. Enable **Generative Language API** for that key
3. Update your `.env` file:
   ```
   GEMINI_API_KEY=your_new_gemini_api_key_here
   ```
4. Restart the server

## Current Configuration

- **Model**: `gemini-1.5-flash-latest` (or `gemini-2.0-flash` from .env)
- **API Version**: `v1beta`

The server code has been updated to use `v1beta` API which is more stable.

