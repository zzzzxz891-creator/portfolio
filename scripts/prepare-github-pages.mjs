import { createHash } from 'node:crypto';
import { closeSync, copyFileSync, existsSync, mkdirSync, openSync, readFileSync, rmSync, writeFileSync, writeSync } from 'node:fs';
import path from 'node:path';

const output = path.resolve(process.argv[2] || 'dist/client');
mkdirSync(path.join(output, 'works'), { recursive: true });
copyFileSync(path.join(output, 'index.html'), path.join(output, 'works/index.html'));
mkdirSync(path.join(output, 'works/flow'), { recursive: true });
copyFileSync(path.join(output, 'index.html'), path.join(output, 'works/flow/index.html'));
mkdirSync(path.join(output, 'works/paw-print'), { recursive: true });
copyFileSync(path.join(output, 'index.html'), path.join(output, 'works/paw-print/index.html'));
writeFileSync(path.join(output, '.nojekyll'), '');

const partsDirectory = path.resolve('public/assets/documents/portfolio-parts');
const manifestPath = path.join(partsDirectory, 'manifest.json');
if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.output !== 'Xuanzhu-Zhao-Portfolio.pdf' || !Array.isArray(manifest.parts) || manifest.parts.length === 0) {
    throw new Error('Invalid portfolio PDF manifest.');
  }
  const destination = path.join(output, 'assets/documents', manifest.output);
  mkdirSync(path.dirname(destination), { recursive: true });
  const target = openSync(destination, 'w');
  const hash = createHash('sha256');
  let totalBytes = 0;
  try {
    for (const part of manifest.parts) {
      if (!/^\d{2}\.part$/.test(part.name)) throw new Error('Invalid portfolio PDF part name.');
      const bytes = readFileSync(path.join(partsDirectory, part.name));
      const partHash = createHash('sha256').update(bytes).digest('hex');
      if (bytes.length !== part.bytes || partHash !== part.sha256) throw new Error(`Invalid portfolio PDF part: ${part.name}`);
      let written = 0;
      while (written < bytes.length) written += writeSync(target, bytes, written, bytes.length - written);
      hash.update(bytes);
      totalBytes += bytes.length;
    }
  } finally {
    closeSync(target);
  }
  if (totalBytes !== manifest.bytes || hash.digest('hex') !== manifest.sha256) throw new Error('Assembled portfolio PDF failed integrity check.');
  rmSync(path.join(output, 'assets/documents/portfolio-parts'), { recursive: true, force: true });
  console.log(`Assembled and verified portfolio PDF (${totalBytes} bytes).`);
}
console.log('Prepared GitHub Pages entrypoints, including /works/, /works/flow/, and /works/paw-print/ refresh.');
