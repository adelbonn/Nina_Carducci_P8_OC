const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const { ESLint } = require('eslint');
const { PurgeCSS } = require('purgecss');
const glob = require('glob');
const chokidar = require ('chokidar');
const cssnano = require('cssnano');
const postcss =require ('postcss');
const htmlMinifier = require('html-minifier-terser');


//chemin de base du projet
const baseDir = path.resolve(__dirname, '..', '..');
console.log ('Starting CSS and JS and HTML optimization...');

function cleanOldMinifiedFiles() {
    const now = new Date();
    const filesToClean = glob.sync(['**/*.min.js', '**/*.min.css'], 
        { ignore: [
            'node_modules/**',
             '**/bootstrap.min.css', 
            '**/bootstrap.bundle.min.js'
        ]
    });
    filesToClean.forEach(file => {
        const stats = fs.statSync(file);

        //ne supprime pas les fichiers cree il y  moins de 5min
if (now - stats.mtime > 2 * 60 * 1000) {
      fs.unlinkSync(file);
      console.log(`Deleted old minified file: ${file}`);
    }
    });
  }

async function optimizeJS(filePath) {
    console.log(`'Optimisation Js: ${filePath}`);
    const code = fs.readFileSync(filePath, 'utf8');

    const eslint = new ESLint({
        baseConfig: {
              plugins: ['unused-imports'],
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
      
    let optimisedPath;
    if (filePath.includes('assets/JSDev')) {
        optimisedPath = filePath.replace('JSDev', 'scriptsJs').replace('.js', '.min.js');
    } else {
        optimisedPath = filePath.replace('.js', '.min.js');
    }

    // s assurer que le dossier dd destination existe
    const dir = path.dirname(optimisedPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(optimisedPath, minified.code);
    console.log(`Optimized JS: ${filePath} -> ${optimisedPath}`);

   
  


    // const optimizedPath = filePath.replace('JSDev', 'scriptJS').replace('.js', '.min.js');
    // fs.writeFileSync(optimizedPath, minified.code);
    // console.log(`Optimized JS: ${filePath} -> ${optimizedPath}`);

    let optimizedPath;
    if (filePath.includes('assets/JSDev')) {
        optimizedPath = filePath.replace('JSDev', 'scriptsJs').replace('.js', '.min.js');      
    } else {
        optimizedPath = filePath.replace('.js', '.min.js');
    }
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
    // Assur que le dossier de destination existe
    const dir = path.dirname(optimizedPath);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(optimizedPath, result.css);
    console.log(`Optimized CSS: ${filePath} -> ${optimizedPath}`);
}

async function optimizeHTML(filePath) {
    console.log(`Optimizing HTML: ${filePath}`);
    const html = fs.readFileSync(filePath, 'utf8');

    const minified = await htmlMinifier.minify(html, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
    });

    const optimizedPath = filePath.replace('.html', '.min.html');
    fs.writeFileSync(optimizedPath, minified);
    console.log(`Optimized HTML: ${filePath} -> ${optimizedPath}`);
}

async function optimizeFiles() {
    cleanOldMinifiedFiles();
    const jsFiles = glob.sync(path.join(baseDir, 'assets/JSDev/*.js'),
         { ignore: ['node_modules/**', '**/*.min.js',
            '**/bootstrap.bundle.js', 
            '**/*.min.css', 
             'assets/styles/style.css'
         ]
     });
    const specificJsFiles = [
        path.join(baseDir, 'assets/scriptsJs/maugallery.js'),
        path.join(baseDir, 'assets/scriptsJs/scripts.js')
    ];
    const allJsFiles = [...jsFiles, ...specificJsFiles];

    for (const file of allJsFiles) {
        if (fs.existsSync(file)) {
        await optimizeJS(file);
    } else {
        console.warn(`Attention fichier JS introuvable : ${file} et sera ignoré`);
    }
}
    const cssFiles = glob.sync(path.join(baseDir,'/**/*.css'),
         { ignore: ['node_modules/**', '**/*.min.css'] });
    console.log (`'Fichiers css à optimiser : ${cssFiles.join(', ')}`);

    for (const file of cssFiles) {
        if (fs.existsSync(file)) {
        await optimizeCSS(file);
    }
    else {
        console.warn(`Attention fichier CSS introuvable : ${file} et sera ignoré`);
    }
// Optimisation des fichiers HTML
    const htmlFiles = glob.sync(path.join(baseDir, '*.html'), { ignore: '**/node_modules/**' });
    console.log(`Fichiers HTML à optimiser : ${htmlFiles.join(', ')}`);

    for (const file of htmlFiles) {
        await optimizeHTML(file);
    }
    console.log('Optimisation des fichiers terminée');
   }
}

function watchMode() {
    const watcher = chokidar.watch([
        path.join(baseDir, 'assets/JSDev/*.js'),
        path.join(baseDir, 'assets/styles/*.css'),
        path.join(baseDir,  'assets/scriptsJs/*.js'),
        path.join(baseDir,  'assets/bootstrap/*.css'),
        path.join(baseDir, 'assets/bootstrap/*.js'),
        path.join(baseDir,  '*.html')
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
            } else if (path.endsWith('.html')) {
                await optimizeHTML(path);
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
