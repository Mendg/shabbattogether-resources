# ShabbaTTogether Inclusion Resources

A beautiful, fast, and accessible resource library for Jewish community inclusion initiatives. Built for Friendship Circle International.

**Live Site:** https://inclusion.friendshipcircle.com

---

## 📁 Project Structure

```
shabbattogether-resources/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # All styles (~1200 lines)
├── js/
│   └── app.js              # Application logic (~400 lines)
├── data/
│   └── resources.json      # Resource data (40+ resources)
├── fonts/                  # Proxima Nova font files
│   ├── ProximaNova-Light.otf
│   ├── ProximaNova-Regular.otf
│   └── ...
├── images/                 # Logo images
│   ├── machne-israel-logo.png
│   └── ...
├── resources/              # PDF files (not in git)
│   ├── sermon-inclusion-2023.pdf
│   ├── mental-health-guide-community.pdf
│   └── ... (40+ PDFs)
├── .gitignore
└── README.md
```

---

## 🚀 Development

This is a **static site** - no build step required!

### Local Development

```bash
# Navigate to the project directory
cd shabbattogether-resources

# Serve with any static server
python3 -m http.server 8000
# OR
npx serve .
# OR
php -S localhost:8000
```

Then open http://localhost:8000

---

## ➕ Adding a New Resource

1. **Add the PDF file** to the `resources/` folder
2. **Edit `data/resources.json`** and add a new entry:

```json
{
  "title": "Your Resource Title",
  "description": "Brief description of the resource.",
  "file": "resources/your-file.pdf",
  "categories": ["shluchim"],
  "tags": [
    {"label": "Shluchim", "cls": "tag-shluchim"},
    {"label": "Guide", "cls": "tag-practical"}
  ],
  "featured": false
}
```

3. **Commit and push** - Vercel will auto-deploy!

### Available Categories

- `shluchim` - Shluchim & Rabbis
- `athome` - @Home / Family
- `teens` - Teens
- `campus` - Campus
- `children` - Children
- `women` - Women
- `adults` - Adults

### Available Tag Classes

- `tag-shluchim` (purple)
- `tag-campus` (blue)
- `tag-teens` (pink)
- `tag-women` (yellow)
- `tag-children` (green)
- `tag-adults` (red)
- `tag-athome` (teal)
- `tag-sermon` (purple)
- `tag-mental-health` (light blue)
- `tag-inclusion` (green)
- `tag-holiday` (orange)
- `tag-practical` (gray)

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--navy` | `#1b365d` | Primary brand color |
| `--navy-deep` | `#0d1f35` | Hero background |
| `--teal` | `#36bbae` | CTAs, accents |
| `--gold` | `#c9a260` | Premium highlights |
| `--cream` | `#faf6f0` | Page background |

**Font:** Proxima Nova (self-hosted)

---

## 📱 Browser Support

- Chrome/Edge (latest 2 versions)
- Safari (latest 2 versions)
- Firefox (latest 2 versions)
- Mobile Safari (iOS 14+)
- Chrome for Android

---

## 🚢 Deployment

This site auto-deploys to **Vercel** on every push to `main`.

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## 📝 File Sizes (Before/After Refactor)

| Metric | Before | After |
|--------|--------|-------|
| index.html | ~84 KB | ~18 KB |
| Total lines | 1,900+ | ~500 |
| CSS | inline | separate file |
| JS | inline | separate file |
| Data | inline JS | JSON file |

---

## 🔮 Future Enhancements

- [ ] Add analytics tracking (Google Analytics 4)
- [ ] SEO meta tags & structured data
- [ ] "New" badges for recent resources
- [ ] Newsletter signup for new resources
- [ ] Resource preview thumbnails
- [ ] Multi-language support

---

## 📄 License

All resources are free to download and use for your community.

© 2026 Friendship Circle International

---

Built with ❤️ for inclusive Jewish communities worldwide.
