import type { NextRequest } from 'next/server';

export function jsonRequest(url: string, init?: RequestInit & { json?: any }) {
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  const body = init?.json !== undefined ? JSON.stringify(init.json) : init?.body;
  return new Request(url, { ...init, headers, body });
}

export async function readJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

export function makeNextRequest(req: Request) {
  // For route handlers expecting NextRequest; in tests we can pass Request in many cases.
  return req as unknown as NextRequest;
}
