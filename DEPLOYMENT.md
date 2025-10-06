# Deploy HDWYG PDF Card Reader to Render

## 🚀 Quick Deployment Steps

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - HDWYG PDF Card Reader"
git branch -M main
git remote add origin https://github.com/jphan10/HDWYG-Game
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Use these settings:

**Build & Deploy Settings:**
- **Name**: `hdwyg-card-reader` (or your preferred name)
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Branch**: `main`

**Advanced Settings:**
- **Auto-Deploy**: Yes (deploys automatically on git push)

### Step 3: Environment Variables (if needed)
No environment variables are required for this app.

## 📋 **Render Configuration**

Your app is already configured with:
- ✅ `package.json` with proper scripts
- ✅ `server.js` with Express server
- ✅ Static file serving
- ✅ PDF CORS headers
- ✅ Port configuration for Render

## 🌐 **After Deployment**

1. Render will provide you with a URL like: `https://hdwyg-card-reader.onrender.com`
2. Your app will be live and accessible to anyone
3. All features will work including:
   - PDF loading and rendering
   - Card view tracking (localStorage)
   - Mobile-responsive design
   - All level navigation

## 🔧 **Troubleshooting**

If deployment fails:
1. Check build logs in Render dashboard
2. Ensure all files are committed to GitHub
3. Verify `package.json` and `server.js` are in root directory
4. Make sure `card.pdf` is included in repository

## 💡 **Tips**

- **Free Tier**: Render's free tier is perfect for this app
- **Custom Domain**: You can add a custom domain in Render settings
- **SSL**: HTTPS is automatic on Render
- **Updates**: Just push to GitHub and Render auto-deploys

## 📱 **Mobile Testing**

After deployment, test on mobile devices:
- Touch navigation works
- PDF rendering scales properly
- All buttons are touch-friendly
- Modal closes properly on mobile