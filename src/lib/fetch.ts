import { useCallback, useEffect, useState } from "react";

export const fetchAPI = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const body = await response.text();
      let message = `HTTP error! status: ${response.status}`;
      try {
        const result = JSON.parse(body);
        if (typeof result.error === "string") message += `: ${result.error}`;
      } catch {
        // Non-JSON responses still report their HTTP status.
      }
      throw new Error(message);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const useFetch = <T>(url: string, options?: RequestInit) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAPI(url, options);
      setData(result.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (active) return fetchData();
    });
    return () => {
      active = false;
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
