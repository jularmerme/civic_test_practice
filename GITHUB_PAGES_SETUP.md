# GitHub Pages Deployment Guide

## Current Status
✅ Code pushed to GitHub repository: `https://github.com/jularmerme/civic_test_practice`
✅ All production files compiled and ready in `/dist` folder
✅ Build script simplified (skips TypeScript/CSS compilation)

## Next Steps to Enable GitHub Pages

### Step 1: Go to Repository Settings
1. Visit: `https://github.com/jularmerme/civic_test_practice/settings`
2. Scroll down to "Pages" section (left sidebar)

### Step 2: Configure GitHub Pages
1. Under "Build and deployment":
   - **Source**: Select "Deploy from a branch"
   - **Branch**: Select `main`
   - **Folder**: Select `/dist` (NOT root)
   - Click **Save**

### Step 3: Wait for Deployment
- GitHub will automatically build and deploy
- Watch the "Deployments" tab for status
- Deployment usually takes 1-2 minutes

### Step 4: Access Your Live Site
Once deployment completes, your app will be live at:
```
https://jularmerme.github.io/civic_test_practice
```

## Testing the Live Site
1. Open the URL above in your browser
2. Test the following flows:
   - Start Practice Session
   - Start Mock Exam
   - Answer questions
   - Check results page
   - Toggle dark mode
   - Change settings

## Troubleshooting

### 404 Error on GitHub Pages
- Verify `/dist` folder is selected as source
- Check that `index.html` exists in `/dist`
- Wait 2-3 minutes for deployment to complete

### App Not Loading
- Open browser DevTools (F12)
- Check Console for errors
- Verify all script paths are relative (no absolute paths)

### Styles Not Showing
- The app uses inline CSS in `index.html`
- CSS variables are defined for light/dark modes
- No external stylesheets needed

## Important Notes
- The `/dist` folder contains all production-ready compiled code
- No TypeScript compilation needed during deployment
- GitHub Pages will serve `dist/index.html` as the root page
- All relative paths in the app will work correctly

## Live URL
```
https://jularmerme.github.io/civic_test_practice
```
