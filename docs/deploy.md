# Deploy

O front é uma SPA estática. O [vercel.json](../vercel.json) redireciona todas as rotas para `index.html`.

## Pipeline

| Evento | GitHub Actions | Vercel (integração GitHub) |
|--------|----------------|----------------------------|
| Pull request | CI: typecheck, lint, audit, testes, build | Deploy de **preview** com link no PR |
| Push na `main` | CI → `supabase db push` (migrations) | Deploy de **produção** |

Arquivos: [.github/workflows/ci.yml](../.github/workflows/ci.yml), [.github/workflows/cd.yml](../.github/workflows/cd.yml) e [.github/workflows/codeql.yml](../.github/workflows/codeql.yml).

A `main` é protegida: o check **ci / Typecheck, lint, test, build** precisa passar antes do merge.

### Secrets das migrations

Em **Settings → Environments → production**, crie:

| Secret | Onde obter |
|--------|-----------|
| `SUPABASE_ACCESS_TOKEN` | Supabase → Account → Access Tokens |
| `SUPABASE_PROJECT_ID` | ID do projeto de produção |
| `SUPABASE_DB_PASSWORD` | Senha do banco de produção |

Sem esses secrets, o passo de migrations é pulado com um aviso.

> A Vercel publica a produção em paralelo com as migrations. Quando uma mudança de front depender de uma migration nova, mescle primeiro a migration e só depois o front.

## Vercel

1. Importe o repositório na Vercel (framework: Vite, build `npm run build`, saída `dist`).
2. Configure as variáveis em **Production** e **Preview**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_BASE_PATH=/`
3. Faça o deploy.

## Supabase de produção

- Use um projeto **separado** do de desenvolvimento.
- Aplique as migrations em ordem.
- Faça a configuração de Auth descrita em [setup-local.md](setup-local.md#2-autenticação): anônimo ligado, cadastro público desligado.
- Em **Authentication → URL Configuration**, cadastre o domínio de produção.

## Checklist antes de ir ao ar

- [ ] Migrations aplicadas e tipos regenerados
- [ ] Cadastro público desativado e usuários da equipe criados
- [ ] QR codes impressos com o domínio de produção
- [ ] Fluxo de ponta a ponta testado ([setup-local.md](setup-local.md#5-testar-o-fluxo-de-ponta-a-ponta))
- [ ] Itens P0 do [milestone MVP v1](https://github.com/devthomaseduardo/bella-cucina/milestone/1) concluídos

Acompanhe a infraestrutura de produção na issue [#12](https://github.com/devthomaseduardo/bella-cucina/issues/12).
