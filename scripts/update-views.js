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
            path: '/api/v0/stats/hits',
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
        
        // Try different possible data structures
        if (data.hits) {
            data.hits.forEach(hit => {
                if (hit.path && hit.count) {
                    const count = typeof hit.count === 'string' ? 
                        parseInt(hit.count.replace(/,/g, '')) : hit.count;
                    
                    // Normalize Jekyll post URLs to have trailing slashes
                    let path = hit.path;
                    if (path.match(/^\/\d{4}\/\d{2}\/\d{2}\/[^\/]+$/) && !path.endsWith('/')) {
                        path = path + '/';
                    }
                    
                    viewCounts[path] = count;
                }
            });
        } else if (data.pages) {
            data.pages.forEach(page => {
                if (page.path && page.count) {
                    const count = typeof page.count === 'string' ? 
                        parseInt(page.count.replace(/,/g, '')) : page.count;
                    
                    // Normalize Jekyll post URLs to have trailing slashes
                    let path = page.path;
                    if (path.match(/^\/\d{4}\/\d{2}\/\d{2}\/[^\/]+$/) && !path.endsWith('/')) {
                        path = path + '/';
                    }
                    
                    viewCounts[path] = count;
                }
            });
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