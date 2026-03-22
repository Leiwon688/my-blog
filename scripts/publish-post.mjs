/**
 * 自动发布博客文章脚本
 * 使用 CloudBase HTTP API 直接操作数据库
 */

// 使用 Node.js 内置 fetch (v18+)

// 环境配置
const ENV_ID = 'leo-4gf1rgdic903e5ea';

// 今天的文章 - 2025年3月22日 AI趋势
const todayPost = {
  id: 'ai-trends-2025-03-22',
  title: '2025年AI热潮：DeepSeek引领中国人工智能新纪元',
  slug: 'ai-trends-2025-deepseek',
  date: '2025-03-22',
  tags: ['AI', 'DeepSeek', '人工智能', '趋势'],
  excerpt: '2025年开年，人工智能成为最热门话题。从DeepSeek的爆火到政务系统的全面接入，AI正深刻改变着我们的生活和工作方式。',
  readTime: 6,
  content: `# 2025年AI热潮：DeepSeek引领中国人工智能新纪元

2025年刚刚过去不到三个月，人工智能已经成为这段时间最热门的话题。从深度求索（DeepSeek）在春节期间的爆火，到各地政务系统的快速接入，AI正以惊人的速度渗透到我们生活的方方面面。

## DeepSeek：国产AI的惊艳亮相

2025年1月20日，国产大模型深度求索（DeepSeek）推出了新一代模型R1，迅速在科技圈引发轰动。

### 三大核心优势

1. **性能卓越**：DeepSeek-R1 性能比肩 OpenAI 的 o1 模型，在多项 benchmark 测试中表现出色
2. **成本低廉**：训练成本远低于同类国际大模型，让中小企业也能用得起顶级AI
3. **全面开源**：采用开源策略，推动国内AI生态的快速发展

### 市场表现

- 登顶苹果美区、中国区应用商店免费榜
- 超越 ChatGPT 成为下载量最高的AI应用
- 引发全球科技界对国产AI的重新审视

## 政务系统全面拥抱AI

DeepSeek 的火爆不仅停留在消费端，各地政府也迅速行动起来。

### 城市接入时间线

| 城市 | 接入时间 | 特色应用 |
|------|----------|----------|
| 广州 | 2025年1月 | 全国首个完成政务领域国产化适配 |
| 深圳 | 2月16日 | 政务云环境全面提供服务 |
| 北京 | 2月下旬 | 智能政务服务平台上线 |
| 南京/苏州/无锡/常州 | 2-3月 | 长三角城市群联动接入 |

### 典型应用场景

- **AI数智员工**（深圳福田区）：公文处理、执法文书生成、招商分析
- **12345热线智能应答**（广东梅州）：智能填单、工单分类转派
- **政策智能解读**：自动解析复杂政策文件，生成通俗易懂的解读材料

## 企业抢滩AI人才

随着AI应用的爆发，相关人才成为招聘市场的"香饽饽"。

### 招聘市场数据

- **最稀缺岗位**：算法工程师（占比67.17%）
- **热门职能**：图像算法、机器视觉、深度学习、机器学习
- **薪资水平**：AI大模型应用研究员月薪最高达4万元（上海地区）

### 企业抢人动态

- **阿里巴巴**：AI To C业务大规模招聘，90%岗位为AI技术、产品研发
- **小米、字节跳动**：频频争夺顶尖AI人才
- **宇树科技**：为AI算法工程师开出月薪最高7万元

## 高校扩招培养AI人才

面对AI人才的巨大缺口，高校纷纷行动起来。

### "双一流"高校扩招计划

- **清华大学**：扩招约150人，成立本科通识书院，聚焦AI与多学科交叉
- **上海交通大学**：扩招150人，重点扩大人工智能、集成电路招生
- **中国农业大学**：扩招500人，聚焦粮食安全、生物智造、人工智能

### 新成立人工智能学院

- **香港中文大学（深圳）**：2月13日成立人工智能学院
- **广西大学、桂林旅游学院、广州理工学院**：相继揭牌成立人工智能学院
- **江苏省**：遴选15所高校建设省级人工智能学院（包括南京大学、东南大学等）

## 各地政策真金白银投入

### 主要城市支持政策

**苏州**
- 对牵头国家AI重大工程主体最高支持1亿元
- 顶尖人才最高1亿元项目资助 + 1000万元购房补贴

**北京**
- 设立1000亿元政府投资基金，支持AI、机器人等未来产业

**深圳**
- 发放"训力券""语料券""模型券"
- 每年最高5亿元降低企业AI应用成本

**广东**
- 对国家级/省级AI创新中心最高支持5000万/1000万
- 每年支持不超过10个标杆案例，每个最高800万元奖励

## 展望未来

2025年的AI热潮只是一个开始。随着技术的不断进步和应用场景的持续拓展，人工智能将在更多领域发挥重要作用：

- **智能制造**：提升生产效率，实现个性化定制
- **智慧医疗**：辅助诊断，加速新药研发
- **自动驾驶**：从实验室走向大规模商用
- **教育变革**：个性化学习，智能辅导

AI时代已经来临，你准备好了吗？

---

*本文撰写于2025年3月22日，数据来源于公开报道整理。*
`
};

// 生成 data.json 文件
async function generateDataJson() {
  const fs = await import('fs/promises');
  const path = await import('path');
  
  const data = {
    profile: {
      siteTitle: "Leo的博客",
      heroName: "你好，我是 Leo 👋",
      heroBio: "记录技术探索与思考，专注于前端开发、系统架构和开发工具。",
      aboutName: "Leo Wang",
      aboutSubtitle: "软件工程师 · 开源爱好者 · 终身学习者",
      aboutParagraphs: ["你好！我是 Leo。"],
      skills: [],
      socialLinks: [],
      email: "",
      footerText: "用代码丈量世界 🌍"
    },
    tags: ['AI', 'DeepSeek', '人工智能', '趋势'],
    posts: [todayPost]
  };
  
  const dataPath = path.join(process.cwd(), 'public', 'my-blog', 'data.json');
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8');
  
  console.log('✅ data.json 已生成到:', dataPath);
  return dataPath;
}

async function main() {
  try {
    console.log('开始发布文章...\n');
    
    // 生成 data.json 文件
    await generateDataJson();
    
    console.log('\n✅ 文章发布成功！');
    console.log('标题:', todayPost.title);
    console.log('日期:', todayPost.date);
    console.log('标签:', todayPost.tags.join(', '));
    console.log('\n注意：此脚本仅生成本地 data.json 文件。');
    console.log('如需同步到 CloudBase 云端，请通过博客后台管理界面操作。');
    console.log('访问: http://localhost:5173/my-blog/');
    
  } catch (error) {
    console.error('发布失败:', error);
    process.exit(1);
  }
}

main();
