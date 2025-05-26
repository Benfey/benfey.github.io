# The Intelligence Transition Blog

Anton Benfey's blog documenting the AI transition - both technical experiments and existential implications.

## Project Structure

- Jekyll static site hosted on GitHub Pages
- Posts in `_posts/YYYY-MM-DD-title.md` format
- Dark theme with forest green accents (#2d5a3d)
- Minimal, content-focused design

## Common Commands

```bash
# Local development
jekyll serve
bundle exec jekyll serve

# Update view counters from GoatCounter API
npm run update-views

# New post template
# _posts/YYYY-MM-DD-title.md with frontmatter:
# ---
# title: "Post Title"
# date: YYYY-MM-DD
# tags: [tag1, tag2, tag3]
# ---
```

## Content Focus

- AI research papers and analysis
- Tool experiments and reviews
- Code experiments with AI/ML
- Philosophical implications of AI development
- Human-AI collaboration observations
- Intelligence transition documentation

## Design Philosophy

- Minimal, clean aesthetic
- Dark mode with good contrast
- Typography-focused
- Easy posting workflow (just drop markdown files)
- Mobile responsive

## Key Tags

- `singularity` - Core theme posts about AI rapid advancement
- `intelligence-transition` - Historical perspective posts
- `paper-review` - Research paper analysis
- `tools` - AI tool experiments
- `code` - Technical implementations
- `philosophy` - Existential/philosophical thoughts
- `claude-code` - AI-assisted development posts

## Current State (Session 2 - 2025-05-25)

- **Analytics**: GoatCounter (https://benfey.goatcounter.com/)
- **Comments**: Giscus with GitHub Discussions integration
- **Posts**: 2 foundation posts (setup + singularity post)
- **Mobile**: Responsive design with centered layout
- **Features**: Auto-refresh comments, dark theme, minimal design
- **Tag System**: Simplified unified tags page (replaced individual tag pages)
- **Navigation**: Home, Archive, Tags, Changelog pages
- **Post Tiles**: Fully clickable tiles with reading time and view counters
- **View Counters**: Local script fetches from GoatCounter API, saves to Jekyll data
- **Next priorities**: RSS feed improvements, search functionality, related posts

## View Counter Implementation

### Overview

View counters are implemented using GoatCounter's API with a local Node.js script that fetches view counts and saves them as Jekyll data files. This approach avoids CORS issues while maintaining static site benefits.

### Setup Requirements

1. **Environment Variables**: Create `.env` file with GoatCounter API token:

   ```
   GOAT_TOKEN=your_api_token_here
   ```

2. **Dependencies**: Install Node.js dependencies:

   ```bash
   npm install dotenv
   ```

3. **GoatCounter Settings**: Enable API access in GoatCounter dashboard

### Workflow

1. **Fetch Data**: Run `npm run update-views` to fetch latest view counts
2. **Automatic Update**: Script saves data to `_data/views.json`
3. **Jekyll Integration**: Templates automatically display view counts using Liquid
4. **Security**: API token stored in `.env` (gitignored) for security

### Technical Details

- **API Endpoint**: `/api/v0/stats/hits` with Bearer token authentication
- **Data Storage**: JSON file with URL paths as keys, view counts as values
- **Template Integration**: Liquid lookup with fallback for missing data
- **Styling**: CSS matches reading time appearance for consistency

### Files Modified

- `scripts/update-views.js` - Main fetching script
- `package.json` - npm script and dependency
- `_data/views.json` - Generated view count data
- `index.html`, `archive.html` - Template updates
- `assets/css/style.css` - View counter styling
- `.env` - API token (gitignored)
- `.gitignore` - Excludes sensitive files

