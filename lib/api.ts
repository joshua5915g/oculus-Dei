import { DetectionResponse, HealthResponse } from "./types";

// If NEXT_PUBLIC_API_URL is configured (e.g. deployed FastAPI server on Render/AWS/localhost), use it.
// Otherwise, default to relative "/api/v1" so Next.js serverless API routes handle it directly on Vercel!
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? "/api/v1" : "http://localhost:3000/api/v1");

export async function checkBackendHealth(): Promise<HealthResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error("Health check failed");
    return await res.json();
  } catch {
    // If external URL failed, try local Next.js fallback
    if (API_BASE_URL !== "/api/v1") {
      try {
        const fallback = await fetch("/api/v1/health", {
          signal: AbortSignal.timeout(2000),
        });
        if (fallback.ok) return await fallback.json();
      } catch {}
    }
    return null;
  }
}

export async function analyzeMedia(file: File): Promise<DetectionResponse> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_BASE_URL}/detect`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      // If external server failed and we are in the browser, fallback to /api/v1/detect
      if (API_BASE_URL !== "/api/v1") {
        const fallbackRes = await fetch("/api/v1/detect", {
          method: "POST",
          body: formData,
        });
        if (fallbackRes.ok) return await fallbackRes.json();
      }

      let errorDetail = "Forensic analysis failed";
      try {
        const errJson = await response.json();
        errorDetail = errJson.detail || errorDetail;
      } catch {
        errorDetail = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorDetail);
    }

    return await response.json();
  } catch (err: any) {
    // Fallback to internal route if external network failed
    if (API_BASE_URL !== "/api/v1") {
      try {
        const fallbackRes = await fetch("/api/v1/detect", {
          method: "POST",
          body: formData,
        });
        if (fallbackRes.ok) return await fallbackRes.json();
      } catch {}
    }
    throw err;
  }
}
