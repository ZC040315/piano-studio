import { Link } from 'react-router-dom'
import { CATEGORIES, ALL_CATEGORIES } from '../data/categories'

export default function CategoryRail({ active }) {
  const items = [ALL_CATEGORIES, ...CATEGORIES]
  return (
    <div className="container rail" id="categories">
      <div className="rail-list">
        {items.map((c) => (
          <Link
            key={c.slug}
            to={c.slug === 'all' ? '/' : `/category/${c.slug}`}
            className={`chip${active === c.slug ? ' active' : ''}`}
          >
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
