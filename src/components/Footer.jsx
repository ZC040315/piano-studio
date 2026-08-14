import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-left">
          <p className="footer-brand">STORMCAP</p>
          <p className="footer-note">
            聚合开放图库（Openverse · Flickr · Wikimedia）的天气摄影作品。图片版权归原作者所有，使用遵循 CC 授权。
          </p>
        </div>
        <div className="footer-right">
          <Link to="/about" className="footer-link">关于与图源说明</Link>
          <p className="footer-note">© 2026 STORMCAP</p>
        </div>
      </div>
    </footer>
  )
}
