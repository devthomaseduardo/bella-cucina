# Deploy

O front é uma SPA estática. O [vercel.json](../vercel.json) redireciona todas as rotas para `index.html`.

## Pipeline (GitHub Actions)

| Evento | O que roda |
|--------|-----------|
| Pull request | CI (typecheck, lint, testes, build) → deploy de **preview** na Vercel → comentário no PR com a URL |
| Push na `main` | CI → `supabase db push` (migrations) → deploy de **produção** na Vercel |

Arquivos: [.github/workflows/ci.yml](../.github/workflows/ci.yml) e [.github/workflows/cd.yml](../.github/workflows/cd.yml).

### Secrets necessários

Em **Settings → Secrets and variables → Actions**:

| Secret | Onde obter |
|--------|-----------|
| `VERCEL_TOKEN` | Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` | `.vercel/project.json`, gerado por `vercel link` |
| `SUPABASE_ACCESS_TOKEN` | Supabase → Account → Access Tokens |
| `SUPABASE_PROJECT_ID` | ID do projeto de produção |
| `SUPABASE_DB_PASSWORD` | Senha do banco de produção |

Sem os secrets do Supabase, o passo de migrations é pulado com um aviso. Crie os ambientes `preview` e `production` em **Settings → Environments**. Em `production`, dá para exigir aprovação manual antes do deploy.

> Se o projeto Vercel estiver conectado ao GitHub pela integração nativa, desative os deploys automáticos dela (**Settings → Git → Ignored Build Step**: `exit 0`) para não fazer deploy duas vezes.

Proteja a `main` exigindo o check **CD / ci / Typecheck, lint, test, build** antes do merge.

## Vercel (manual)

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
