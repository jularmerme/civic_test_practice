# Complete Deployment Guide — Push to GitHub & Deploy Live

This guide will walk you through uploading your code to GitHub and deploying it live.

---

## Phase 1: Prepare Your Code (Local)

### Step 1.1: Build Your Project
```bash
cd d:\Repositories\civic_test_practice
npm run build
```
This compiles TypeScript → JavaScript and generates the `dist/` folder that will be deployed.

**Expected output:**
```
> npm run build:css && npm run build:ts
> npx tailwindcss ...
> tsc
```

### Step 1.2: Verify Build Success
Check that `dist/` folder has these files:
```
dist/
├── index.html
├── app.js
├── styles.css
├── data/
│   ├── questions.js
│   ├── questionUtils.js
│   └── dynamicAnswers.json
└── *.js.map (source maps)
```

If any files are missing, the build failed. Fix errors before proceeding.

---

## Phase 2: Git Setup (Local Repository)

### Step 2.1: Check Git Status
```bash
cd d:\Repositories\civic_test_practice
git status
```

**If you see:**
```
On branch main
nothing to commit, working tree clean
```
→ All good, skip to Step 2.3

**If you see:**
```
On branch main
Changes not staged for commit:
  modified: dist/app.js
  new file: dist/data/dynamicAnswers.json
  ...
```
→ Continue to Step 2.2

### Step 2.2: Stage All Changes
```bash
git add .
```

This stages all modified and new files.

### Step 2.3: Commit Changes
```bash
git commit -m "feat: refactor RATIFY — fix bugs, add dynamic resolution, improve UI"
```

**Good commit message format:**
- `feat:` for new features
- `fix:` for bug fixes
- `refactor:` for code restructuring
- Keep it under 70 characters

**Example commits you might use:**
```bash
git commit -m "fix: answer selection for options with apostrophes"
git commit -m "feat: add mock exam early-stop logic (12 correct/9 incorrect)"
git commit -m "fix: remove fake dashboard stats"
git commit -m "refactor: extract CSS to external file"
```

### Step 2.4: Verify Commit
```bash
git log --oneline -5
```

Should show your latest commit at the top.

---

## Phase 3: GitHub Setup (Remote Repository)

### Step 3.1: Create a GitHub Repository (if you don't have one)

1. Go to **https://github.com/new**
2. Fill in:
   - **Repository name:** `civic_test_practice` (or your preferred name)
   - **Description:** "USCIS 2025 Civics Test Practice Web App"
   - **Public** or **Private** (your choice)
   - **Initialize with README** (optional — skip if you already have one)
3. Click **Create repository**

### Step 3.2: Find Your Repository URL

On your new GitHub repo page, click the green **Code** button and copy the HTTPS URL:
```
https://github.com/YOUR_USERNAME/civic_test_practice.git
```

---

## Phase 4: Push to GitHub (Upload Code)

### Step 4.1: Add Remote Repository

If this is your first time pushing to GitHub, add the remote:

```bash
git remote add origin https://github.com/YOUR_USERNAME/civic_test_practice.git
```

(Replace `YOUR_USERNAME` with your actual GitHub username)

**Verify it worked:**
```bash
git remote -v
```

Should show:
```
origin  https://github.com/YOUR_USERNAME/civic_test_practice.git (fetch)
origin  https://github.com/YOUR_USERNAME/civic_test_practice.git (push)
```

### Step 4.2: Push Code to GitHub

```bash
git push -u origin main
```

(Or `master` if your branch is called `master` instead of `main`)

**Expected output:**
```
Enumerating objects: 150, done.
Counting objects: 100% (150/150), done.
Delta compression using up to 8 threads
Compressing objects: 100% (120/120), done.
Writing objects: 100% (150/150), 2.5 MB, done.
Total 150 (delta 45), reused 0 (delta 0), reused pack 0 (delta 0)
remote: Resolving deltas: 100% (45/45), done.
To https://github.com/YOUR_USERNAME/civic_test_practice.git
 * [new branch]      main -> main
 * Branch 'u-origin/main' set up to track 'origin/main'.
```

### Step 4.3: Verify Push Success

Go to **https://github.com/YOUR_USERNAME/civic_test_practice** and refresh. You should see your code uploaded.

---

## Phase 5: Deploy Live with GitHub Pages

GitHub Pages automatically hosts the `dist/` folder as a live website.

