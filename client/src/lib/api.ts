// Set VITE_API_URL in client/.env, e.g. VITE_API_URL=http://localhost:8080.
// Empty uses the current origin.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? ""
type ApiError = { error?: string; msg?: string; message?: string }

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options)
  const text = await response.text()
  let data: T | ApiError | string = text
  try { data = JSON.parse(text) as T | ApiError } catch { /* API token can be plain text */ }
  if (!response.ok) { const error = data as ApiError; throw new Error(error.error || error.msg || error.message || "Something went wrong. Please try again.") }
  return data as T
}

export function authenticate(path: "/login" | "/Signup", name: string, password: string) {
  return request<string>(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ Name: name, Password: password }) })
}

export function createFeed(name: string, feed: string, url: string, token: string) {
  return request<{ success?: string; msg?: string }>("/feed", { method: "POST", headers: { "Content-Type": "application/json", Authorization: token }, body: JSON.stringify({ Name: name, Feed: feed, Url: url }) })
}

export function logout(token: string) {
  return request<{ success?: string }>("/logout", { method: "POST", headers: { Authorization: token } })
}

export function getFeeds(token: string) {
  return request<{ feed?: string[]; msg?: string }>("/getFeed", { method: "GET", headers: { Authorization: token } })
}
