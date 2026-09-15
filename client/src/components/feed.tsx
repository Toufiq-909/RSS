import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { createFeed, getFeeds, logout } from "../lib/api"

type FeedItem = { title: string; link: string; description: string; published: string; source: string; sourceId: string }
type FeedSource = { id: string; name: string }

function readFeedItems(xml: string, sourceId: string): FeedItem[] {
  const document = new DOMParser().parseFromString(xml, "text/xml")
  if (document.querySelector("parsererror")) throw new Error("This URL did not return a readable RSS feed.")
  const source = document.querySelector("channel > title, feed > title")?.textContent?.trim() || "RSS feed"
  const nodes = Array.from(document.querySelectorAll("item, entry")).slice(0, 20)
  return nodes.map((item) => {
    const value = (selector: string) => item.querySelector(selector)?.textContent?.trim() || ""
    const link = item.querySelector("link")?.getAttribute("href") || value("link")
    return { title: value("title") || "Untitled story", link, description: value("description, summary, content"), published: value("pubDate, published, updated"), source, sourceId }
  })
}

export default function Feed() {
  const navigate = useNavigate()
  const [isAdding, setIsAdding] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [feedName, setFeedName] = useState("")
  const [feedUrl, setFeedUrl] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedSources, setFeedSources] = useState<FeedSource[]>([])
  const [activeFeedId, setActiveFeedId] = useState("")
  const [items, setItems] = useState<FeedItem[]>([])
  const [isLoadingFeeds, setIsLoadingFeeds] = useState(false)
  const [feedError, setFeedError] = useState("")
  const name = localStorage.getItem("rssfeed-name")
  const token = localStorage.getItem("rssfeed-token")
  const initials = name?.trim().slice(0, 1).toUpperCase() || "U"

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSidebarOpen(false)
      }
    }
    if (isSidebarOpen) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isSidebarOpen])

  useEffect(() => {
    if (!successMessage) return
    const timer = setTimeout(() => {
      setSuccessMessage("")
    }, 4500)
    return () => clearTimeout(timer)
  }, [successMessage])

  async function loadSavedFeeds() {
    if (!token) return
    setIsLoadingFeeds(true)
    setFeedError("")
    try {
      const response = await getFeeds(token)
      const xmlFeeds = response.feed || []
      const parsedFeeds = xmlFeeds.flatMap((xml, index) => {
        try { return readFeedItems(xml, `feed-${index}`) } catch { return [] }
      })
      setItems(parsedFeeds)
      const sources = [...new Map(parsedFeeds.map((item) => [item.sourceId, { id: item.sourceId, name: item.source }])).values()]
      setFeedSources(sources)
      setActiveFeedId((current) => sources.some((source) => source.id === current) ? current : sources[0]?.id || "")
      if (xmlFeeds.length > 0 && parsedFeeds.length === 0) setFeedError("Stories could not be read from the saved feed response.")
    } catch (requestError) {
      setFeedError(requestError instanceof Error ? requestError.message : "Unable to load your feeds.")
    } finally { setIsLoadingFeeds(false) }
  }

  useEffect(() => { void loadSavedFeeds() }, [])

  const activeFeed = feedSources.find((source) => source.id === activeFeedId)
  const visibleItems = activeFeedId ? items.filter((item) => item.sourceId === activeFeedId) : []

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
    const trimmedFeedName = feedName.trim()
    if (trimmedFeedName.length < 2) { setError("Enter a feed name with at least 2 characters."); return }
    try { new URL(feedUrl) } catch { setError("Enter a valid RSS URL."); return }
    setError("")
    setIsSubmitting(true)
    try {
      await createFeed(name, trimmedFeedName, feedUrl.trim(), token)
      setIsAdding(false)
      setFeedName("")
      setFeedUrl("")
      setSuccessMessage(`Feed "${trimmedFeedName}" added successfully!`)
      await loadSavedFeeds()
    }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to create the feed.") }
    finally { setIsSubmitting(false) }
  }

  return <main className="feed-page">
    {successMessage && (
      <div className="feed-toast-success" role="status" aria-live="polite">
        <span className="toast-icon">✓</span>
        <span className="toast-text">{successMessage}</span>
        <button
          type="button"
          className="toast-close-btn"
          onClick={() => setSuccessMessage("")}
          aria-label="Dismiss message"
        >
          ×
        </button>
      </div>
    )}
    {isSidebarOpen && (
      <div
        className="sidebar-backdrop"
        onClick={() => setIsSidebarOpen(false)}
        aria-label="Close sidebar overlay"
      />
    )}
    <aside className={`feed-sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="feed-brand">
        <Link to={name ? "/feed" : "/"} aria-label={name ? "RSSFeed" : "RSSFeed home"} onClick={() => setIsSidebarOpen(false)}>
          <span className="feed-rss">◔</span> rssfeed
        </Link>
        <button
          type="button"
          className="close-sidebar-btn"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          ✕
        </button>
      </div>
      <button className="new-feed" type="button" onClick={() => { setIsAdding(true); setIsSidebarOpen(false); }}><span>+</span> Add a feed</button>
      <p className="sidebar-label">YOUR FEEDS</p>
      <div className="feed-list">
        {isLoadingFeeds && feedSources.length === 0 ? (
          <div className="sidebar-skeleton-list">
            <div className="sidebar-skeleton-item" />
            <div className="sidebar-skeleton-item" />
          </div>
        ) : (
          feedSources.map((source) => (
            <button
              className={activeFeedId === source.id ? "selected-feed" : "saved-feed"}
              type="button"
              key={source.id}
              onClick={() => { setActiveFeedId(source.id); setIsSidebarOpen(false); }}
            >
              <span className="feed-dot coral" />
              <span>{source.name}</span>
              <small>{activeFeedId === source.id ? visibleItems.length : ""}</small>
            </button>
          ))
        )}
      </div>
      <div className="sidebar-bottom">
        {name ? (
          <>
            <p className="signed-in-sidebar"><b>{name}</b><br />You're signed in.</p>
            <button className="logout-button" type="button" onClick={() => { void handleLogout(); setIsSidebarOpen(false); }}>
              Log out <span>→</span>
            </button>
          </>
        ) : (
          <>
            <p><b>One feed is free.</b><br />Sign up to save feeds across devices.</p>
            <Link to="/signup" className="outline-signup" onClick={() => setIsSidebarOpen(false)}>
              Create an account
            </Link>
          </>
        )}
      </div>
    </aside>
    <section className="feed-main">
      <header className="feed-header">
        <div className="header-left">
          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open feeds sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div>
            <p className="feed-kicker">YOUR FEED</p>
            <h1>{activeFeed?.name || "The Daily Brief"}</h1>
          </div>
        </div>
        <div className="account-actions">
          {name ? (
            <div className="profile-menu">
              <span className="signed-in-name">Hi, {name}</span>
              <div className="profile-avatar" role="img" aria-label={`${name}'s profile`}>{initials}</div>
            </div>
          ) : (
            <>
              <Link to="/login" className="login-link">Log in</Link>
              <Link to="/signup" className="signup-link">Sign up</Link>
            </>
          )}
        </div>
      </header>

      {isLoadingFeeds ? (
        <div className="feed-loading-container">
          <div className="feed-loading-header">
            <div className="feed-spinner" />
            <span>Fetching stories from your feeds…</span>
          </div>
          <div className="skeleton-stories">
            {[1, 2, 3].map((i) => (
              <div className="skeleton-card" key={i}>
                <div className="skeleton-line skeleton-source" />
                <div className="skeleton-line skeleton-title" />
                <div className="skeleton-line skeleton-title short" />
                <div className="skeleton-line skeleton-desc" />
                <div className="skeleton-line skeleton-desc" />
                <div className="skeleton-line skeleton-link" />
              </div>
            ))}
          </div>
        </div>
      ) : feedError ? (
        <div className="feed-error-container">
          <p className="feed-status">{feedError}</p>
          <button type="button" className="retry-button" onClick={() => void loadSavedFeeds()}>
            Retry fetching feeds
          </button>
        </div>
      ) : feedSources.length ? (
        <div className="feed-stories">
          {visibleItems.length === 0 && <p className="feed-status">No stories found in this feed yet.</p>}
          {visibleItems.map((item, index) => (
            <article className="story-card" key={`${item.link}-${index}`}>
              <p className="story-source">{item.source}{item.published && ` · ${item.published}`}</p>
              <h2>{item.title}</h2>
              {item.description && <p>{item.description}</p>}
              {item.link && <a href={item.link} target="_blank" rel="noreferrer">Read story →</a>}
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-feed">
          <p className="feed-kicker">YOUR READING SPACE</p>
          <h2>Your feed is ready.</h2>
          <p>Add an RSS source to start seeing stories here.</p>
          <button type="button" className="add-source-button" onClick={() => name ? setIsAdding(true) : navigate("/signup")}>
            {name ? "Add your first source" : "Create an account"} <span>→</span>
          </button>
        </div>
      )}
    </section>
    {isAdding && (
      <div className="modal-backdrop">
        <form className="feed-modal" onSubmit={submitFeed}>
          <button className="close-modal" type="button" onClick={() => setIsAdding(false)}>×</button>
          <p className="feed-kicker">ADD A SOURCE</p>
          <h2>Make it part of your feed.</h2>
          <label htmlFor="feed-name">Feed name</label>
          <input id="feed-name" value={feedName} onChange={(event) => setFeedName(event.target.value)} placeholder="e.g. The Verge" />
          <label htmlFor="feed-url">RSS URL</label>
          <input id="feed-url" value={feedUrl} onChange={(event) => setFeedUrl(event.target.value)} placeholder="https://example.com/feed.xml" />
          {error && <p className="form-error">{error}</p>}
          <button className="modal-submit" disabled={isSubmitting} type="submit">{isSubmitting ? "Adding..." : "Add feed"} →</button>
        </form>
      </div>
    )}
  </main>
}
