import React, { useEffect, useState } from "react";
import { Loader2, AlertTriangle, Database } from "lucide-react";
import { supabase } from "../../lib/supabase";

/**
 * LabHello — componente-molde do playground do Erick.
 *
 * O que ele faz: conecta no Supabase com a chave READ-ONLY (anon) do .env,
 * faz UM `SELECT` numa tabela e mostra o resultado numa tabelinha, reusando
 * o estilo visual do app (variáveis --color-v4-*).
 *
 * Regras (ver CLAUDE.md na raiz):
 *  - SOMENTE leitura. Nada de insert/update/delete/RPC de escrita.
 *  - Nunca use service_role / sbp_. Só a anon (read-only).
 *  - Copie este arquivo como ponto de partida pros seus experimentos em labs/.
 *
 * Troque a constante TABELA pela tabela/view que quiser inspecionar.
 */
const TABELA = "team_members";
const LIMITE = 10;

export function LabHello() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alivo = true;
    (async () => {
      setLoading(true);
      setError(null);
      // Leitura pura: .select() com limite. Sem nenhuma mutação.
      const { data, error } = await supabase
        .from(TABELA)
        .select("*")
        .limit(LIMITE);
      if (!alivo) return;
      if (error) {
        setError(error.message);
      } else {
        setRows((data ?? []) as Record<string, unknown>[]);
      }
      setLoading(false);
    })();
    return () => {
      alivo = false;
    };
  }, []);

  // Colunas derivadas da 1ª linha (no máx. 5, pra tabela ficar enxuta).
  const colunas = rows.length > 0 ? Object.keys(rows[0]).slice(0, 5) : [];

  return (
    <div className="p-4 rounded-xl border border-[var(--color-v4-border)] bg-[var(--color-v4-surface)]/40 max-w-3xl">
      <div className="flex items-center gap-2 mb-3">
        <Database className="w-4 h-4 text-[var(--color-v4-text-muted)]" />
        <h2 className="text-sm font-semibold text-white">
          Lab Hello — leitura de <code className="text-[var(--color-v4-text-muted)]">{TABELA}</code>
        </h2>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-[var(--color-v4-text-muted)] py-6">
          <Loader2 className="w-4 h-4 animate-spin" /> Carregando…
        </div>
      )}

      {!loading && error && (
        <div className="flex items-start gap-2 text-sm text-amber-400/90 py-4">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Não consegui ler `{TABELA}`.</p>
            <p className="text-[var(--color-v4-text-muted)]">{error}</p>
            <p className="text-[var(--color-v4-text-muted)] mt-1">
              Se for erro de permissão, provavelmente é o RLS — peça a policy de
              leitura ao Gabriel, ou troque a constante TABELA por uma tabela pública.
            </p>
          </div>
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <p className="text-sm text-[var(--color-v4-text-muted)] py-4">
          Consulta OK, mas voltou vazia (0 linhas).
        </p>
      )}

      {!loading && !error && rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[420px]">
            <thead>
              <tr className="text-[11px] text-[var(--color-v4-text-muted)] text-left">
                {colunas.map((c) => (
                  <th key={c} className="px-2 py-1">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t border-[var(--color-v4-border)] text-white">
                  {colunas.map((c) => (
                    <td key={c} className="px-2 py-1.5">{formatCell(row[c])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[11px] text-[var(--color-v4-text-muted)] mt-2">
            {rows.length} linha(s) · máx. {LIMITE} · somente leitura
          </p>
        </div>
      )}
    </div>
  );
}

function formatCell(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

export default LabHello;
