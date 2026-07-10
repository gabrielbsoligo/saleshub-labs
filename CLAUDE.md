# SalesHub Labs — Regras de Ouro (LEIA ANTES DE QUALQUER COISA)

Este repositório (`saleshub-labs`) é um **ambiente de experimentação read-only** do
SalesHub, mantido para o **Erick** prototipar telas e componentes. É uma **cópia**
do `saleshub-ruston` (a origem, o produto de verdade). O que vale aqui:

> **Nada que você fizer aqui altera o produto nem o banco.** Todo trabalho útil
> vira um **Pull Request** para o Gabriel revisar e portar pro `saleshub-ruston`.

---

## ✅ PODE

- **CRIAR** arquivos novos **somente** dentro de `src/components/labs/`.
- **LER** dados do Supabase **apenas com SELECT**, usando a **chave read-only**
  (`VITE_SUPABASE_ANON_KEY`) que está no seu `.env` local.
- Reusar os componentes visuais e utilitários que já existem no projeto
  (ex.: `src/components/ui/`, `src/lib/supabase.ts`) — **importando**, sem editá-los.
- Rodar o app localmente (`npm install` → `npm run dev`) e abrir o preview.

## ❌ NÃO PODE (nunca)

- **NUNCA editar** um arquivo que já existe fora de `src/components/labs/`.
  (Nada de mexer em telas, store, tipos, libs, migrations, edge functions, etc.)
- **NUNCA** rodar migration, `INSERT`, `UPDATE`, `DELETE`, `upsert`, RPC de escrita,
  ou qualquer coisa que altere dados/estrutura do banco.
- **NUNCA** usar a **`service_role` key** nem um **Personal Access Token (`sbp_...`)**.
  Se você viu uma dessas em algum lugar, ela está **errada/vazada** — pare e avise o Gabriel.
- **NUNCA** commitar segredos (`.env`, chaves, tokens) no repositório.
- **NUNCA** dar push direto na `main`. Todo trabalho sai em **branch + PR**.

---

## Fluxo de trabalho do Erick

1. Trabalhe sempre numa branch (`git checkout -b labs/minha-ideia`).
2. Crie seus componentes **dentro de `src/components/labs/`**.
3. Leia dados só com `supabase.from('...').select(...)` (read-only).
4. Rode `npm run dev`, valide no preview.
5. Abra um **PR** descrevendo a ideia. O Gabriel revisa e porta pro produto.

Comece olhando `src/components/labs/README.md` e o exemplo `LabHello.tsx`.

---

## Por que tão rígido?

A chave `anon` é pública **por design** e o banco é protegido por **RLS**
(Row-Level Security). O ambiente só é seguro enquanto **ninguém** trouxer uma
chave privilegiada pra cá. A `service_role` ignora o RLS e dá acesso total —
por isso ela **jamais** entra neste repositório. Mantendo a regra
"só cria em `labs/`, só lê, só PR", nada que acontece aqui pode quebrar o produto.
