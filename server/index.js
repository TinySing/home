import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// 生产环境：托管前端静态文件
const frontendDist = join(__dirname, '..', 'dist')
app.use(express.static(frontendDist))

// ============ 天气 API (wttr.in 免费接口) ============
app.get('/api/weather', async (req, res) => {
  try {
    const city = req.query.city || 'Shanghai'
    const response = await fetch(
      `https://wttr.in/${encodeURIComponent(city)}?format=j1`,
      { headers: { 'Accept-Language': 'zh-CN' } }
    )
    const data = await response.json()
    const current = data.current_condition?.[0]

    if (!current) {
      return res.status(500).json({ error: '无法获取天气数据' })
    }

    // 中文天气描述映射
    const weatherDesc = current.lang_zh?.[0]?.value || current.weatherDesc?.[0]?.value || '未知'

    res.json({
      city: data.nearest_area?.[0]?.areaName?.[0]?.value || city,
      temp: parseInt(current.temp_C),
      feelsLike: parseInt(current.FeelsLikeC),
      condition: weatherDesc,
      humidity: parseInt(current.humidity),
      wind: parseInt(current.windspeedKmph),
      windDir: current.winddir16Point,
      visibility: parseInt(current.visibility),
      uvIndex: parseInt(current.uvIndex),
    })
  } catch (err) {
    console.error('天气获取失败:', err)
    res.status(500).json({ error: '天气获取失败' })
  }
})

// ============ 一言 API (Hitokoto 免费接口) ============
app.get('/api/hitokoto', async (req, res) => {
  try {
    const response = await fetch('https://v1.hitokoto.cn/')
    const data = await response.json()

    res.json({
      content: data.hitokoto,
      source: data.from,
      author: data.from_who,
      type: data.type,
    })
  } catch (err) {
    console.error('一言获取失败:', err)
    // 返回备用
    res.json({
      content: '世界上最宽阔的是海洋，比海洋更宽阔的是天空，比天空更宽阔的是人的心灵。',
      source: '悲惨世界',
      author: '雨果',
      type: 'literature',
    })
  }
})

// ============ 每日诗词 API ============
const poems = [
  { title: '静夜思', author: '李白', content: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。' },
  { title: '春晓', author: '孟浩然', content: '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。' },
  { title: '登鹳雀楼', author: '王之涣', content: '白日依山尽，黄河入海流。\n欲穷千里目，更上一层楼。' },
  { title: '相思', author: '王维', content: '红豆生南国，春来发几枝。\n愿君多采撷，此物最相思。' },
  { title: '江雪', author: '柳宗元', content: '千山鸟飞绝，万径人踪灭。\n孤舟蓑笠翁，独钓寒江雪。' },
  { title: '望庐山瀑布', author: '李白', content: '日照香炉生紫烟，遥看瀑布挂前川。\n飞流直下三千尺，疑是银河落九天。' },
  { title: '枫桥夜泊', author: '张继', content: '月落乌啼霜满天，江枫渔火对愁眠。\n姑苏城外寒山寺，夜半钟声到客船。' },
  { title: '游子吟', author: '孟郊', content: '慈母手中线，游子身上衣。\n临行密密缝，意恐迟迟归。\n谁言寸草心，报得三春晖。' },
  { title: '送杜少府之任蜀州', author: '王勃', content: '城阙辅三秦，风烟望五津。\n与君离别意，同是宦游人。\n海内存知己，天涯若比邻。\n无为在歧路，儿女共沾巾。' },
  { title: '水调歌头', author: '苏轼', content: '明月几时有？把酒问青天。\n不知天上宫阙，今夕是何年。\n我欲乘风归去，又恐琼楼玉宇，\n高处不胜寒。\n起舞弄清影，何似在人间。' },
  { title: '将进酒', author: '李白', content: '君不见黄河之水天上来，奔流到海不复回。\n君不见高堂明镜悲白发，朝如青丝暮成雪。\n人生得意须尽欢，莫使金樽空对月。\n天生我材必有用，千金散尽还复来。' },
  { title: '念奴娇·赤壁怀古', author: '苏轼', content: '大江东去，浪淘尽，千古风流人物。\n故垒西边，人道是，三国周郎赤壁。\n乱石穿空，惊涛拍岸，卷起千堆雪。\n江山如画，一时多少豪杰。' },
  { title: '满江红', author: '岳飞', content: '怒发冲冠，凭栏处、潇潇雨歇。\n抬望眼、仰天长啸，壮怀激烈。\n三十功名尘与土，八千里路云和月。\n莫等闲、白了少年头，空悲切。' },
  { title: '虞美人', author: '李煜', content: '春花秋月何时了？往事知多少。\n小楼昨夜又东风，故国不堪回首月明中。\n雕栏玉砌应犹在，只是朱颜改。\n问君能有几多愁？恰似一江春水向东流。' },
  { title: '天净沙·秋思', author: '马致远', content: '枯藤老树昏鸦，小桥流水人家，古道西风瘦马。\n夕阳西下，断肠人在天涯。' },
]

app.get('/api/poem', async (req, res) => {
  try {
    // 尝试从今日诗词 API 获取
    const response = await fetch('https://v2.jinrishici.com/one.json', {
      headers: { 'X-User-Token': 'your-token-here' },
    })
    if (response.ok) {
      const data = await response.json()
      if (data.status === 'success' && data.data) {
        const poemData = data.data.origin
        return res.json({
          title: poemData.title,
          author: poemData.author,
          content: poemData.content.join('\n'),
          dynasty: poemData.dynasty,
        })
      }
    }
  } catch {
    // fallback to local
  }

  // 用日期作为种子，每天固定一首
  const today = new Date()
  const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % poems.length
  res.json(poems[dayIndex])
})

// ============ 随机猫咪图片 ============
app.get('/api/cat', async (req, res) => {
  try {
    const response = await fetch('https://api.thecatapi.com/v1/images/search')
    const data = await response.json()
    res.json({ url: data[0]?.url || '' })
  } catch {
    res.json({ url: '' })
  }
})

// ============ 健康检查 ============
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// SPA fallback：非 API 请求都返回 index.html
app.get('*', (req, res) => {
  res.sendFile(join(frontendDist, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`🏠 Home Server 运行在 http://localhost:${PORT}`)
  console.log(`📡 API 端点:`)
  console.log(`   GET /api/weather?city=Shanghai`)
  console.log(`   GET /api/hitokoto`)
  console.log(`   GET /api/poem`)
  console.log(`   GET /api/cat`)
  console.log(`   GET /api/health`)
})
