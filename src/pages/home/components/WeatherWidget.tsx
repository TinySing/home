import { useState, useEffect } from 'react'

const WMO: Record<number, { label: string; icon: string }> = {
  0: { label: '晴', icon: '☀️' },
  1: { label: '晴转多云', icon: '🌤️' },
  2: { label: '多云', icon: '⛅' },
  3: { label: '阴', icon: '☁️' },
  45: { label: '雾', icon: '🌫️' },
  48: { label: '冻雾', icon: '🌫️' },
  51: { label: '毛毛雨', icon: '🌦️' },
  53: { label: '毛毛雨', icon: '🌦️' },
  55: { label: '毛毛雨', icon: '🌦️' },
  61: { label: '小雨', icon: '🌧️' },
  63: { label: '中雨', icon: '🌧️' },
  65: { label: '大雨', icon: '🌧️' },
  71: { label: '小雪', icon: '🌨️' },
  73: { label: '中雪', icon: '🌨️' },
  75: { label: '大雪', icon: '❄️' },
  80: { label: '阵雨', icon: '🌦️' },
  81: { label: '阵雨', icon: '🌦️' },
  82: { label: '强阵雨', icon: '⛈️' },
  95: { label: '雷暴', icon: '⛈️' },
  96: { label: '雷暴冰雹', icon: '⛈️' },
  99: { label: '强雷暴', icon: '⛈️' },
}

interface WeatherData {
  temp: number
  feelsLike: number
  condition: string
  icon: string
  humidity: number
  windspeed: number
  uvIndex: number
}

/** 天气 - Open-Meteo 免费 API，无需 key */
export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast' +
          '?latitude=39.9042&longitude=116.4074' +
          '&current_weather=true' +
          '&hourly=relativehumidity_2m,apparent_temperature,uv_index' +
          '&timezone=Asia%2FShanghai&forecast_days=1'
        )
        if (!res.ok) throw new Error('fetch failed')
        const data = await res.json()

        const cw = data.current_weather
        const hour = new Date().getHours()
        const info = WMO[cw.weathercode] ?? { label: '未知', icon: '🌤️' }

        setWeather({
          temp: Math.round(cw.temperature),
          feelsLike: Math.round(data.hourly.apparent_temperature?.[hour] ?? cw.temperature),
          condition: info.label,
          icon: info.icon,
          humidity: data.hourly.relativehumidity_2m?.[hour] ?? 0,
          windspeed: Math.round(cw.windspeed),
          uvIndex: Math.round(data.hourly.uv_index?.[hour] ?? 0),
        })
        setError(false)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
  }, [])

  if (loading) {
    return (
      <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-500/10 to-blue-600/10 border border-sky-500/20 animate-pulse">
        <div className="h-6 bg-white/[0.05] rounded w-24 mb-4" />
        <div className="h-8 bg-white/[0.05] rounded w-16" />
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-500/10 to-blue-600/10 border border-sky-500/20">
        <div className="text-center text-white/30 text-sm py-4">天气数据获取失败</div>
      </div>
    )
  }

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-500/10 to-blue-600/10 border border-sky-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none">{weather.icon}</span>
          <div>
            <div className="text-sm font-medium text-white/80">北京</div>
            <div className="text-xs text-white/30">{weather.condition}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">{weather.temp}°</div>
          <div className="text-xs text-white/25">体感 {weather.feelsLike}°</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-sky-500/10">
        <div className="text-center">
          <div className="text-xs text-white/30 mb-1">湿度</div>
          <div className="text-sm font-medium text-white/60">{weather.humidity}%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-white/30 mb-1">风速</div>
          <div className="text-sm font-medium text-white/60">{weather.windspeed} km/h</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-white/30 mb-1">紫外线</div>
          <div className="text-sm font-medium text-white/60">{weather.uvIndex}</div>
        </div>
      </div>
    </div>
  )
}
