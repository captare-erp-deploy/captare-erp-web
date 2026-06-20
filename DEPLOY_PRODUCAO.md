# 🚀 DEPLOY EM PRODUÇÃO - CAPTARE ERP

## Versão: 1.0.0
## Data: 20/06/2026

---

## 📋 VISÃO GERAL

Este guia descreve como fazer deploy do Captare ERP em produção em diferentes plataformas.

---

## ✅ PRÉ-REQUISITOS

- [ ] Código testado localmente
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Banco de dados PostgreSQL pronto
- [ ] Firebird (opcional) configurado
- [ ] Conta em plataforma de hosting
- [ ] Domínio registrado (opcional)

---

## 🌐 OPÇÃO 1: DEPLOY NO VERCEL (Recomendado)

### Passo 1: Preparar Repositório

```bash
cd /home/ubuntu/captare-erp-web
git add .
git commit -m "Preparar para deploy em produção"
git push origin master
```

### Passo 2: Conectar ao Vercel

1. Acesse: https://vercel.com/new
2. Selecione: "Import Git Repository"
3. Escolha: `captare-erp-deploy/captare-erp-web`
4. Configure as variáveis de ambiente
5. Clique em "Deploy"

### Passo 3: Configurar Variáveis de Ambiente

No painel do Vercel, adicione:

```
DATABASE_URL=postgresql://user:password@host:5432/captare_erp
FIREBIRD_HOST=seu_host_firebird
FIREBIRD_PORT=3050
FIREBIRD_DATABASE=/caminho/captarepro.fdb
FIREBIRD_USER=sysdba
FIREBIRD_PASSWORD=sua_senha
JWT_SECRET=sua_chave_jwt_segura
API_SECRET_KEY=sua_chave_api_segura
NODE_ENV=production
```

### Passo 4: Verificar Deploy

```bash
# Seu app estará disponível em:
https://captare-erp-web.vercel.app
```

---

## 🐳 OPÇÃO 2: DEPLOY COM DOCKER

### Passo 1: Criar Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Copiar arquivos
COPY package.json pnpm-lock.yaml ./
COPY . .

# Instalar dependências
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Build
RUN pnpm build

# Expor porta
EXPOSE 3000

# Iniciar
CMD ["pnpm", "start"]
```

### Passo 2: Criar docker-compose.yml

```yaml
version: '3.8'

services:
  captare-erp:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/captare_erp
      - NODE_ENV=production
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=captare_erp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Passo 3: Deploy com Docker

```bash
# Build
docker-compose build

# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

---

## ☁️ OPÇÃO 3: DEPLOY NA AWS

### Passo 1: Criar Instância EC2

```bash
# 1. Acesse AWS Console
# 2. EC2 → Launch Instance
# 3. Escolha: Ubuntu 24.04 LTS
# 4. Tipo: t3.medium (ou maior)
# 5. Storage: 30GB
```

### Passo 2: Conectar e Configurar

```bash
# SSH na instância
ssh -i seu_key.pem ubuntu@seu_ip

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar pnpm
npm install -g pnpm

# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Clonar repositório
git clone https://github.com/captare-erp-deploy/captare-erp-web.git
cd captare-erp-web
```

### Passo 3: Configurar Aplicação

```bash
# Instalar dependências
pnpm install

# Criar .env.production
nano .env.production

# Adicionar variáveis de ambiente
DATABASE_URL=postgresql://postgres:senha@localhost:5432/captare_erp
NODE_ENV=production
```

### Passo 4: Build e Iniciar

```bash
# Build
pnpm build

# Iniciar com PM2
npm install -g pm2
pm2 start "pnpm start" --name "captare-erp"
pm2 save
pm2 startup
```

### Passo 5: Configurar Nginx

```bash
# Instalar Nginx
sudo apt install -y nginx

# Criar config
sudo nano /etc/nginx/sites-available/captare-erp

# Adicionar:
server {
    listen 80;
    server_name seu_dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Ativar
sudo ln -s /etc/nginx/sites-available/captare-erp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Passo 6: SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Gerar certificado
sudo certbot --nginx -d seu_dominio.com

# Auto-renovar
sudo systemctl enable certbot.timer
```

---

## 🔵 OPÇÃO 4: DEPLOY NO AZURE

### Passo 1: Criar App Service

```bash
# Login
az login

# Criar resource group
az group create --name captare-erp --location eastus

# Criar App Service
az appservice plan create --name captare-plan --resource-group captare-erp --sku B2 --is-linux

# Criar Web App
az webapp create --resource-group captare-erp --plan captare-plan --name captare-erp-web --runtime "node|22"
```

### Passo 2: Configurar Variáveis

```bash
az webapp config appsettings set --resource-group captare-erp --name captare-erp-web \
  --settings DATABASE_URL="postgresql://..." NODE_ENV="production"
```

### Passo 3: Deploy

```bash
# Conectar repositório Git
az webapp deployment source config-zip --resource-group captare-erp --name captare-erp-web --src captare-erp-web.zip
```

---

## 📊 CHECKLIST PRÉ-DEPLOY

- [ ] Código testado localmente
- [ ] Todas as variáveis de ambiente definidas
- [ ] Banco de dados criado e migrado
- [ ] Backup do banco de dados
- [ ] SSL/HTTPS configurado
- [ ] Domínio apontando para servidor
- [ ] Monitoramento configurado
- [ ] Logs configurados
- [ ] Backup automático ativado
- [ ] Alertas configurados

---

## 🔒 SEGURANÇA EM PRODUÇÃO

### 1. Variáveis de Ambiente

```bash
# Nunca commite .env
echo ".env.production.local" >> .gitignore

# Use variáveis seguras
export DATABASE_URL="postgresql://..."
export JWT_SECRET="chave_muito_segura_aqui"
```

### 2. HTTPS Obrigatório

```bash
# Redirecionar HTTP para HTTPS
# Configurar em nginx ou load balancer
```

### 3. Firewall

```bash
# Abrir apenas portas necessárias
# 80 (HTTP) → 443 (HTTPS)
# 3000 (App) → apenas para localhost
# 5432 (DB) → apenas para app
```

### 4. Backup Automático

```bash
# Backup diário do banco
0 2 * * * pg_dump captare_erp > /backup/captare_$(date +\%Y\%m\%d).sql
```

---

## 📈 MONITORAMENTO

### Ferramentas Recomendadas

- **Vercel Analytics**: Automático no Vercel
- **Sentry**: Monitoramento de erros
- **DataDog**: Monitoramento completo
- **New Relic**: APM e performance

### Exemplo com Sentry

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

---

## 🔄 CI/CD

### GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 22
      - run: npm install -g pnpm
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test
      - name: Deploy to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## 🐛 TROUBLESHOOTING

### Erro: "Connection refused"
- Verifique se banco de dados está rodando
- Confirme DATABASE_URL

### Erro: "Out of memory"
- Aumente memória da instância
- Otimize queries

### Erro: "CORS error"
- Configure CORS no Next.js
- Verifique domínio

---

## 📞 SUPORTE

Para problemas:
1. Verifique logs
2. Confirme variáveis de ambiente
3. Teste conexão com banco de dados
4. Consulte documentação da plataforma

---

**Deploy em produção configurado com sucesso! ✅**
