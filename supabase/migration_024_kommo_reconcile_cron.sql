-- =============================================================
-- Migration 024 — pg_cron pra rodar kommo-reconcile 1x/dia
-- =============================================================
-- Backfill diario: pega leads com kommo_id mas sem
-- kommo_contact_synced_at e tenta sincronizar contato.
-- Cobre Laqus + 13 outros + drift futuro.
-- =============================================================

DO $cron$
BEGIN
    IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'kommo-reconcile') THEN
        PERFORM cron.unschedule('kommo-reconcile');
    END IF;

    PERFORM cron.schedule(
        'kommo-reconcile',
        '0 4 * * *',  -- 04:00 UTC diariamente (01:00 BR)
        $job$
        SELECT net.http_post(
            url := 'https://iaompeiokjxbffwehhrx.supabase.co/functions/v1/kommo-reconcile',
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer SUPABASE_JWT_REMOVIDO'
            ),
            body := jsonb_build_object('source', 'cron')
        );
        $job$
    );
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'pg_cron schedule kommo-reconcile skipped: %', SQLERRM;
END
$cron$;

COMMENT ON EXTENSION pg_cron IS 'cron schedule kommo-reconcile @04:00 UTC daily';
