# `src/components/labs/` — playground do Erick

Esta é a **única** pasta onde você cria arquivos. Tudo aqui é experimental e
descartável; o que der certo vira PR pro Gabriel portar pro produto.

## Regras (resumo — o detalhe está no `CLAUDE.md` da raiz)

- ✅ Crie componentes **novos** aqui dentro.
- ✅ Leia dados só com `supabase.from('tabela').select(...)` (**read-only**).
- ✅ Reuse o que já existe importando (ex.: `../ui/...`, `../../lib/supabase`).
- ❌ Não edite arquivos fora desta pasta.
- ❌ Nada de escrita no banco (`insert`/`update`/`delete`/migration/RPC de escrita).
- ❌ Nada de `service_role` / `sbp_...`. Só a `anon` (read-only) do `.env`.

## Exemplo

`LabHello.tsx` — molde mínimo: conecta no Supabase com a chave read-only,
faz um `SELECT` numa tabela, e mostra o resultado numa tabelinha usando o
mesmo estilo visual do app. Copie ele como ponto de partida.

```tsx
import { LabHello } from './components/labs/LabHello';
// ...em algum lugar do app durante o experimento:
<LabHello />
```

Troque a constante `TABELA` dentro do `LabHello.tsx` pela tabela/view que você
quer inspecionar (ex.: `team_members`, `metas`, `reunioes`, ...). Se o `SELECT`
voltar vazio ou der erro de permissão, é o **RLS** fazendo o trabalho dele —
peça ao Gabriel a policy de leitura se precisar.
