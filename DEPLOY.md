# Guia de Deploy - Captare ERP

## 📋 Checklist Pré-Deploy

- [x] Segurança implementada (JWT, validação, criptografia)
- [x] Todos os módulos funcionando
- [x] Integração Firebird pronta
- [x] Bot WhatsApp configurado
- [x] Notificações em tempo real
- [x] Logs de auditoria
- [x] Testes de segurança

## 🚀 Opções de Deploy

### Opção 1: Vercel (Recomendado)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
vercel deploy

# 3. Configurar variáveis de ambiente
# Adicionar em Vercel Dashboard:
# - FIREBIRD_HOST
# - FIREBIRD_PORT
# - JWT_SECRET
# - WHATSAPP_API_KEY
# - etc...
```

### Opção 2: Docker

```bash
# 1. Criar Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
EOF

# 2. Build
docker build -t captare-erp .

# 3. Run
docker run -p 3000:3000 \
  -e FIREBIRD_HOST=192.168.25.250 \
  -e JWT_SECRET=sua-chave \
  captare-erp
```

### Opção 3: Manual (VPS/Servidor)

```bash
# 1. SSH no servidor
ssh user@seu-servidor.com

# 2. Clonar repositório
git clone https://github.com/seu-usuario/captare-erp-web.git
cd captare-erp-web

# 3. Instalar dependências
pnpm install

# 4. Configurar variáveis
cp .env.example .env.production

# 5. Build
pnpm build

# 6. Iniciar com PM2
npm install -g pm2
pm2 start npm --name "captare-erp" -- start
pm2 save
pm2 startup
```

## 🔐 Configuração de Segurança

### Variáveis de Ambiente Críticas

```env
# NUNCA commitar essas variáveis no git!
JWT_SECRET=gerar-chave-aleatoria-forte
JWT_REFRESH_SECRET=gerar-chave-aleatoria-forte
ENCRYPTION_KEY=gerar-chave-32-caracteres
PASSWORD_SALT=gerar-salt-aleatorio

# Firebird
FIREBIRD_HOST=seu-servidor.com
FIREBIRD_USER=SYSDBA
FIREBIRD_PASSWORD=sua-senha-forte

# WhatsApp
WHATSAPP_API_KEY=sua-api-key
WHATSAPP_VERIFY_TOKEN=token-aleatorio
```

### HTTPS/SSL

```bash
# Usar Let's Encrypt (gratuito)
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d seu-dominio.com
```

### Firewall

```bash
# Abrir apenas portas necessárias
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

## 📊 Monitoramento

### Logs

```bash
# Ver logs em tempo real
pm2 logs captare-erp

# Ver logs históricos
pm2 logs captare-erp --lines 100
```

### Health Check

```bash
# Verificar se aplicação está rodando
curl https://seu-dominio.com/api/health
```

## 🔄 Atualizações

```bash
# 1. Pull das mudanças
git pull origin main

# 2. Instalar dependências
pnpm install

# 3. Build
pnpm build

# 4. Restart
pm2 restart captare-erp
```

## 🆘 Troubleshooting

### Aplicação não inicia

```bash
# Verificar logs
pm2 logs captare-erp

# Verificar porta em uso
lsof -i :3000

# Verificar variáveis de ambiente
env | grep FIREBIRD
```

### Conexão com Firebird falha

```bash
# Testar conexão
telnet 192.168.25.250 6050

# Verificar credenciais
# Certifique-se que FIREBIRD_USER e FIREBIRD_PASSWORD estão corretos
```

### WhatsApp Bot não funciona

```bash
# Verificar webhook
curl -X GET "https://seu-dominio.com/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=seu-token"

# Verificar logs
pm2 logs captare-erp | grep WhatsApp
```

## 📞 Suporte

Para problemas durante o deploy:
- 📧 Email: suporte@captare.com
- 💬 WhatsApp: +55 11 98765-4321
- 🐛 GitHub Issues

---

**Versão:** 1.0.0  
**Data:** Junho 2026
