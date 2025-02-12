const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const { ESLint } = require('eslint');
const { PurgeCSS } = require('purgecss');
const glob = require('glob');
const chokidar = require ('chokidar');
const cssnano = require('cssnano');
const postcss =require ('postcss');

console.log ('Starting CSS and JS optimization...');

function cleanOldMinifiedFiles() {
    const filesToClean = glob.sync(['**/*.min.js', '**/*.min.css'], { ignore: 'node_modules/**' });
    filesToClean.forEach(file => {
      fs.unlinkSync(file);
      console.log(`Deleted old minified file: ${file}`);
    });
  }

async function optimizeJS(filePath) {
    console.log(`Optimizing JS: ${filePath}`);
    const code = fs.readFileSync(filePath, 'utf8');

    const eslint = new ESLint({
        useEslintrc: false,
        overrideConfig: {
            plugins: ['unused-imports', 'no-unused-vars'],
            rules: {
                'no-unused-vars': 'error',
                'unused-imports/no-unused-imports': 'error',
                'unused-imports/no-unused-vars': [
                    'error',
                    { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
                ],
            },
        },
    });

    const results = await eslint.lintText(code, { filePath });
    let optimizedCode = code;

    if (results[0].output) {
        optimizedCode = results[0].output;
        console.log(`ESLint a effectué des modif sur : ${filePath}`);
    }

    const minified = await minify(optimizedCode);

    const optimizedPath = filePath.replace('JSDev', 'scriptJS').replace('.js', '.min.js');
    fs.writeFileSync(optimizedPath, minified.code);
    console.log(`Optimized JS: ${filePath} -> ${optimizedPath}`);
}

async function optimizeCSS(filePath) {
    console.log(`Optimizing CSS: ${filePath}`);
    const css = fs.readFileSync(filePath, 'utf8');

    const purgedResult = await new PurgeCSS().purge({
        content: ['*.html'],
        css: [{ raw: css }],
    });
    
    const result = await postcss([cssnano]).process(purgedResult[0].css, { from: undefined });
    const optimizedPath = filePath.replace('styles', 'styles/min').replace('.css', '.min.css');
    fs.writeFileSync(optimizedPath, result.css);
    console.log(`Optimized CSS: ${filePath} -> ${optimizedPath}`);
}

async function optimizeFiles() {
    const jsFiles = glob.sync('assets/JSDev/*.js',
         { ignore: ['node_modules/**', '**/*.min.js'] });
         const specificJsFiles = ['assets/scriptsJs/maugallery.js', 'assets/scriptsJs/script.js'];
    const allJsFiles = [...jsFiles, ...specificJsFiles];

    for (const file of allJsFiles) {
        await optimizeJS(file);
    }

    const cssFiles = glob.sync('assets/styles/style.css', 'assets/bootstrap/*.css', 'assets/styles/*.css',
         { ignore: ['node_modules/**', '**/*.min.css'] });
    console.log (`'Fichiers css à optimiser : ${cssFiles.join(', ')}`);

    for (const file of cssFiles) {
        await optimizeCSS(file);
    }
    cleanOldMinifiedFiles();

    console.log('Optimisation des fichiers terminée');
}


function watchMode() {
    const watcher = chokidar.watch([
        'assets/JSDev/*.js',
        'assets/styles/*.css',
        'assets/scriptsJs/*.js',
        'assets/bootstrap/*.css',
        'assets/bootstrap/*.js',
    ], {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true  
    });

    watcher
        .on('change', async (path) => {
            console.log(`Fichiers modifié detecté : ${path} `);
            if (path.endsWith('.js')) {
                await optimizeJS(path);
            } else if (path.endsWith('.css')) {
                await optimizeCSS(path);
            }
        })
        .on('error', error => console.error(`Watcher error: ${error}`));

    console.log('Watching for file changes...');
}

// Vérifiez si le script est exécuté avec l'option --watch
if (process.argv.includes('--watch')) {
    watchMode();
} else {
    optimizeFiles().catch(console.error);
}
