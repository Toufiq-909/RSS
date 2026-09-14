import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

type AuthMode = "login" | "signup"

export default function Auth({ mode }: { mode: AuthMode }) {
  const isSignUp = mode === "signup"
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit() {
    const trimmedName = name.trim()
    if (trimmedName.length < 2) { setError("Please enter a name with at least 2 characters."); return }
    if (password.length < 8) { setError("Your password must be at least 8 characters long."); return }
    if (isSignUp && password !== confirmPassword) { setError("Your passwords do not match."); return }

    setError("")
    setIsSubmitting(true)

    try {
      const endpoint = isSignUp ? "/Signup" : "/login"
      const response = await fetch(`${import.meta.env.VITE_API_URL ?? ""}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name: trimmedName, Password: password })
      })

      const text = await response.text()
      let token = ""

      try {
        token = JSON.parse(text)
      } catch {
        token = text
      }

      if (!response.ok) {
        throw new Error(typeof token === "object" && token && "error" in token ? String(token) : "Unable to connect. Please try again.")
      }

      localStorage.setItem("rssfeed-token", token)
      localStorage.setItem("rssfeed-name", trimmedName)
      navigate("/feed")
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to connect. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return <main className="auth-page"><div className="auth-panel"><Link className="auth-brand" to="/"><span>◔</span> rssfeed</Link><div className="auth-copy"><p className="feed-kicker">{isSignUp ? "START READING YOUR WAY" : "WELCOME BACK"}</p><h1>{isSignUp ? <>Make your feed<br /><em>yours.</em></> : <>Good to see<br /><em>you again.</em></>}</h1><p>{isSignUp ? "Create an account to keep your feeds, sources, and reading history together." : "Log in to pick up right where you left off."}</p></div><form className="auth-form" noValidate><label htmlFor="name">Name</label><input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoComplete="username" /><label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" autoComplete={isSignUp ? "new-password" : "current-password"} />{isSignUp && <><label htmlFor="confirm-password">Confirm password</label><input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat your password" autoComplete="new-password" /></>}{error && <p className="form-error" role="alert">{error}</p>}<button type="button" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? "Please wait..." : isSignUp ? "Create account" : "Log in"} <span>→</span></button></form><p className="auth-switch">{isSignUp ? "Already have an account?" : "New to RSSFeed?"} <Link to={isSignUp ? "/login" : "/signup"}>{isSignUp ? "Log in" : "Create an account"}</Link></p><Link className="back-home" to="/">← Back to home</Link></div><aside className="auth-art"><div className="auth-circle large" /><div className="auth-circle small" /><div className="auth-note">Your attention,<br /><strong>in your hands.</strong></div></aside></main>
}
