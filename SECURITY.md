# Política de segurança

## Reportando uma vulnerabilidade

**Não abra uma issue pública.** Use o [reporte privado de vulnerabilidades](https://github.com/devthomaseduardo/bella-cucina/security/advisories/new) do GitHub.

Inclua, se possível:

- o que é afetado (rota, tabela, função SQL, policy de RLS);
- passos para reproduzir;
- o impacto esperado (ex.: um cliente lê a conta de outra mesa).

Você recebe uma resposta em até **5 dias úteis**. Correções críticas são priorizadas.

## Versões suportadas

Só a branch `main` (última versão publicada) recebe correções.

## Escopo

Têm prioridade, por serem o centro do modelo de segurança:

- policies de RLS e funções `SECURITY DEFINER` em [`supabase/migrations`](supabase/migrations);
- separação entre clientes anônimos e staff (`is_staff_session()`);
- isolamento entre sessões de mesa.

Riscos conhecidos e já planejados estão no [milestone MVP v1](https://github.com/devthomaseduardo/bella-cucina/milestone/1) com o label `security`.

## Práticas do projeto

- A chave `anon` do Supabase é pública por natureza. A segurança depende do RLS, **nunca** de esconder a chave.
- A `service_role` key nunca deve estar no front-end nem no repositório.
- Dependabot, CodeQL e secret scanning (com push protection) ficam ativos no repositório.
