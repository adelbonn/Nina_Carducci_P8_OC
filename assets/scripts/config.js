// assets/scripts/config.js
export const imageConfig = {
    containers: {
        carousel: {
            desktop: { width: 1920, height: 888 },
            tablet: { width: 1000, height: 463 },
            mobile: { width: 650, height: 301 }
        },
        gallery: {
            thumbnail: {
                desktop: { width: 424, height: 424 },
                tablet: { width: 300, height: 300 },
                mobile: { width: 250, height: 250 }
            },
            modal: {
                desktop: { width: 800, height: null },
                tablet: { width: 300, height: null },
                mobile: { width: 400, height: null }
            }
        },
        about: {
            desktop: { width: 560, height: 558 },
            tablet: { width: 400, height: 398 },
            mobile: { width: 300, height: 299 }
        },
        contact: {
            desktop: { width: 392, height: 391 },
            tablet: { width: 380, height: 379 },
            mobile: { width: 229, height: 228 }
        }
    },
    formats: {
        webp: { quality: 80 },
        jpg: { quality: 85 }
    },
    types: {
        webp: 'image/webp',
        jpg: 'image/jpeg'
    }
};