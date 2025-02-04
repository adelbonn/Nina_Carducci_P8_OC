//import (bibliothèque sharp...)
import sharp from 'sharp';
import { readdir, existsSync, mkdirSync } from'fs';
import { join, basename, extname } from 'path';
import { imageConfig } from './config';

// 2. Constantes de base
const BASE_DIRS = {
    input: './assets/images/imgOriginals',
    output: './assets/images/optimized'
};



// 3. Fonction de création des dossiers
async function createDirectories() {
    // Création du dossier principal de sortie
    if (!existsSync(BASE_DIRS.output)) {
        mkdirSync(BASE_DIRS.output, { recursive: true });
    }

    // Pour chaque type de conteneur (carousel, gallery, about, contact)
    for (const [containerType, sizes] of Object.entries(imageConfig.containers)) {
        const containerPath = join(BASE_DIRS.output, containerType);
        
        if (containerType === 'gallery') {
            // Structure spéciale pour la galerie (thumbnails + modal)
            ['thumbnail', 'modal'].forEach(type => {
                ['desktop', 'tablet', 'mobile'].forEach(device => {
                    ['webp', 'jpg'].forEach(format => {
                        const dir = join(containerPath, type, device, format);
                        if (!existsSync(dir)) {
                            mkdirSync(dir, { recursive: true });
                            console.log(`Created directory: ${dir}`);
                        }
                    });
                });
            });
        } else {
            // Structure standard pour les autres types
            ['desktop', 'tablet', 'mobile'].forEach(device => {
                ['webp', 'jpg'].forEach(format => {
                    const dir = join(containerPath, device, format);
                    if (!existsSync(dir)) {
                        mkdirSync(dir, { recursive: true });
                        console.log(`Created directory: ${dir}`);
                    }
                });
            });
        }
    }
}
// 4. Fonction d'optimisation d'image
async function optimizeImage(inputPath, containerType, deviceType, imageType = null) {
    const filename = basename(inputPath, extname(inputPath));
    
    try {
        // Obtenir la configuration pour ce type d'image
        const config = imageType 
            ? imageConfig.containers[containerType][imageType][deviceType]
            : imageConfig.containers[containerType][deviceType];

             // Validation de la configuration
        if (!config || !config.width) {
            throw new Error(`Configuration invalide pour ${containerType}/${deviceType}`);
        }



        // Définir les chemins de sortie
        const outputBase = imageType
            ? join(BASE_DIRS.output, containerType, imageType, deviceType)
            : join(BASE_DIRS.output, containerType, deviceType);

        // Obtenir les métadonnées de l'image
        const metadata = await sharp(inputPath).metadata();
        if (!metadata) {
            throw new Error(`Erreur lors de la lecture des métadonnées de ${filename}`)
        }

        // Calculer les dimensions en préservant le ratio
        const ratio = metadata.height / metadata.width;
        const targetWidth = config.width;
        const targetHeight = config.height || Math.round(targetWidth * ratio);

        console.log(`Optimizing ${filename} for ${containerType}/${deviceType}${imageType ? '/' + imageType : ''}`);
        console.log(`Target dimensions: ${targetWidth}x${targetHeight}`);

        // Paramètres de redimensionnement
        const resizeOptions = {
            width: targetWidth,
            height: targetHeight,
            fit: 'cover',
            position: 'center'
        };

        //Création des dossiers de sortie
        const webpDir = join(outputBase, 'webp');
        const jpgDir = join(outputBase, 'jpg');
        if (!existsSync(webpDir)) mkdirSync(webpDir, { recursive: true });
        if (!existsSync(jpgDir)) mkdirSync(jpgDir, { recursive: true });


        // Optimisation WebP
        await sharp(inputPath)
            .resize(resizeOptions)
            .webp({ quality: imageConfig.formats.webp.quality })
            .toFile(join(outputBase, 'webp', `${filename}.webp`));

        // Optimisation JPG
        await sharp(inputPath)
            .resize(resizeOptions)
            .jpeg({ quality: imageConfig.formats.jpg.quality })
            .toFile(join(outputBase, 'jpg', `${filename}.jpg`));

        return true;
    } catch (error) {
        console.error(`Error optimizing ${filename}:`, error);
        return false;
    }
}

// 5. Fonction principale
async function processImages() {
    try {
        console.log('Starting image optimization...');
        
        // 1. Créer la structure des dossiers
        await createDirectories();
        
        // 2. Lire les images sources
        const files = await readdir(BASE_DIRS.input);
        
        // 3. Traiter chaque image
        for (const file of files) {
            if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;
            
            const inputPath = join(BASE_DIRS.input, file);
            console.log(`\nProcessing ${file}...`);

            try {
                // Déterminer le type d'image basé sur son nom
                const isGallery = file.toLowerCase().includes('gallery');
                const isCarousel = file.toLowerCase().includes('carousel');
                const isAbout = file.toLowerCase().includes('about');
                const isContact = file.toLowerCase().includes('contact');

                const type = isGallery ? 'gallery'
                         : isCarousel ? 'carousel'
                         : isAbout ? 'about'
                         : isContact ? 'contact'
                         : 'default';

                // Traiter selon le type
                if (type === 'gallery') {
                    for (const device of ['desktop', 'tablet', 'mobile']) {
                        await Promise.all([
                            optimizeImage(inputPath, 'gallery', device, 'thumbnail'),
                            optimizeImage(inputPath, 'gallery', device, 'modal')
                        ]);
                    }
                } else if (type !== 'default') {
                    for (const device of ['desktop', 'tablet', 'mobile']) {
                        await optimizeImage(inputPath, type, device);
                    }
                }
                
                console.log(`Successfully processed ${file}`);
            } catch (error) {
                console.error(`Failed to process ${file}:`, error);
            }
        }
        
        console.log('\nImage optimization completed!');
    } catch (error) {
        console.error('Fatal error during image processing:', error);
    }
}

// 6. Exécution du script
processImages().catch(console.error);