import { useState } from 'react'

export default function Hero() {
  const [imgOk, setImgOk] = useState(true)

  return (
    <section className="hero">
      {imgOk && (
        <img
          className="hero-img"
          src="/assets/curated/hero.jpg"
          alt="STORMCAP 精选天气摄影"
          onError={() => setImgOk(false)}
        />
      )}
      <div className="container hero-body">
        <p className="hero-kicker">FEATURED · 本期精选</p>
        <h1>
          捕捉天空的
          <br />
          瞬息万变
        </h1>
        <p className="hero-sub">全网天气摄影 · 来自开放图库 · 每日更新</p>
        <a className="hero-cta" href="#gallery">
          进入画廊
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </section>
  )
}
