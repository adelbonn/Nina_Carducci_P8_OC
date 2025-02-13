import { generate } from 'critical';

generate({
  base: './',
  src: 'index.html',
  target: 'index-critical.html',
  inline: true,
  extract: false,
  width: 1300,
  height: 900,
}).then(() => {
  console.log('Critical CSS generated successfully');
}).catch((err) => {
  console.error('Error generating critical CSS:', err);
});