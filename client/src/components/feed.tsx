import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { createFeed, logout } from "../lib/api"

export default function Feed() {
  const navigate = useNavigate()
  const [isAdding, setIsAdding] = useState(false)
  const [feedName, setFeedName] = useState("")
  const [feedUrl, setFeedUrl] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const name = localStorage.getItem("rssfeed-name")
  const token = localStorage.getItem("rssfeed-token")
  const initials = name?.trim().slice(0, 1).toUpperCase() || "U"

  async function handleLogout() {
    if (token) {
      try { await logout(token) } catch { /* Clear the local session even if the server is unavailable. */ }
    }
    localStorage.removeItem("rssfeed-token")
    localStorage.removeItem("rssfeed-name")
    navigate("/login")
  }

  async function submitFeed(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name || !token) { setError("Please log in to save a new feed."); return }
    if (feedName.trim().length < 2) { setError("Enter a feed name with at least 2 characters."); return }
    try { new URL(feedUrl) } catch { setError("Enter a valid RSS URL."); return }
    setError(""); setIsSubmitting(true)
    try { await createFeed(name, feedName.trim(), feedUrl.trim(), token); setIsAdding(false); setFeedName(""); setFeedUrl("") }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to create the feed.") }
    finally { setIsSubmitting(false) }
  }

  return <main className="feed-page">
    <aside className="feed-sidebar">
      <div className="feed-brand"><Link to={name ? "/feed" : "/"} aria-label={name ? "RSSFeed" : "RSSFeed home"}><span className="feed-rss">◔</span> rssfeed</Link></div>
      <button className="new-feed" type="button" onClick={() => setIsAdding(true)}><span>+</span> Add a feed</button>
      <p className="sidebar-label">YOUR FEEDS</p>
      <div className="feed-list"><button className="selected-feed" type="button"><span className="feed-dot coral" /><span>The Daily Brief</span><small>0</small></button></div>
      <div className="sidebar-bottom">
        {name ? <><p className="signed-in-sidebar"><b>{name}</b><br />You're signed in.</p><button className="logout-button" type="button" onClick={handleLogout}>Log out <span>→</span></button></> : <><p><b>One feed is free.</b><br />Sign up to save feeds across devices.</p><Link to="/signup" className="outline-signup">Create an account</Link></>}
      </div>
    </aside>
    <section className="feed-main">
      <header className="feed-header"><div><p className="feed-kicker">YOUR FEED</p><h1>The Daily Brief</h1></div><div className="account-actions">{name ? <div className="profile-menu"><span className="signed-in-name">Hi, {name}</span><div className="profile-avatar" role="img" aria-label={`${name}'s profile`}>{initials}</div></div> : <><Link to="/login" className="login-link">Log in</Link><Link to="/signup" className="signup-link">Sign up</Link></>}</div></header>
      <div className="empty-feed"><button type="button" className="empty-icon" onClick={() => setIsAdding(true)} aria-label="Add a source"><span>+</span></button><p className="feed-kicker">YOUR READING SPACE</p><h2>Your feed is ready.</h2><p>Add an RSS source to start seeing stories here. You can try one feed without creating an account.</p><button type="button" className="add-source-button" onClick={() => setIsAdding(true)}>Add your first source <span>→</span></button></div>
    </section>
    {isAdding && <div className="modal-backdrop"><form className="feed-modal" onSubmit={submitFeed}><button className="close-modal" type="button" onClick={() => setIsAdding(false)}>×</button><p className="feed-kicker">ADD A SOURCE</p><h2>Make it part of your feed.</h2><label htmlFor="feed-name">Feed name</label><input id="feed-name" value={feedName} onChange={(event) => setFeedName(event.target.value)} placeholder="e.g. The Verge" /><label htmlFor="feed-url">RSS URL</label><input id="feed-url" value={feedUrl} onChange={(event) => setFeedUrl(event.target.value)} placeholder="https://example.com/feed.xml" />{error && <p className="form-error">{error}</p>}<button className="modal-submit" disabled={isSubmitting} type="submit">{isSubmitting ? "Adding..." : "Add feed"} →</button></form></div>}
  </main>
}
