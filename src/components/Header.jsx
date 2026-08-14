import { Link, useLocation, useNavigate } from 'react-router-dom'
import SearchBox from './SearchBox'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  const goCategories = (e) => {
    e.preventDefault()
    if (location.pathname === '/') {
      document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      navigate('/')
      setTimeout(() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
    }
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">STORMCAP</Link>
        <nav className="nav" aria-label="主导航">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>精选</Link>
          <a href="/#categories" onClick={goCategories}>分类</a>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>关于</Link>
        </nav>
        <SearchBox />
      </div>
    </header>
  )
}
