import { useCallback, useEffect, useState } from "react";
import { fetchPlatformConnections } from "@/features/home/publishing/api/platformApi";
import { PlatformConnection } from "@/features/home/publishing/models/platformModels";

export function usePlatformConnections() {
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [serverTime, setServerTime] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadConnections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchPlatformConnections();
      setConnections(result.connections);
      setServerTime(result.serverTime ?? null);
    } catch (err) {
      console.error(err);
      setError("Unable to load connections. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadConnections();
  }, [loadConnections]);

  return {
    connections,
    serverTime,
    loading,
    error,
    reload: loadConnections,
  };
}
