export default function AboutPage() {
  return (
    <div className="container about">
      <h1>关于 STORMCAP</h1>
      <section>
        <h2>这个站点是什么</h2>
        <p>
          STORMCAP 是一本持续更新的天气摄影画廊。它实时聚合开放图库中的天气摄影作品——
          从雷暴与闪电，到彩虹、初雪、晨雾、极光与云海，捕捉天空的瞬息万变。
        </p>
      </section>
      <section>
        <h2>内容来源</h2>
        <p>
          站点通过 Openverse 开放 API 聚合 Flickr、Wikimedia Commons、WordPress 图库中的 CC
          授权图片；当 Openverse 暂不可用时，会自动改为直接检索 Wikimedia Commons，再不行才回退到内置精选。
          每张作品的摄影师、授权信息与原始链接均会保留，点击「查看原图」可跳转至原始页面。
        </p>
      </section>
      <section>
        <h2>降级策略</h2>
        <p>
          图源优先级：Openverse → Wikimedia Commons → 内置精选。当开放图库暂时不可用时，
          站点会自动切换为内置精选作品集，保证画廊始终可以浏览。
          切换时页面会显示「当前为内置精选」提示。
        </p>
      </section>
      <section>
        <h2>版权说明</h2>
        <p>
          所有图片版权归原作者所有，使用遵循各自标注的 CC 授权。站点不主张任何图片的版权，
          仅作为聚合展示与索引。
        </p>
      </section>
    </div>
  )
}
