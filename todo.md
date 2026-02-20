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


## Sistema Multi-Imagens por Produto

### Fase 1: Componentes de Gerenciamento
- [x] Criar ImageGalleryManager.tsx com interface visual
- [x] Componente ImageUpload.tsx para upload individual
- [x] Suporte para adicionar múltiplas imagens
- [x] Suporte para remover imagens individuais
- [x] Preview de imagens na galeria

### Fase 2: Armazenamento
- [x] Implementar pipe-separator (|) para múltiplas URLs
- [x] Compatibilidade com campo imageUrl existente
- [x] Sem mudanças no schema do banco de dados
- [x] Parsing robusto de URLs separadas por pipe

### Fase 3: Exibição Pública
- [x] Criar ImageCarousel.tsx para catálogo público
- [x] Navegação entre imagens (anterior/próxima)
- [x] Indicadores de imagem ativa
- [x] Fallback para "Sem imagem"
- [x] Responsivo em mobile

### Fase 4: Integração Admin
- [x] Integrar ImageGalleryManager no ProductForm
- [x] Exibir galeria ao criar novo produto
- [x] Exibir galeria ao editar produto
- [x] Salvar múltiplas imagens ao criar/atualizar
- [x] Carregar imagens existentes ao editar

### Fase 5: Testes e Validação
- [x] Testar upload de múltiplas imagens
- [x] Testar remoção individual de imagens
- [x] Testar carousel na página pública
- [x] Testar compatibilidade com produtos existentes
- [x] Testar fallback quando sem imagens


## Drag-and-Drop para Reordenar Imagens
- [x] Implementar handlers de drag (onDragStart, onDragOver, onDrop)
- [x] Adicionar feedback visual durante drag (highlight, opacity)
- [x] Reordenar array de imagens ao soltar
- [x] Testar em desktop e mobile
- [x] Criar checkpoint final


## Correções e Melhorias Solicitadas
- [x] Remover campo "Imagem do Produto" (ImageUpload)
- [x] Consolidar tudo em "Galeria de Imagens" (ImageGalleryManager)
- [x] Corrigir erro NotFoundError no upload de imagens (refatorado com useEffect)
- [x] Adicionar scroll vertical no modal do formulário
- [x] Testar upload, salvamento e atualização de imagens
- [x] Validar acesso aos botões de ação
- [x] Criar testes vitest para validar refatoração


## Carrossel de Imagens no Marketplace
- [x] Implementar carrossel no ProductModal.tsx
- [x] Corrigir desaparecimento de imagens ao atualizar
- [x] Corrigir erro NotFoundError no ImageCarousel (memoization e validação)
- [x] Testar com múltiplas imagens
- [x] Validar que dashboard não trava (removido useMemo problemático)


## Simplificação do Dashboard Admin
- [x] Remover navegação lateral
- [x] Manter apenas botão "Voltar para página principal"
- [x] Remover aba "Usuários"
- [x] Remover painel de estatísticas (Total, Ativos, Sem Estoque)
- [x] Criar aba para alterar ícone/logo do sistema
- [x] Implementar upload de ícone (PNG/JPG)
- [x] Corrigir texto "Núcleos" para "Cores" no marketplace
- [x] Testar todas as mudanças


## Melhoria de Navegação e Usabilidade
- [x] Adicionar paginação na listagem de produtos do dashboard
- [x] Reformular layout do ProductModal com tamanho maior
- [x] Reorganizar informações no modal (imagens, cores, preço, estoque)
- [x] Melhorar navegação e usabilidade do modal
- [x] Testar paginação e novo layout


## Correção do Sistema de Cores (Concluído)
- [x] Diagnosticar problema de cores não sendo exibidas no marketplace
- [x] Corrigir ProductCard.tsx para usar parseColorIds() em vez de JSON.parse()
- [x] Corrigir ProductModal.tsx para parsear string de cores corretamente
- [x] Corrigir Home.tsx para passar colors corretos ao abrir modal
- [x] Testar exibição de múltiplas cores no marketplace
- [x] Testar salvamento de cores na dashboard
- [x] Testar atualização de cores sem crashes
- [x] Validar consistência entre dashboard e marketplace
- [x] Adicionar logs de debug ao ColorSelector (removidos após testes)


