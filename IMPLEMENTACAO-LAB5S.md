# Atualização Lab5S

## Frontend (Vercel)
- O ponto de entrada é `index.html` -> `/src/index.jsx`.
- Configure em Vercel > Settings > Environment Variables:
  - `VITE_API_URL` = URL pública do backend no Render, sem barra final.
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: pasta onde está este `package.json` (na raiz deste pacote).

## Backend (Render)
O backend atualizado está em `backend/`.
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Variáveis necessárias:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` (preferível; nunca colocar no frontend)
  - `PORT` (opcional, o Render define)

A chave `SUPABASE_SERVICE_ROLE_KEY` é privilegiada. Configure somente como Secret/Environment Variable no Render.
O código mantém compatibilidade temporária com as senhas antigas em texto puro: no primeiro login correto, a senha é migrada para bcrypt. Novos usuários e novas senhas já são gravados com bcrypt. Faça backup do banco antes do deploy.

## Supabase Storage
Crie um bucket chamado `insumos-imagens` e marque-o como **Public**. O backend usa a service role para enviar arquivos e obter a URL pública. Não exponha a service role no Vercel.

## SQL
A tabela `insumos_cadastrados` deve conter:
```sql
ALTER TABLE public.insumos_cadastrados
ADD COLUMN IF NOT EXISTS imagem_url text,
ADD COLUMN IF NOT EXISTS data_validade date,
ADD COLUMN IF NOT EXISTS sem_data_validade boolean NOT NULL DEFAULT true;
```

## Atenção à autenticação
A API original não utiliza sessão/token. A rota de alteração de senha verifica novamente login e senha atual, mas não substitui uma autenticação com token. As rotas administrativas também ainda dependem das verificações do frontend e dos campos de responsável enviados pelo cliente. Antes de usar em produção com dados sensíveis, implemente autenticação JWT/Supabase Auth e autorização no backend.
