#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables from .env file
require('dotenv').config();

// Your GoatCounter API token
const GOAT_TOKEN = process.env.GOAT_TOKEN || '';
const SITE_URL = 'https://benfey.goatcounter.com';

if (!GOAT_TOKEN) {
    console.error('Please set GOAT_TOKEN environment variable with your GoatCounter API token');
    process.exit(1);
}

async function fetchViewCounts() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'benfey.goatcounter.com',
            path: '/api/v0/stats/hits?start=2025-01-01&limit=100',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${GOAT_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const parsed = JSON.parse(data);
                        resolve(parsed);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

async function updateViewCounts() {
    try {
        console.log('Fetching view counts from GoatCounter...');
        const data = await fetchViewCounts();
        
        // Create views data object
        const viewCounts = {};
        
        // Extract and normalize path data
        function processPathData(item) {
            if (item.path && item.count) {
                const count = typeof item.count === 'string' ? 
                    parseInt(item.count.replace(/,/g, '')) : item.count;
                
                // Clean path: remove query params and fragments
                let path = item.path.split('?')[0].split('#')[0];
                
                // Normalize Jekyll post URLs to have trailing slashes
                if (path.match(/^\/\d{4}\/\d{2}\/\d{2}\/[^\/]+$/) && !path.endsWith('/')) {
                    path = path + '/';
                }
                
                // Combine counts for the same clean path
                viewCounts[path] = (viewCounts[path] || 0) + count;
            }
        }
        
        // Try different possible data structures
        if (data.hits) {
            data.hits.forEach(processPathData);
        } else if (data.pages) {
            data.pages.forEach(processPathData);
        }

        // Write to _data/views.json
        const dataDir = path.join(__dirname, '../_data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        const viewsFile = path.join(dataDir, 'views.json');
        fs.writeFileSync(viewsFile, JSON.stringify(viewCounts, null, 2));
        
        console.log(`Updated view counts for ${Object.keys(viewCounts).length} pages`);
        console.log('View counts saved to _data/views.json');
        
        // Show mapping details
        console.log('\nPath mapping:');
        Object.entries(viewCounts).forEach(([path, count]) => {
            // Check if this looks like a Jekyll post path
            const isPost = path.match(/^\/\d{4}\/\d{2}\/\d{2}\//);
            const status = isPost ? '📝 POST' : '📄 PAGE';
            console.log(`  ${status} ${path} → ${count} views`);
        });
        
        // Warn about potential issues
        const suspiciousPaths = Object.keys(viewCounts).filter(path => 
            path.includes('?') || path.includes('#') || path.includes('%')
        );
        
        if (suspiciousPaths.length > 0) {
            console.log('\n⚠️  Paths with query params/fragments (may not match Jekyll URLs):');
            suspiciousPaths.forEach(path => console.log(`     ${path}`));
        }
        
    } catch (error) {
        console.error('Error updating view counts:', error.message);
        process.exit(1);
    }
}

updateViewCounts();