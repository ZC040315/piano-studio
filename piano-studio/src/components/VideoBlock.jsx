export default function VideoBlock({ video }) {
  const src = video?.bvid
    ? `https://player.bilibili.com/player.html?bvid=${video.bvid}&page=1&high_quality=1&danmaku=0`
    : video?.aid
      ? `https://player.bilibili.com/player.html?aid=${video.aid}&page=1&high_quality=1&danmaku=0`
      : null
  if (!src) {
    return (
      <section className="video-block card video-pending">
        <h2>视频教学</h2>
        <p>视频待补充</p>
        <p className="muted">这里会放一节讲解视频，正在挑选合适的免费教程。</p>
      </section>
    )
  }
  return (
    <section className="video-block card">
      <h2>视频教学</h2>
      <div className="video-frame">
        <iframe
          src={src}
          title={video.title}
          loading="lazy"
          allowFullScreen
          scrolling="no"
          frameBorder="0"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <p className="video-title">{video.title}</p>
      <p className="muted">建议先看视频示范，再回到下方跟练键盘练习。</p>
    </section>
  )
}
