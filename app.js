const navGroups = [
  { title: '流程总览', items: [{ id: 'flow', label: '入口与关键回流', kind: 'new' }] },
  { title: '患者端 · 主流程', items: [
    { id: 'home', label: '首页｜高危筛查入口', kind: 'old' },
    { id: 'choice', label: '选择筛查方式', kind: 'new' },
    { id: 'points', label: '选择免费采血点', kind: 'new' },
    { id: 'form', label: '填写免费采血申请', kind: 'new' },
    { id: 'list', label: '免费采血申请列表', kind: 'new' },
    { id: 'scan', label: '扫码免费采血核销', kind: 'new' },
    { id: 'scan-success', label: '核销成功', kind: 'new' },
    { id: 'detail-verified', label: '申请详情｜已核销，等待报告', kind: 'new' },
    { id: 'upload', label: '上传报告 H5', kind: 'new' },
    { id: 'upload-success', label: '上传成功', kind: 'new' },
    { id: 'detail-reported', label: '申请详情｜已出报告', kind: 'new' },
  ] },
  { title: '未来地区筛选示例', items: [{ id: 'points-empty', label: '地区筛选｜暂无服务', kind: 'new' }] },
  { title: '现有收费链路', items: [{ id: 'paid', label: '收费采血商品详情', kind: 'old' }] },
];

const state = { view: 'flow', selectedPoint: null, attached: false, uploadContext: 'direct', recordScenario: 'none', consents: [true, true, true] };
const $ = (selector) => document.querySelector(selector);
const selectedPointName = () => state.selectedPoint === 2 ? '江宁采血服务点' : '江苏健康服务点';

const phone = (body, options = {}) => `
  <div class="phone"><div class="phone-screen">
    <div class="app-head">
      ${options.back ? `<button data-action="${options.back}">‹</button>` : ''}
      <span>${options.title || '高危筛查'}</span>
      ${options.right ? `<button class="head-right" data-action="${options.right.action}">${options.right.label}</button>` : ''}
    </div>
    ${body}
  </div></div>`;

const listItems = () => `
  <div class="application-card"><div class="application-top"><strong>周芝芝</strong><span class="status-review">审核中</span></div></div>
  <div class="application-card"><div class="application-top"><strong>周颖</strong><span class="status-verified">已通过，立即采血</span></div></div>
  <div class="application-card"><div class="application-top"><strong>张子年</strong><span class="status-verified">已通过，立即采血</span></div></div>
  <div class="application-card"><div class="application-top"><strong>张周舟</strong><span class="status-unapplied">未申请</span></div></div>
  <button class="application-card" data-view="detail-verified"><div class="application-top"><strong>张子乔</strong><span class="status-reported">已核销，等待报告</span></div></button>
  <button class="application-card" data-view="detail-reported"><div class="application-top"><strong>张子明</strong><span class="status-reported">已出报告</span></div></button>`;

const detailBody = (status) => {
  const config = {
    verified: { label: '已核销，等待报告', text: '已完成采血，可上传报告', symbol: '✓', className: '', action: `<div class="app-bottom"><button class="primary wide" data-action="from-detail-upload">去上传报告</button></div>` },
    reported: { label: '已出报告', text: '', symbol: '✓', className: 'reported', action: '' },
  }[status];
  return phone(`<div class="app-content ${config.action ? 'has-bottom' : ''}">
    <article class="detail-card"><div class="detail-status ${config.className}"><div class="status-symbol">${config.symbol}</div><h2>${config.label}</h2>${config.text ? `<p>${config.text}</p>` : ''}</div>
      <section class="detail-section"><h3>患者信息</h3><div class="detail-line"><span>姓名</span><span>张小海</span></div><div class="detail-line"><span>性别</span><span>男</span></div><div class="detail-line"><span>身份证</span><span>320***********986</span></div><div class="detail-line"><span>联系方式</span><span>138****1024</span></div></section>
      <section class="detail-section"><h3>采血信息</h3><div class="detail-line"><span>采血点</span><span>江苏健康服务点</span></div><div class="detail-line"><span>采血时间</span><span>2026-09-28 09:30</span></div></section>
      <section class="detail-section"><h3>申请资料</h3><div class="attachment"><span>▧</span><span>▧</span></div></section>
    </article>${config.action}</div>`, { title: '申请详情', back: 'to-list' });
};

