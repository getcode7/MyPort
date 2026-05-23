#!/usr/bin/env node

/**
 * Script de verificação de segurança
 * Executar: npm run security-check
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n🔒 Iniciando verificação de segurança...\n');

// 1. Verificar dependências
console.log('📦 Verificando dependências vulneráveis...');
try {
  execSync('npm audit --audit-level=high', { stdio: 'inherit' });
  console.log('✅ Dependências OK\n');
} catch (error) {
  console.log('⚠️ Vulnerabilidades encontradas. Execute: npm run security-fix\n');
}

// 2. Verificar .env.local
console.log('🔍 Verificando .env.local...');
if (fs.existsSync('.env.local')) {
  console.log('✅ .env.local existe\n');
} else {
  console.log('⚠️ .env.local não encontrado. Crie um arquivo .env.local\n');
}

// 3. Verificar headers de segurança
console.log('🛡️ Verificando configuração de headers...');
if (fs.existsSync('next.config.js')) {
  const nextConfig = fs.readFileSync('next.config.js', 'utf8');
  if (nextConfig.includes('Content-Security-Policy')) {
    console.log('✅ Headers de segurança configurados\n');
  } else {
    console.log('⚠️ Headers de segurança não encontrados\n');
  }
} else {
  console.log('⚠️ next.config.js não encontrado\n');
}

// 4. Verificar middleware
console.log('⚙️ Verificando middleware...');
if (fs.existsSync('middleware.ts')) {
  console.log('✅ Middleware configurado\n');
} else {
  console.log('⚠️ middleware.ts não encontrado\n');
}

// 5. Verificar robots.txt
console.log('🤖 Verificando robots.txt...');
if (fs.existsSync('public/robots.txt')) {
  console.log('✅ robots.txt existe\n');
} else {
  console.log('⚠️ robots.txt não encontrado\n');
}

// 6. Verificar ficheiros de segurança
console.log('📁 Verificando estrutura de segurança...');
const securityFiles = [
  'utils/email-protection.ts',
  'utils/sanitize.ts',
  'lib/security-logger.ts',
  'components/SafeLink.tsx'
];

securityFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} existe`);
  } else {
    console.log(`   ⚠️ ${file} não encontrado`);
  }
});

console.log('\n✅ Verificação de segurança concluída!\n');