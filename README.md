# Pavan Kalyan Rasani — Portfolio (Static)

A zero-dependency, single-page portfolio designed for GitHub Pages.
No build step. No framework. Just `index.html`, `styles.css`, `script.js`, and your resume PDF.

## Files

```
static-site/
├── index.html
├── styles.css
├── script.js
├── assets/
│   └── resume.pdf       <-- replace with your real resume
└── README.md
```

## Deploy to GitHub Pages

1. Create a new GitHub repository, e.g. `pavan-kalyan-portfolio`.
2. Copy everything in this folder into the repo root.
3. Push to `main`.
4. In GitHub → **Settings → Pages**:
   - Source: **Deploy from a branch**
   - Branch: **main** · folder: **/ (root)**
   - Save.
5. Wait 1–2 minutes — your site goes live at:
   `https://<your-username>.github.io/<repo-name>/`

### Use your own custom domain
- Add a file named `CNAME` to the repo root containing your domain (e.g. `rasanipavankalyan.com`).
- Point your domain's DNS to GitHub Pages per their docs.

## Edit content

- **All copy** lives inside `index.html` (single file). Edit it directly.
- **Colors / type** are in `styles.css` at the top under `:root { ... }`.
- **Resume PDF**: replace `assets/resume.pdf` with your actual file. Keep the filename.

## What the contact form does
- It opens the user's email client with a pre-filled `mailto:` message to `pavan@rasanipavankalyan.com`.
- GitHub Pages cannot run a backend. If you ever want a real form submission to a database / inbox, the simplest add-on is **Formspree** (free tier): replace the `submit` handler in `script.js` with a `fetch` POST to your Formspree endpoint.

## Browser support
Tested on modern Chrome, Safari, Firefox, Edge. Uses CSS-only tabs (radio inputs) and a single ~70-line vanilla JS file.

— Built lean. No noise.