const renderFormPage = () => phone(`<div class="app-content has-bottom"><section class="form-card"><div class="section-title">患者信息</div><div class="field"><span class="required">姓名</span><span class="selected-value">张小海</span></div><div class="field"><span class="required">性别</span><span class="selected-value">男</span></div><div class="field"><span class="required">身份证</span><span class="selected-value">320***********986</span></div></section><section class="form-card"><div class="section-title">采血信息</div><div class="field"><span class="required">采血点</span><span class="selected-value">${selectedPointName()}</span></div><div class="field"><span class="required">采血时间</span><span class="selected-value">2026-09-28 09:30</span></div></section><section class="consent-card">${[
  '《1型糖尿病5项抗体检测知情同意书》',
  '《1型糖尿病高危人群队列的建立知情同意书》',
  '《知情同意书》'
].map((name, index) => `<button class="consent-item ${state.consents[index] ? 'checked' : ''}" data-action="toggle-consent" data-consent="${index}"><i>${state.consents[index] ? '✓' : ''}</i><span>${index === 2 ? '请阅读并确认 ' : '请阅读并同意 '}<b>${name}</b></span></button>`).join('')}</section></div><div class="app-bottom consent-actions"><button class="outline" data-action="to-points">返回</button><button class="primary" data-action="submit-application">提交采血申请</button></div>`, { title: '免费采血申请', back: 'to-points' });

