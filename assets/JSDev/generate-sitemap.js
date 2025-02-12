import { readdirSync, statSync, writeFileSync } from 'fs';
import { join, extname, basename } from 'path';
import { create } from 'xmlbuilder';
// const fs = require('fs');
// const path = require('path');
// const xmlbuilder = require('xmlbuilder');

// Configuration
const GITHUB_USERNAME = 'adelbonn';
const REPO_NAME = 'Nina_Carducci_P8_OC';
const DOMAIN = `https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/`;
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// Fonction pour scanner récursivement les fichiers
function scanDirectory(dir) {
    let results = [];
    const files = readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = join(dir, file);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
            results = results.concat(scanDirectory(fullPath));
        } else {
            const ext = extname(file).toLowerCase();
            if (IMAGE_EXTENSIONS.includes(ext)) {
                results.push(fullPath);
            }
        }
    });
    
    return results;
}

// Création du sitemap principal
function generateMainSitemap() {
    const sitemap = create('urlset', {
        version: '1.0',
        encoding: 'UTF-8'
    })
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

    // Ajouter la page d'accueil
    sitemap.ele('url')
        .ele('loc', DOMAIN)
        .up()
        .ele('lastmod', new Date().toISOString().split('T')[0])
        .up()
        .ele('changefreq', 'weekly')
        .up()
        .ele('priority', '1.0');

    return sitemap.end({ pretty: true });
}

// Création du sitemap des images
function generateImageSitemap() {
    const sitemap = create('urlset', {
        version: '1.0',
        encoding: 'UTF-8'
    })
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    .att('xmlns:image', 'http://www.google.com/schemas/sitemap-image/1.1');

    const images = scanDirectory('./assets/images');
    const imageUrls = new Set();

    images.forEach(imagePath => {
        const relativePath = imagePath.replace(/\\/g, '/').replace(/^\.\//, '');
        const imageUrl = `${DOMAIN}/${relativePath}`;
        
        // Éviter les doublons
        if (!imageUrls.has(imageUrl)) {
            imageUrls.add(imageUrl);
            
            const url = sitemap.ele('url');
            url.ele('loc', DOMAIN);
            
            const imageEle = url.ele('image:image');
            imageEle.ele('image:loc', imageUrl);
            imageEle.ele('image:title', basename(imagePath, extname(imagePath)));
        }
    });

    return sitemap.end({ pretty: true });
}

// Génération et sauvegarde des sitemaps
try {
    // Sitemap principal
    const mainSitemap = generateMainSitemap();
    writeFileSync('sitemap.xml', mainSitemap);
    
    // Sitemap des images
    const imageSitemap = generateImageSitemap();
    writeFileSync('image-sitemap.xml', imageSitemap);
    
    console.log('Sitemaps générés avec succès !');
} catch (error) {
    console.error('Erreur lors de la génération des sitemaps:', error);
}