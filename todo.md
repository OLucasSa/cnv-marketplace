# C.N.V. Personalizados - Admin Dashboard TODO

## Marketplace (Concluído)
- [x] Hero section e layout responsivo
- [x] Grid de produtos com 25+ itens
- [x] Modal interativo de detalhes
- [x] Integração WhatsApp
- [x] Imagens de produtos geradas

## Admin Dashboard (Concluído)

### Fase 1: Configuração Backend
- [x] Resolver conflito Home.tsx (manter marketplace, adicionar rota /admin)
- [x] Criar schema de produtos no banco de dados
- [x] Migrar produtos existentes para PostgreSQL
- [x] Implementar rotas tRPC para CRUD de produtos

### Fase 2: Autenticação
- [x] Configurar Manus OAuth (automático com web-db-user)
- [x] Criar página de login (automático com useAuth)
- [x] Implementar proteção de rota /admin
- [x] Adicionar verificação de admin

### Fase 3: Interface Admin
- [x] Criar layout DashboardLayout para admin
- [x] Página de lista de produtos (tabela)
- [x] Página de criar novo produto
- [x] Página de editar produto
- [x] Modal de confirmação de exclusão

### Fase 4: Upload de Imagens
- [x] Implementar upload para Manus Storage
- [x] Preview de imagem antes de salvar
- [x] Salvar URL da imagem no banco

### Fase 5: Métricas
- [x] Dashboard com estatísticas
- [x] Total de produtos
- [x] Produtos ativos
- [x] Produtos sem estoque
- [x] Componente de métricas

### Fase 6: Testes e Deploy
- [x] Testar CRUD completo (vitest)
- [x] Testar autenticação (vitest)
- [x] Testar upload de imagens (componente criado)
- [x] Verificar live updates no marketplace (tRPC em tempo real)
- [x] Corrigir integração Home com banco de dados
- [x] Criar checkpoint final
