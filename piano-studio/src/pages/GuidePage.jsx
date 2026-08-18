import AnimatedDemo from '../components/AnimatedDemo.jsx'

export default function GuidePage() {
  return (
    <main className="page guide-page">
      <h1>学习指南</h1>
      <section className="card">
        <h2>坐姿与手型</h2>
        <AnimatedDemo block={{ type: 'demo', demoKind: 'posture' }} />
      </section>
      <section className="card">
        <h2>简谱速查表</h2>
        <table className="sheet-table">
          <thead><tr><th>数字</th><th>唱名</th><th>本站写法</th><th>时值</th></tr></thead>
          <tbody>
            <tr><td>1 2 3 4 5 6 7</td><td>do re mi fa sol la si</td><td>1–7</td><td>默认 1 拍</td></tr>
            <tr><td>1-</td><td>do（延长）</td><td>1-</td><td>2 拍</td></tr>
            <tr><td>1_</td><td>do（八分）</td><td>1_</td><td>半拍</td></tr>
            <tr><td>0</td><td>休止</td><td>0</td><td>1 拍（不发声）</td></tr>
            <tr><td>1' / 1,</td><td>高音 do / 低音 do</td><td>1' / 1,</td><td>高/低八度</td></tr>
          </tbody>
        </table>
      </section>
      <section className="card">
        <h2>练琴习惯</h2>
        <ul>
          <li>固定时间：每天同一时段练琴更容易坚持。</li>
          <li>先热身：两分钟手指爬梯再练曲子。</li>
          <li>分段练：一句一句来，别整首硬啃。</li>
        </ul>
      </section>
      <section className="card">
        <h2>常见问题</h2>
        <dl>
          <dt>网页没声音？</dt><dd>点击键盘任意键会初始化音频；请检查浏览器音量与系统音量。</dd>
          <dt>没有真钢琴可以学吗？</dt><dd>可以先用本站练习；有条件时推荐电钢琴或钢琴。</dd>
          <dt>多久能学会？</dt><dd>每天 15 分钟，大约 1–2 个月可完成全部 24 课。</dd>
        </dl>
      </section>
    </main>
  )
}