### Step 5.1: Enable GitHub Pages

1. Go to your repository: **https://github.com/YOUR_USERNAME/civic_test_practice**
2. Click **Settings** (top right)
3. Left sidebar → **Pages**
4. Under **Build and deployment**:
   - **Source:** Select **Deploy from a branch**
   - **Branch:** Select `main` (or your branch)
   - **Folder:** Select `/ (root)` OR `/dist`
5. Click **Save**

**Wait 1–2 minutes** for GitHub to build and deploy.

### Step 5.2: Find Your Live URL

After deployment completes:
1. Go back to **Settings** → **Pages**
2. Look for the message: **"Your site is live at https://YOUR_USERNAME.github.io/civic_test_practice"**
3. Click the link to open your live site

---

## Phase 6: Test Your Live Site

### Step 6.1: Open the Live URL

```
https://YOUR_USERNAME.github.io/civic_test_practice
```

### Step 6.2: Run Through Test Checklist

- [ ] Page loads without errors (F12 → Console, no red errors)
- [ ] Home page displays correctly
- [ ] Dark mode toggle works (🌙 button)
- [ ] Start Practice Session button works → loads questions
- [ ] Take Mock Exam button works → loads mock exam
- [ ] Questions display with all 4 answer options
- [ ] Can select answer options
- [ ] Correct/incorrect feedback shows
- [ ] Mock exam stops at 12 correct or 9 incorrect
- [ ] Results page displays badge (🥇 or 🎯)
- [ ] Mobile responsive (zoom out to 50% or resize to 375px)

### Step 6.3: Check Performance (Optional)

Run Lighthouse audit:
1. Open live URL in Chrome
2. Press F12 → Lighthouse tab
3. Click **Analyze page load**
4. Target: Performance ≥90, Accessibility ≥95, SEO ≥90

---

## Phase 7: Future Deployments (After Making Changes)

Whenever you make changes and want to deploy:

```bash
# 1. Build locally
npm run build

# 2. Stage changes
git add .

# 3. Commit
git commit -m "fix: [describe what you fixed]"

# 4. Push to GitHub
git push origin main

# 5. GitHub Pages auto-deploys (wait 1-2 minutes)
# 6. Refresh your live URL to see changes
```

---

## Troubleshooting

### "fatal: 'origin' does not appear to be a remote repository"
**Solution:** You haven't added the remote yet. Run Step 4.1.

### "fatal: No commits yet"
**Solution:** Create your first commit with `git commit -m "initial commit"` then push.

### "404 Not Found" on live URL
**Solution:** 
- Check GitHub Pages is enabled (Settings → Pages)
- Verify the branch is correct (should be `main` or `master`)
- Wait 2–3 minutes for GitHub to deploy
- Clear browser cache (Ctrl+Shift+Delete)

### "Permission denied (publickey)"
**Solution:** You need to set up SSH or use GitHub token:
- Option A: Use HTTPS (update remote): `git remote set-url origin https://github.com/...`
- Option B: Generate GitHub token → use as password

### Live site shows old version
**Solution:**
- Hard refresh: **Ctrl+Shift+R** (clears cache)
- Or open in incognito/private window

### "npm run build fails"
**Solution:**
```bash
npm install                # Reinstall dependencies
npm run build              # Try again
```

---

## Quick Reference: Full Deployment Workflow

```bash
# 1. Build
npm run build

# 2. Stage
git add .

# 3. Commit
git commit -m "feat: your changes here"

# 4. Push
git push origin main

# 5. Verify live (wait 2 min)
# https://YOUR_USERNAME.github.io/civic_test_practice
```

---

## Your Repository URLs

**Local folder:**
```
d:\Repositories\civic_test_practice
```

**GitHub remote:**
```
https://github.com/YOUR_USERNAME/civic_test_practice
```

**Live site:**
```
https://YOUR_USERNAME.github.io/civic_test_practice
```

---

## Need Help?

- **Git errors?** Run `git status` to see current state
- **Build errors?** Check `npm run build` output
- **Live site broken?** Open F12 Console to see JavaScript errors
- **GitHub Pages not deploying?** Check Settings → Pages is enabled

---

**Status:** Ready to deploy  
**Estimated time:** 5 minutes to upload + 2 minutes for GitHub Pages to build = 7 minutes total

Good luck! 🚀
