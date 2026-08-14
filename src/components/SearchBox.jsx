import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBox() {
  const [value, setValue] = useState('')
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    const q = value.trim()
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <form className="search-form" onSubmit={submit} role="search">
      <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        className="search-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="搜索地点 / 现象"
        aria-label="搜索天气摄影"
      />
    </form>
  )
}
