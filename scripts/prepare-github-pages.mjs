import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const output = path.resolve(process.argv[2] || 'dist/client');
mkdirSync(path.join(output, 'works'), { recursive: true });
copyFileSync(path.join(output, 'index.html'), path.join(output, 'works/index.html'));
mkdirSync(path.join(output, 'works/flow'), { recursive: true });
copyFileSync(path.join(output, 'index.html'), path.join(output, 'works/flow/index.html'));
mkdirSync(path.join(output, 'works/paw-print'), { recursive: true });
copyFileSync(path.join(output, 'index.html'), path.join(output, 'works/paw-print/index.html'));
writeFileSync(path.join(output, '.nojekyll'), '');
console.log('Prepared GitHub Pages entrypoints, including /works/, /works/flow/, and /works/paw-print/ refresh.');

