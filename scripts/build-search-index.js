#!/usr/bin/env node

/**
 * Pre-build lunr search index during Jekyll build
 * This eliminates client-side index building for instant search
 */

const fs = require('fs');
const path = require('path');

// Import lunr - we'll need to install it as a dev dependency
const lunr = require('lunr');

// Read the search data generated by Jekyll
const searchDataPath = path.join(__dirname, '../_site/_data/search/search-index.json');
const outputPath = path.join(__dirname, '../_site/_data/search/search-lunr-index.json');

function buildSearchIndex() {
    try {
        // Read the Jekyll-generated search data
        if (!fs.existsSync(searchDataPath)) {
            console.error('Search data not found. Run Jekyll build first.');
            process.exit(1);
        }

        const searchData = JSON.parse(fs.readFileSync(searchDataPath, 'utf8'));
        console.log(`Building search index for ${searchData.posts.length} posts...`);

        // Build lunr index
        const index = lunr(function () {
            this.ref('id');
            this.field('title', { boost: 10 });
            this.field('tags', { boost: 5 });

            searchData.posts.forEach(function (post) {
                this.add(post);
            }, this);
        });

        // Serialize the index
        const serializedIndex = JSON.stringify(index);

        // Save both the index and the data
        const output = {
            index: serializedIndex,
            posts: searchData.posts,
            generated: new Date().toISOString(),
            post_count: searchData.posts.length
        };

        fs.writeFileSync(outputPath, JSON.stringify(output));
        console.log(`Search index built and saved to ${outputPath}`);
        console.log(`Index size: ${(serializedIndex.length / 1024).toFixed(1)}KB`);
        console.log(`Total output: ${(JSON.stringify(output).length / 1024).toFixed(1)}KB`);

    } catch (error) {
        console.error('Error building search index:', error);
        process.exit(1);
    }
}

buildSearchIndex();