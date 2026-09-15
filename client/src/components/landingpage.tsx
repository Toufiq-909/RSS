import { Link } from "react-router-dom"

const Arrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>

const RssMark = () => <svg viewBox="0 0 32 32" aria-hidden="true" className="rss-mark"><circle cx="7" cy="25" r="2.5" /><path d="M6 16a10 10 0 0 1 10 10M6 7a19 19 0 0 1 19 19" /></svg>

export default function Home() {
  const feedDestination = localStorage.getItem("rssfeed-token") ? "/feed" : "/signup"
  return <main className="landing-page">
    <nav className="site-nav" aria-label="Main navigation">
      <a className="brand" href="#top"><RssMark /> rssfeed</a>
      <div className="nav-links"><a href="#how-it-works">How it works</a><a href="#why-rssfeed">Why RSS?</a></div>
      <Link className="nav-cta" to={feedDestination}>Get started <Arrow /></Link>
    </nav>

    <section className="hero-section" id="top">
      <div className="hero-copy"><p className="eyebrow"><span /> A calmer way to stay informed</p><h1>Your news,<br /><em>your way.</em></h1><p className="hero-description">Bring every source you care about into one beautifully simple, algorithm-free feed.</p><Link className="primary-button" to={feedDestination}>Build your feed <Arrow /></Link><p className="small-note">Free to start. No credit card needed.</p></div>
      <div className="reader-wrap" aria-label="RSS reader preview"><div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <div className="reader-card"><div className="reader-sidebar"><div className="sidebar-logo"><RssMark /></div><div className="side-active" /><div className="side-line" /><div className="side-line short" /><div className="side-line" /><div className="side-line short" /><div className="side-line bottom" /></div>
          <div className="reader-content"><div className="reader-top"><span>Today</span><div className="top-dot" /></div><div className="reader-title">Your feed <span>12 unread</span></div><article className="feed-item featured"><div className="feed-image image-one" /><div><small>THE ATLANTIC · 8 MIN</small><h3>The habits that make a life feel more spacious</h3><p>Sometimes the best ideas arrive when there is room to notice them.</p></div></article><article className="feed-item"><div className="feed-image image-two" /><div><small>MONOCLE · 5 MIN</small><h3>A better way to begin the day</h3></div></article><article className="feed-item"><div className="feed-image image-three" /><div><small>THE VERGE · 3 MIN</small><h3>Technology worth your attention</h3></div></article></div></div>
        <div className="floating-tag">All your favourites,<br /><strong>one quiet place.</strong></div>
      </div>
    </section>

    <section className="how-section" id="how-it-works"><div className="section-intro"><p className="eyebrow"><span /> Simple by design</p><h2>How it works</h2></div><div className="steps"><div className="step"><p className="step-number">01</p><div className="step-icon">+</div><h3>Add your sources</h3><p>Paste a link or search for the publications, blogs, and creators you trust.</p></div><div className="step"><p className="step-number">02</p><div className="step-icon stack">≡</div><h3>Build your feed</h3><p>Organise everything into a feed that fits the way you want to read.</p></div><div className="step"><p className="step-number">03</p><div className="step-icon book">⌁</div><h3>Read & enjoy</h3><p>Open one calm, focused space whenever you want to catch up.</p></div></div></section>

    <section className="why-section" id="why-rssfeed"><div><p className="eyebrow"><span /> Made for intentional reading</p><h2>Why RSSFeed?</h2></div><div className="reasons"><p><b>No algorithms.</b> Your feed is shaped only by what you choose.</p><p><b>Completely yours.</b> Follow niche blogs, major outlets, or both.</p><p><b>Simply focused.</b> Less noise, more of what matters to you.</p></div></section>
    <section className="final-section" id="get-started"><p className="eyebrow"><span /> Your attention is valuable</p><h2>Your feed.<br /><em>Your rules.</em></h2><Link className="primary-button" to={feedDestination}>Get started for free <Arrow /></Link></section>
    <footer><a className="brand" href="#top"><RssMark /> rssfeed</a><p>© 2026 RSSFeed. Made for better reading.</p><div className="footer-tagline">Read intentionally.</div></footer>
  </main>
}
