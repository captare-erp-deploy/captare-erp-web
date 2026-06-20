# 🎨 CUSTOMIZAÇÃO DO CAPTARE ERP

## Versão: 1.0.0
## Data: 20/06/2026

---

## 📋 CUSTOMIZAÇÕES REALIZADAS

### 1. **Cores Corporativas**
```
Primária: #0066CC (Azul Corporativo)
Fundo: #ffffff (Branco)
Superfície: #f8f9fa (Cinza Claro)
Texto: #1a1a1a (Preto)
Sucesso: #10b981 (Verde)
Aviso: #f59e0b (Amarelo)
Erro: #ef4444 (Vermelho)
```

### 2. **Tipografia**
- **Fonte Principal**: Inter, system-ui, sans-serif
- **Tamanho Base**: 16px
- **Escala**: 1.125 (Major Third)

### 3. **Espaçamento**
- **Unidade Base**: 4px
- **Escala**: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

### 4. **Componentes Customizados**

#### Dashboard
- Cards com sombra suave
- Ícones com cores temáticas
- Transições suaves

#### Formulários
- Inputs com borda azul
- Labels em negrito
- Validação em tempo real

#### Botões
- Primário: Azul (#0066CC)
- Secundário: Cinza (#6b7280)
- Tamanhos: Small, Medium, Large

---

## 🎯 GUIA DE CUSTOMIZAÇÃO

### Mudar Cores
1. Edite `app/globals.css`
2. Procure por variáveis CSS
3. Altere os valores hexadecimais

### Adicionar Fonte
1. Importe em `app/layout.tsx`
2. Configure no `tailwind.config.js`

### Criar Novo Componente
1. Crie em `components/`
2. Use classes Tailwind
3. Siga o padrão de cores

---

## 📱 RESPONSIVIDADE

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

---

## 🔧 PRÓXIMOS PASSOS

- [ ] Adicionar logo da empresa
- [ ] Customizar favicon
- [ ] Adicionar fontes customizadas
- [ ] Criar temas (Light/Dark)
- [ ] Adicionar animações
- [ ] Otimizar performance

---

## 📞 SUPORTE

Para mais informações, consulte:
- `app/globals.css` - Estilos globais
- `tailwind.config.js` - Configuração Tailwind
- `components/` - Componentes reutilizáveis
