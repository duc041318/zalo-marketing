// API helper with auth token
export async function apiCall(url: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (res.status === 401) {
    // Token expired or invalid
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    throw new Error("Phiên đăng nhập hết hạn");
  }

  if (!res.ok) {
    throw new Error(data.error || "Đã xảy ra lỗi");
  }

  return data;
}

// Shorthand methods
export const api = {
  get: (url: string) => apiCall(url),
  post: (url: string, body: unknown) =>
    apiCall(url, { method: "POST", body: JSON.stringify(body) }),
  put: (url: string, body: unknown) =>
    apiCall(url, { method: "PUT", body: JSON.stringify(body) }),
  delete: (url: string) => apiCall(url, { method: "DELETE" }),
};
