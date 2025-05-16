const getQueryParams = (data?: Record<string, string>) => {
  const queryParamsString = new URLSearchParams(data).toString();
  return queryParamsString ? `?${queryParamsString}` : "";
};

export async function request<T>(
  url: string,
  path: string,
  options?: {
    method?: string;
    body?: unknown;
    params?: Record<string, string>;
  },
): Promise<T> {
  const params = getQueryParams(options?.params);
  const response = await fetch(`${url}${path}${params}`, {
    method: options?.method || "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return (await response.json()) as T;
}
