#!/usr/bin/env node

/**
 * Script de auditoria de dependências
 * Executar: npm run audit-deps
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Auditando dependências...\n');

// Obter dependências do package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies
};

console.log(`Total de dependências: ${Object.keys(dependencies).length}\n`);

// Verificar cada dependência
Object.entries(dependencies).forEach(([name, version]) => {
  try {
    const result = execSync(`npm view ${name}@${version}`, { encoding: 'utf8' });
    console.log(`✅ ${name}@${version} - OK`);
  } catch (error) {
    console.log(`⚠️ ${name}@${version} - Versão não encontrada no registry`);
  }
});

console.log('\n📊 Executando auditoria completa...');
execSync('npm audit --json > security-report.json', { stdio: 'inherit' });
console.log('✅ Relatório de segurança salvo em security-report.json');