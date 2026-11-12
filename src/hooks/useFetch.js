import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook pengambilan data sederhana dengan state loading, error, dan reload.
 *
 * @param {() => Promise<{data: unknown, meta?: unknown}>} loader
 * @param {Array} deps
 * @param {{ enabled?: boolean, initialData?: unknown }} options
 */
export function useFetch(loader, deps = [], { enabled = true, initialData = null } = {}) {
  const [data, setData] = useState(initialData);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [tick, setTick] = useState(0);

  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const reload = useCallback(() => setTick((nilai) => nilai + 1), []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return undefined;
    }

    let aktif = true;
    setLoading(true);
    setError(null);

    loaderRef
      .current()
      .then((hasil) => {
        if (!aktif) return;
        setData(hasil?.data ?? null);
        setMeta(hasil?.meta ?? null);
        setUpdatedAt(new Date());
      })
      .catch((err) => {
        if (!aktif || err?.name === 'AbortError') return;
        setError(err);
      })
      .finally(() => {
        if (aktif) setLoading(false);
      });

    return () => {
      aktif = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, tick, ...deps]);

  return { data, meta, loading, error, reload, updatedAt };
}
