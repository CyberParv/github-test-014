import type { ApiResponse } from "@/types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
    ...options
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  const data = (await response.json()) as T;
  return { data, status: response.status };
}