const views = {
  home: {
    kicker: '患者端 · 首页', title: '首页｜高危筛查入口', notes: `<h3>入口规则</h3><p>点击“高危筛查”后，先进入筛查方式选择页。</p>`, render: () => `<div class="phone reference-phone"><div class="phone-screen home-reference"><img src="assets/home-reference.png" alt="糖糖圈首页" /><button class="home-hotspot" data-view="choice" aria-label="进入高危筛查"></button></div></div>`
  },
  flow: {
    kicker: '流程总览', title: '入口判断与关键回流', notes: `<h3>入口规则</h3><ol><li>点击高危筛查后，先选择“免费高危筛查”或“收费高危筛查”。</li><li>选择免费后，按免费记录状态进入对应页面。</li><li>选择收费后，直接进入现有商城商品详情。</li></ol><h3>状态结果</h3><p>报告提交成功后，申请状态更新为“已出报告”。</p>`, render: () => `<div class="flow-board"><p>点击卡片演示入口分流和关键页面回流。</p><div class="flow-grid">
      <button class="flow-card" data-view="choice"><small>入口</small><strong>选择筛查方式</strong><span>先选择免费或收费</span></button>
      <button class="flow-card" data-action="direct-upload"><small>免费分流</small><strong>仅 1 条已核销，等待报告</strong><span>直接进入上传报告 H5</span></button>
      <button class="flow-card" data-view="list"><small>免费分流</small><strong>其他已有记录</strong><span>进入免费采血申请列表</span></button>
      <button class="flow-card" data-view="points"><small>免费分流</small><strong>无免费采血记录</strong><span>直接选择免费采血点</span></button>
      <button class="flow-card" data-view="scan"><small>线下采血</small><strong>扫码免费采血核销</strong><span>完成核销后更新申请状态</span></button>
      <button class="flow-card old" data-view="paid"><small>收费筛查</small><strong>收费采血商品详情</strong><span>直接进入现有商城 H5</span></button>
    </div><p class="flow-tip">上传成功后展示成功反馈页；回流规则见右侧说明。</p></div>`
  },
  choice: { kicker: '患者端 · 高危筛查', title: '选择筛查方式', notes: `<h3>选择规则</h3><p>免费入口进入后，按免费采血记录状态分流；收费入口直接打开现有商城商品详情。</p>`, render: () => `<div class="choice-stage">${phone(`<div class="service-choice"><button class="service-choice-card free" data-action="enter-free"><span>免费高危筛查</span><i>›</i></button><button class="service-choice-card paid" data-view="paid"><span>收费高危筛查</span><i>›</i></button></div>`, { title: '高危筛查', back: 'to-home' })}<aside class="state-console"><strong>免费入口模拟状态</strong><button class="${state.recordScenario === 'none' ? 'active' : ''}" data-action="set-scenario" data-scenario="none">无免费采血记录</button><button class="${state.recordScenario === 'verified' ? 'active' : ''}" data-action="set-scenario" data-scenario="verified">仅 1 条已核销，等待报告</button><button class="${state.recordScenario === 'existing' ? 'active' : ''}" data-action="set-scenario" data-scenario="existing">其他已有免费记录</button></aside></div>` },
  list: { kicker: '患者端 · 免费高危筛查', title: '免费采血申请列表', notes: `<h3>入口</h3><p>选择免费高危筛查后，其他已有免费采血记录时展示申请列表。</p><h3>列表展示</h3><p>每项展示采血者姓名和申请状态，不展示采血点、日期或其他信息。</p><h3>添加申请</h3><p>点击“添加采血申请”进入选择免费采血点。</p>`, render: () => phone(`<div class="app-content has-bottom">${listItems()}</div><div class="app-bottom"><button class="primary wide" data-view="points">添加采血申请</button></div>`, { title: '我的采血申请', back: 'to-choice' }) },
  points: { kicker: '患者端 · 免费高危筛查', title: '选择免费采血点', notes: `<h3>列表规则</h3><p>当前仅展示江苏已开通的免费采血点；采血点与采血时间在申请中保存。</p><h3>收费回流</h3><p>用户点击“没有合适的免费采血点”后，直接进入现有商城商品详情。</p>`, render: () => phone(`<div class="app-content has-bottom"><button class="point-card ${state.selectedPoint === 1 ? 'selected' : ''}" data-action="select-point" data-point="1"><strong>江苏健康服务点</strong><i></i><p>南京市 · 周一至周六 08:30–16:30</p></button><button class="point-card ${state.selectedPoint === 2 ? 'selected' : ''}" data-action="select-point" data-point="2"><strong>江宁采血服务点</strong><i></i><p>南京市 · 周一至周日 09:00–17:00</p></button><button class="go-paid" data-view="paid">没有合适的免费采血点？去收费高危筛查 ›</button></div><div class="app-bottom"><button class="primary wide" data-action="to-form">下一步</button></div>`, { title: '选择采血点', back: 'to-choice' }) },
  'points-empty': { kicker: '未来地区筛选示例', title: '地区筛选｜暂无服务', notes: `<h3>展示规则</h3><p>未来开通多个地区后，用户先筛选地区；若所选地区无免费采血服务，展示当前空态。</p><h3>收费回流</h3><p>主按钮直接进入现有商城商品详情。</p>`, render: () => phone(`<div class="app-content"><label class="region-filter"><span>地区</span><select aria-label="地区筛选"><option selected>浙江省</option><option>安徽省</option><option>上海市</option></select><i>⌄</i></label><div class="empty-card list-card"><div class="empty-icon">⌖</div><h3>您所选地区暂无免费采血服务</h3><button class="primary wide" data-view="paid">去收费高危筛查</button></div></div>`, { title: '选择采血点', back: 'to-points' }) },
  form: { kicker: '患者端 · 免费高危筛查', title: '填写免费采血申请', notes: `<h3>展示规则</h3><p>采血点展示上一步已选点位；不展示上门采血选项。</p><h3>提交结果</h3><p>提交后返回申请列表，新增申请状态为“审核中”。</p><h3>知情同意书</h3><p>提交前需勾选 3 份知情同意书；前两份替换为江苏地区版本，第 3 份复用现有收费链路版本。</p>`, render: renderFormPage },
  'detail-verified': { kicker: '患者端 · 免费高危筛查', title: '申请详情｜已核销，等待报告', notes: `<h3>上传入口</h3><p>从申请列表进入详情后，“已核销，等待报告”记录在底部展示“去上传报告”。</p><h3>扫码核销</h3><p>线下扫码核销后，该记录进入“已核销，等待报告”。</p>`, render: () => detailBody('verified') },
  'detail-reported': { kicker: '患者端 · 免费高危筛查', title: '申请详情｜已出报告', notes: `<h3>展示规则</h3><p>顶部展示“已出报告”，下方展示申请信息与申请资料。不展示报告预览、查看、下载或再次上传入口。</p>`, render: () => detailBody('reported') },
  upload: { kicker: '患者端 · 报告上传 H5', title: '上传报告 H5', notes: `<h3>进入方式</h3><p>仅一条“已核销，等待报告”记录时可从高危筛查入口直达；也可从该详情页底部进入。</p><h3>回流</h3><p>直达进入时，左上角返回选择筛查方式；从详情进入时，返回原详情页。</p>`, render: () => phone(`<div class="upload-wrap"><p class="upload-intro">请上传采血机构提供的报告照片或文件。</p><button class="upload-box ${state.attached ? 'selected' : ''}" data-action="attach"><div><b>${state.attached ? '✓' : '＋'}</b><span>${state.attached ? '已选择 1 个文件' : '选择照片或文件'}</span></div></button><p class="upload-hint">支持图片或文档文件</p></div><div class="app-bottom"><button class="primary wide" data-action="submit-report">提交报告</button></div>`, { title: '上传报告', back: 'exit-upload' }) },
  'upload-success': { kicker: '患者端 · 报告上传 H5', title: '上传成功', notes: `<h3>原型展示</h3><p>保留“3 秒后自动返回”提示文案；原型不做倒计时和自动跳转。</p><h3>回流规则</h3><p>从高危筛查入口直达上传时，自动返回 App 首页；从申请列表的申请详情进入上传时，自动返回对应申请详情页。</p>`, render: () => phone(`<div class="success-page"><div><div class="success-icon">✓</div><h2>报告已提交</h2><p>3 秒后自动返回</p></div></div>`, { title: '上传报告', back: 'success-back' }) },
  paid: { kicker: '患者端 · 现有收费链路', title: '收费采血商品详情', notes: `<h3>跳转</h3><ol><li>选择收费高危筛查，或无合适免费采血点时，直接进入现有商城商品详情。</li><li>左上角返回统一回到app首页。</li></ol>`, render: () => `<div class="phone source-product-phone"><div class="phone-screen"><img src="assets/收费采血商品详情.png" alt="收费采血商品详情" /></div></div>` },
  scan: { kicker: '线下扫码 H5', title: '免费采血核销', notes: `<h3>展示规则</h3><p>展示姓名、手机号、短信验证码；点位二维码带入本次免费采血信息。</p><h3>提交结果</h3><p>提交后完成入组与本次采血核销，关联申请状态更新为“已核销，等待报告”。</p>`, render: () => phone(`<div class="scan-hero"><div class="scan-logo">⌁</div><h2>免费高危筛查</h2><p>江苏健康服务点</p></div><div class="scan-form"><div class="scan-field"><label>姓名</label><input placeholder="请输入姓名" /></div><div class="scan-field"><label>手机号</label><input placeholder="请输入手机号" /></div><div class="scan-field"><label>短信验证码</label><input placeholder="请输入验证码" /><button class="code-button">发送验证码</button></div></div><div class="scan-bottom"><button class="primary wide" data-action="scan-submit">确认核销</button></div>`, { title: '扫码核销', back: 'to-list' }) },
  'scan-success': { kicker: '线下扫码 H5', title: '核销成功', notes: `<h3>状态结果</h3><p>核销完成后，关联免费采血申请进入“已核销，等待报告”，用户后续可上传采血报告。</p>`, render: () => phone(`<div class="success-page"><div><div class="success-icon">✓</div><h2>核销成功</h2><p>已完成本次免费采血核销</p></div></div>`, { title: '扫码核销', back: 'to-scan' }) },
};

