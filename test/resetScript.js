const { execSync } = require('child_process');
const path = require('path');

// Obter o caminho do diretório pai do diretório atual do script
const parentDir = path.resolve(__dirname, '..');

// Comando para dropar o banco de dados
execSync('npx prisma migrate reset --skip-seed --force', { stdio: 'inherit', cwd: parentDir });

// Comando para gerar os arquivos do Prisma
execSync('npx prisma generate', { stdio: 'inherit', cwd: parentDir });

// Comando para criar o banco de dados
execSync('npx prisma db push', { stdio: 'inherit', cwd: parentDir });

// Comando para inserir os dados de seed
execSync('npx prisma db seed', { stdio: 'inherit', cwd: parentDir });
