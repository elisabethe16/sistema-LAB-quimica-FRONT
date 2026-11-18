# Ajustes feitos

- Menu lateral recolhido por padrão no desktop, expandindo com mouse ou foco do teclado.
- Menu lateral deslizante no celular, acionado pelo botão de três linhas.
- Acervo vira cartões no celular e mantém tabela no computador.
- Botões do Acervo agora exibem “Editar” e “Excluir”.
- Ajustes em filtros, formulários, janelas e tamanhos para celular.

## Erro RLS no upload
Não é erro do layout. No Render, configure `SUPABASE_SERVICE_ROLE_KEY` com a chave **secret/service_role** do projeto Supabase e faça deploy. O bucket `insumos-imagens` deve existir. Nunca coloque essa chave no Vercel nem crie INSERT público para `anon`.

## Publicação
Frontend: substituir os arquivos do repositório Vercel e publicar. Backend: substituir os arquivos do repositório Render e configurar o segredo. Não é necessária migração de banco para estas quatro correções.
