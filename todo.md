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


## Sistema Multi-usuário com Roles (Concluído)

### Fase 1: Schema e Database
- [x] Atualizar schema de usuários com role (admin/editor)
- [x] Criar procedures para gerenciar usuários
- [x] Migrar usuários existentes

### Fase 2: Backend com Verificação de Roles
- [x] Criar editorProcedure (acesso a produtos apenas)
- [x] Atualizar rotas de produtos com verificação de role
- [x] Criar rotas de gerenciamento de usuários (admin only)
- [x] Adicionar testes de permissões

### Fase 3: Interface de Usuários (Admin)
- [x] Criar página de gerenciamento de usuários
- [x] Tabela com lista de usuários
- [x] Botões para promover/rebaixar role
- [x] Botão para remover usuário

### Fase 4: Adaptação de Interface por Role
- [x] Editor vê apenas seção de produtos
- [x] Editor não vê menu de usuários/configurações
- [x] Admin vê todas as seções
- [x] Proteção de rotas por role no frontend

### Fase 5: Testes e Deploy
- [x] Testar acesso Admin (6 testes passando)
- [x] Testar acesso Editor (6 testes passando)
- [x] Testar permissões negadas (6 testes passando)
- [x] Criar checkpoint final


## Remover Autenticação OAuth - Acesso via URL Secreta

- [ ] Remover OAuth do projeto
- [ ] Remover página de Login
- [ ] Remover sistema de roles (admin/editor)
- [ ] Criar rota secreta para dashboard
- [ ] Remover links públicos para admin
- [ ] Testar acesso via URL secreta
- [ ] Criar checkpoint final
