# Breathe - Breathing Exercise App

A beautiful, calming breathing exercise app with multiple techniques including Wim Hof Method, 4-7-8 Sleep technique, Physiological Sigh, and Anxiety Release.

## Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push to GitHub first:**
   ```bash
   cd breathe-app
   git init
   git add .
   git commit -m "Initial commit"
   ```
   Then create a new repo on GitHub and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/breathe-app.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign up/login (you can use your GitHub account)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Click "Deploy" - that's it!

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   cd breathe-app
   vercel
   ```
   Follow the prompts - it will give you a live URL!

## Local Development

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

## Features

- **Balanced Breathing** - 4-4 rhythm for calm and focus
- **Sleep & Calm (4-7-8)** - Dr. Weil's technique for sleep
- **Physiological Sigh** - Double inhale for quick stress relief
- **Wim Hof Method** - 30 power breaths + breath retention
- **Anxiety Release** - User-paced breathing into tension areas