## Otimização do Layout do Modal de Detalhes (Concluído)
- [x] Refatorar ProductModal.tsx para layout horizontal na versão desktop
- [x] Reorganizar seções (imagens, preço, cores, especificações)
- [x] Melhorar distribuição de espaço em telas grandes
- [x] Manter layout vertical responsivo para mobile
- [x] Testar em diferentes resoluções de desktop
- [x] Validar visibilidade de todas as informações sem rolagem excessiva


## Correção da Seção de Cores no Modal (Concluído)
- [x] Remover sobreposição de cores no grid
- [x] Reorganizar grid de cores para ser mais compacto
- [x] Remover seção "Material: Personalizado" (Especificações)
- [x] Manter apenas cores, tamanhos e características
- [x] Testar layout corrigido
- [x] Validar responsividade


## Simplificação da Navegação do Gerenciamento de Produtos (Concluído)
- [x] Remover sistema de abas (Produtos, Ícone do Sistema)
- [x] Manter apenas a lista de produtos
- [x] Garantir que paginação funcione corretamente
- [x] Testar interface simplificada
- [x] Validar responsividade


## Implementação de Imagem Personalizável no Banner (Em Progresso)
- [x] Remover texto "C.N.V. Gravação a Laser Premium" do banner
- [x] Criar espaço para imagem PNG na frente dos quadrados amarelos
- [x] Implementar sistema de upload com drag & drop
- [x] Criar aba de gerenciamento no dashboard
- [x] Permitir substituição de imagem
- [ ] Testar upload e exibição no banner
- [ ] Validar responsividade em mobile e desktop

## Correção de Bugs Críticos (Concluído)
- [x] Imagem do banner não aparece no marketplace após upload (CORRIGIDO)
- [x] Erro ao editar informações dos produtos (NotFoundError: removeChild) - CORRIGIDO
- [x] Verificar salvamento de URL do banner em localStorage (FUNCIONANDO)
- [x] Verificar função de update de produtos (FUNCIONANDO)
- [x] Revisar conflito entre novos campos adicionados (RESOLVIDO)


## Implementação de Sistema de Upload de Logo/Ícone (Implementado)
- [x] Criar componente LogoSettings para upload com drag & drop
- [x] Suportar formatos PNG e JPG
- [x] Criar componente LogoDisplay para exibir logo no header
- [x] Adicionar aba "Logo/Ícone" ao Admin.tsx
- [x] Integrar armazenamento em localStorage
- [ ] Testar upload e exibição no marketplace (aguardando deploy)
- [ ] Validar responsividade em mobile e desktop (aguardando deploy)

## 🚨 BUG CRÍTICO - Erro ao Atualizar Produtos (RESOLVIDO ✅)
- [x] Diagnosticar erro "NotFoundError: Failed to execute 'removeChild'" ao atualizar produtos
- [x] Corrigir problema de DOM/React em ProductForm.tsx
- [x] Testar atualização de produto sem cores
- [x] Testar atualização de produto com mudança de cores
- [x] Testar atualização de múltiplas cores
- [x] Validar que não há crashes no frontend
- [x] Validar que não há crashes no backend
- [x] Testar fluxo completo antes de deploy


## Sistema de Cores - Totalmente Corrigido (RESOLVIDO ✅)
- [x] Diagnosticar problema de cores nao carregarem ao editar
- [x] Corrigir dependencia vazia do useMemo no ColorSelector
- [x] Adicionar useEffect para sincronizar cores com valor externo
- [x] Testar carregamento automatico de cores
- [x] Testar multiplas selecoes sem crashes
- [x] Testar atualizacao de cores sem erros
- [x] Validar sincronizacao marketplace/dashboard
- [x] Validar console sem erros
- [x] Testar fluxo completo antes de deploy
