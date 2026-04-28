// Script alternatif pour démarrer Next.js sans Turbopack
const { spawn } = require('child_process');

console.log('🚀 Démarrage de Next.js sans Turbopack...');

// Démarrer Next.js avec les bonnes variables d'environnement
const nextProcess = spawn('npx', ['next', 'dev'], {
  env: {
    ...process.env,
    TURBOPACK: '0',
    NEXT_DISABLE_TURBOPACK: '1'
  },
  stdio: 'inherit'
});

nextProcess.on('close', (code) => {
  console.log(`Next.js s'est arrêté avec le code: ${code}`);
});