function renderNav() {
  $('#page-nav').innerHTML = navGroups.map(group => `<section class="nav-group"><div class="nav-group-title">${group.title}</div>${group.items.map(item => `<button class="nav-item ${item.kind} ${state.view === item.id ? 'active' : ''}" data-view="${item.id}"><span class="nav-indicator"></span>${item.label}</button>`).join('')}</section>`).join('');
}

function render() {
  const view = views[state.view];
  $('#stage-kicker').textContent = view.kicker;
  $('#stage-title').textContent = view.title;
  $('#stage-content').innerHTML = view.render();
  $('#notes-page').textContent = view.title;
  $('#notes-content').innerHTML = view.notes;
  renderNav();
}

function setView(id) { if (views[id]) { state.view = id; render(); } }
function toast(message) { const node = $('#toast'); node.textContent = message; node.classList.add('show'); setTimeout(() => node.classList.remove('show'), 1700); }
document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-view], [data-action]');
  if (!trigger) return;
  if (trigger.dataset.view) return setView(trigger.dataset.view);
  const action = trigger.dataset.action;
  if (action === 'direct-upload') { state.uploadContext = 'direct'; state.attached = false; setView('upload'); }
  if (action === 'set-scenario') { state.recordScenario = trigger.dataset.scenario; render(); }
  if (action === 'enter-free') {
    if (state.recordScenario === 'verified') { state.uploadContext = 'direct'; state.attached = false; setView('upload'); }
    else if (state.recordScenario === 'existing') setView('list');
    else setView('points');
  }
  if (action === 'select-point') { state.selectedPoint = Number(trigger.dataset.point); render(); }
  if (action === 'to-form') { if (!state.selectedPoint) return toast('请先选择采血点'); setView('form'); }
  if (action === 'toggle-consent') { const index = Number(trigger.dataset.consent); state.consents[index] = !state.consents[index]; render(); }
  if (action === 'submit-application') { if (!state.consents.every(Boolean)) return toast('请先阅读并确认全部知情同意书'); toast('申请已提交'); setView('list'); }
  if (action === 'from-detail-upload') { state.uploadContext = 'detail'; state.attached = false; setView('upload'); }
  if (action === 'attach') { state.attached = !state.attached; render(); }
  if (action === 'submit-report') { if (!state.attached) return toast('请先选择报告文件'); setView('upload-success'); }
  if (action === 'exit-upload') setView(state.uploadContext === 'direct' ? 'choice' : 'detail-verified');
  if (action === 'success-back') setView('detail-reported');
  if (action === 'to-list') setView('list');
  if (action === 'to-home') setView('home');
  if (action === 'to-choice') setView('choice');
  if (action === 'to-points') setView('points');
  if (action === 'to-flow') setView('flow');
  if (action === 'to-scan') setView('scan');
  if (action === 'scan-submit') setView('scan-success');
});

render();
