# 🔗 INTEGRAÇÃO COM FIREBIRD (CaptarePro)

## Versão: 1.0.0
## Data: 20/06/2026

---

## 📋 VISÃO GERAL

Este guia descreve como integrar o Captare ERP com o banco de dados Firebird do CaptarePro para sincronização de dados em tempo real.

---

## ✅ PRÉ-REQUISITOS

- [ ] Firebird instalado e rodando
- [ ] Banco de dados CaptarePro acessível
- [ ] Credenciais do Firebird (user/password)
- [ ] Porta 3050 aberta (padrão Firebird)
- [ ] Node.js com suporte a Firebird

---

## 🔧 INSTALAÇÃO

### 1. Instalar Driver Firebird

```bash
npm install firebird
# ou
pnpm add firebird
```

### 2. Configurar Variáveis de Ambiente

Adicione ao `.env.local`:

```env
# Firebird Configuration
FIREBIRD_HOST=localhost
FIREBIRD_PORT=3050
FIREBIRD_DATABASE=/opt/firebird/data/captarepro.fdb
FIREBIRD_USER=sysdba
FIREBIRD_PASSWORD=masterkey
```

### 3. Verificar Conexão

```bash
# Testar conexão
curl http://localhost:3000/api/sync/firebird
```

---

## 📊 TABELAS SINCRONIZADAS

### 1. **CLIENTES**
```sql
SELECT 
  CODCLI as id,
  NOMCLI as nome,
  ENDCLI as endereco,
  CIDCLI as cidade,
  TELCLI as telefone,
  EMACLI as email,
  CPFCLI as cpf,
  CNPJCLI as cnpj
FROM CLIENTES
WHERE ATIVO = 'S'
```

### 2. **PRODUTOS**
```sql
SELECT 
  CODPRO as id,
  NOMPRO as nome,
  DESPRO as descricao,
  VLRPRO as preco,
  QTDEST as estoque,
  CATPRO as categoria
FROM PRODUTOS
WHERE ATIVO = 'S'
```

### 3. **PEDIDOS**
```sql
SELECT 
  CODPED as id,
  CODCLI as cliente_id,
  DATPED as data_pedido,
  VLRTOT as valor_total,
  STOPED as status
FROM PEDIDOS
WHERE DATPED >= CURRENT_DATE - 30
```

### 4. **ESTOQUE**
```sql
SELECT 
  CODPRO as produto_id,
  QTDEST as quantidade,
  QTDMIN as quantidade_minima
FROM ESTOQUE
```

### 5. **FINANCEIRO**
```sql
SELECT 
  CODFIN as id,
  CODPED as pedido_id,
  VLRFIN as valor,
  DTAVEN as data_vencimento,
  STAFIN as status
FROM FINANCEIRO
WHERE DTAVEN >= CURRENT_DATE - 90
```

---

## 🚀 USANDO A INTEGRAÇÃO

### Sincronizar Todos os Dados

```bash
curl -X POST http://localhost:3000/api/sync/firebird \
  -H "Content-Type: application/json" \
  -d '{"type": "all"}'
```

### Sincronizar Apenas Clientes

```bash
curl -X POST http://localhost:3000/api/sync/firebird \
  -H "Content-Type: application/json" \
  -d '{"type": "clientes"}'
```

### Sincronizar Apenas Produtos

```bash
curl -X POST http://localhost:3000/api/sync/firebird \
  -H "Content-Type: application/json" \
  -d '{"type": "produtos"}'
```

### Sincronizar Apenas Pedidos

```bash
curl -X POST http://localhost:3000/api/sync/firebird \
  -H "Content-Type: application/json" \
  -d '{"type": "pedidos"}'
```

### Testar Conexão

```bash
curl http://localhost:3000/api/sync/firebird
```

---

## 📝 RESPOSTA DA API

### Sucesso

```json
{
  "success": true,
  "message": "5 clientes sincronizados com sucesso",
  "recordsProcessed": 5,
  "timestamp": "2026-06-20T14:30:00.000Z"
}
```

### Erro

```json
{
  "success": false,
  "message": "Erro ao conectar ao Firebird: Connection refused",
  "errors": ["Connection refused"],
  "timestamp": "2026-06-20T14:30:00.000Z"
}
```

---

## 🔄 SINCRONIZAÇÃO AUTOMÁTICA

### Configurar Sincronização Periódica

Adicione ao `src/server/_core/index.ts`:

```typescript
import { createFirebirdConnection } from '@/server/integrations/firebird';

// Sincronizar a cada 1 hora
setInterval(async () => {
  try {
    const fb = createFirebirdConnection();
    const result = await fb.syncAll();
    console.log('✅ Sincronização automática:', result.message);
  } catch (error) {
    console.error('❌ Erro na sincronização automática:', error);
  }
}, 60 * 60 * 1000); // 1 hora
```

---

## 🐛 TROUBLESHOOTING

### Erro: "Connection refused"

**Solução:**
1. Verifique se Firebird está rodando
2. Confirme o host e porta
3. Teste com `telnet localhost 3050`

### Erro: "Invalid database name"

**Solução:**
1. Verifique o caminho do banco de dados
2. Confirme permissões de arquivo
3. Teste com `isql` (ferramenta Firebird)

### Erro: "Authentication failed"

**Solução:**
1. Verifique credenciais (user/password)
2. Confirme permissões do usuário
3. Teste com `isql -u sysdba -p masterkey`

### Sincronização Lenta

**Solução:**
1. Aumente o timeout
2. Sincronize em horários de baixo uso
3. Use sincronização incremental

---

## 📊 MONITORAMENTO

### Ver Logs de Sincronização

```bash
# Seguir logs em tempo real
tail -f /tmp/captare-sync.log

# Ver últimas 100 linhas
tail -100 /tmp/captare-sync.log
```

### Verificar Status

```bash
curl http://localhost:3000/api/sync/firebird
```

---

## 🔐 SEGURANÇA

### Boas Práticas

1. **Credenciais**: Use variáveis de ambiente
2. **Firewall**: Restrinja acesso à porta 3050
3. **Backup**: Faça backup antes de sincronizar
4. **Validação**: Valide dados antes de inserir
5. **Logs**: Mantenha logs de todas as sincronizações

### Exemplo de Validação

```typescript
// Validar antes de sincronizar
if (cliente.email && !isValidEmail(cliente.email)) {
  console.warn(`Email inválido: ${cliente.email}`);
  continue;
}
```

---

## 📈 PERFORMANCE

### Otimizações

1. **Índices**: Certifique-se que tabelas têm índices
2. **Batch**: Sincronize em lotes
3. **Cache**: Use cache para dados estáticos
4. **Async**: Use operações assíncronas

---

## 🎯 PRÓXIMOS PASSOS

- [ ] Testar integração com Firebird
- [ ] Configurar sincronização automática
- [ ] Adicionar monitoramento
- [ ] Criar dashboard de sincronização
- [ ] Implementar rollback automático
- [ ] Adicionar alertas de erro

---

## 📞 SUPORTE

Para problemas ou dúvidas:
1. Consulte os logs
2. Verifique as credenciais
3. Teste a conexão
4. Revise a documentação do Firebird

---

**Integração com Firebird configurada com sucesso! ✅**
