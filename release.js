import { execSync } from 'child_process';

// Example use: npm run release "Fix bug on homepage" minor

// Initialize
const branch = "main";
const remote = "origin"

// Ambil argumen dari command line
const args = process.argv.slice(2);

// Pastikan ada dua argumen (1. Pesan commit 2. Versi semantik)
if (args.length < 2) {
  console.error('Error: Missing arguments. You must provide commit message and version type (minor/major/patch).');
  process.exit(1);
}

// Assign nilai dari argumen
const commitMessage = args[0];
const versionType = args[1]; // minor/major/patch

try {
  // Jalankan git add .
  console.log('Staging changes...');
  execSync('git add .', { stdio: 'inherit' });

  // Jalankan git commit
  console.log('Committing changes...');
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

  // Jalankan npm version
  console.log(`Bumping version: ${versionType}...`);
  execSync(`npm version ${versionType}`, { stdio: 'inherit' });

  // Jalankan git push
  console.log('Pushing changes...');
  execSync(`git push ${remote} ${branch}`, { stdio: 'inherit' });

  console.log('Release process complete!');
} catch (error) {
  console.error('Error during release process:', error);
  process.exit(1);
}