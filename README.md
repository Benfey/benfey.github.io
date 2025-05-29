# The Intelligence Transition Blog

Anton Benfey's personal blog documenting the AI transition - technical experiments, research analysis, and existential implications of rapid AI development.

🌐 **Live Site**: https://benfey.github.io  
📊 **Analytics**: https://benfey.goatcounter.com/  
💬 **Comments**: GitHub Discussions via Giscus

## Overview

This is a Jekyll-based static site hosted on GitHub Pages, focused on AI research, tool experiments, and philosophical reflections on the intelligence transition. The site features a dark theme with forest green accents, mobile-responsive design, and integrated view counters.

## Quick Start

### Prerequisites
- Ruby (for Jekyll)
- Node.js (for view counter scripts)
- Git

### Local Development
```bash
# Install Ruby dependencies
bundle install

# Install Node.js dependencies  
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your GoatCounter API token

# Start local server
bundle exec jekyll serve
# Site available at http://localhost:4000
```

## Content Management

### Creating New Posts

1. **File Naming**: Create files in `_posts/` following the pattern:
   ```
   _posts/YYYY-MM-DD-title.md
   ```

2. **Frontmatter Template**:
   ```yaml
   ---
   title: "Your Post Title"
   date: YYYY-MM-DD
   tags: [tag1, tag2, tag3]
   ---
   ```

3. **Content**: Write your post content in Markdown below the frontmatter.

### Recommended Tags

Use these established tags to maintain consistency:

- `singularity` - Core posts about AI rapid advancement
- `intelligence-transition` - Historical perspective posts
- `paper-review` - Research paper analysis  
- `tools` - AI tool experiments and reviews
- `code` - Technical implementations
- `philosophy` - Existential/philosophical thoughts
- `claude-code` - AI-assisted development posts

### Content Focus Areas

- AI research papers and analysis
- Tool experiments and reviews
- Code experiments with AI/ML
- Philosophical implications of AI development
- Human-AI collaboration observations
- Intelligence transition documentation

## Site Architecture

### Core Files

- `_config.yml` - Jekyll configuration
- `index.html` - Homepage with post tiles
- `archive.html` - Chronological post archive
- `tags.html` - Unified tags page
- `changelog.html` - Site updates log

### Layouts

- `_layouts/default.html` - Base page template
- `_layouts/post.html` - Individual post template

### Includes

- `_includes/post-list-item.html` - Post tile component
- `_includes/post-meta.html` - Post metadata (date, tags, views)
- `_includes/tag-to-display.html` - Tag formatting helper

### Styling

- `assets/css/style.css` - Dark theme with forest green accents
- Mobile-responsive design
- Typography-focused layout

## View Counter System

### Overview

View counters use GoatCounter's API with a local Node.js script that fetches view counts and saves them as Jekyll data files. This avoids CORS issues while maintaining static site benefits.

### Setup

1. **GoatCounter Account**: Create account at https://goatcounter.com/
2. **API Token**: Generate API token in GoatCounter settings
3. **Environment**: Add token to `.env` file:
   ```
   GOAT_TOKEN=your_api_token_here
   ```

### Usage

```bash
# Update view counters
npm run update-views
```

This script:
- Fetches view data from GoatCounter API
- Saves counts to `_data/views.json`
- Jekyll automatically displays updated counts

### Automation

Consider setting up a GitHub Action to run `npm run update-views` periodically to keep view counts current.

## Comments System

### Giscus Integration

Comments are powered by Giscus, which uses GitHub Discussions:

1. **GitHub Discussions**: Enabled in repository settings
2. **Giscus App**: Installed and configured for the repository
3. **Auto-refresh**: Comments reload every 30 seconds for real-time updates

### Configuration

Giscus settings are embedded in `_layouts/post.html`. No additional setup required for new posts.

## Deployment

### GitHub Pages

The site automatically deploys to GitHub Pages when changes are pushed to the `main` branch.

### Build Process

1. Push changes to `main` branch
2. GitHub Actions builds Jekyll site
3. Site deploys to https://benfey.github.io
4. Updates are live within minutes

### Custom Domain (Optional)

To use a custom domain:
1. Add `CNAME` file with your domain
2. Configure DNS with your domain provider
3. Update `url` in `_config.yml`

## Maintenance Tasks

### Regular Updates

- **View Counters**: Run `npm run update-views` weekly
- **Dependencies**: Update gems with `bundle update`
- **Node Packages**: Update with `npm update`

### Content Review

- Check tag consistency across posts
- Update changelog for significant changes
- Monitor analytics for popular content

### Backup

- Repository is automatically backed up on GitHub
- View counter data is stored in `_data/views.json`
- Consider exporting GoatCounter data periodically

## Development Workflow

### Making Changes

1. Create feature branch from `main`
2. Make changes locally
3. Test with `bundle exec jekyll serve`
4. Update view counters if needed
5. Commit and push changes
6. Create pull request to `main`

### Testing

- Test locally before deploying
- Check mobile responsiveness
- Verify all links work
- Test comment system on staging posts

## Security

### API Keys

- GoatCounter API token in `.env` (gitignored)
- Never commit sensitive tokens to repository

### Content Safety

- All content is public on GitHub
- Comments are moderated via GitHub Discussions
- No user authentication required

## Troubleshooting

### Common Issues

**Jekyll won't start**: Check Ruby version and run `bundle install`

**View counters not updating**: Verify GoatCounter API token in `.env`

**Comments not loading**: Check Giscus configuration in post layout

**Styles not applied**: Clear browser cache or check CSS file path

### Getting Help

- Jekyll docs: https://jekyllrb.com/docs/
- GitHub Pages docs: https://docs.github.com/pages/
- GoatCounter docs: https://goatcounter.com/help/

## File Structure

```
├── _config.yml           # Jekyll configuration
├── _data/
│   └── views.json       # View counter data (auto-generated)
├── _includes/           # Reusable components
├── _layouts/            # Page templates
├── _posts/              # Blog posts (YYYY-MM-DD-title.md)
├── _site/               # Generated site (gitignored)
├── assets/
│   ├── css/
│   │   └── style.css    # Main stylesheet
│   └── js/              # JavaScript files
├── scripts/
│   └── update-views.js  # View counter update script
├── .env                 # Environment variables (gitignored)
├── Gemfile              # Ruby dependencies
├── package.json         # Node.js dependencies
├── index.html           # Homepage
├── archive.html         # Post archive
├── tags.html            # Tags page
└── changelog.html       # Site changelog
```

## License

This project is personal use only. Content and code are not licensed for reuse.