import { useState, useEffect } from 'react'

interface WeatherData {
  city: string
  temp: number
  feelsLike: number
  condition: string
  humidity: number
  wind: number
  windDir: string
  visibility: number
  uvIndex: number
}

// 天气图标映射
function getWeatherIcon(condition: string): string {
  const lower = condition.toLowerCase()
  if (lower.includes('晴') || lower.includes('clear') || lower.includes('sunny')) return '☀️'
  if (lower.includes('多云') || lower.includes('cloud')) return '⛅'
  if (lower.includes('阴') || lower.includes('overcast')) return '☁️'
  if (lower.includes('雨') || lower.includes('rain')) return '🌧️'
  if (lower.includes('雪') || lower.includes('snow')) return '🌨️'
  if (lower.includes('雾') || lower.includes('fog') || lower.includes('mist')) return '🌫️'
  if (lower.includes('雷') || lower.includes('thunder')) return '⛈️'
  return '🌤️'
}

/** 天气小部件 - 真实数据 */
export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('/api/weather?city=Shanghai')
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        setWeather(data)
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
        <div className="text-center text-white/30 text-sm">
          天气数据获取失败
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-500/10 to-blue-600/10 border border-sky-500/20">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getWeatherIcon(weather.condition)}</span>
          <div>
            <div className="text-sm font-medium text-white/80">{weather.city}</div>
            <div className="text-xs text-white/30">{weather.condition}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">{weather.temp}°</div>
          <div className="text-xs text-white/25">体感 {weather.feelsLike}°</div>
        </div>
      </div>

      {/* 详情 */}
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-sky-500/10">
        <div className="text-center">
          <div className="text-xs text-white/30 mb-1">湿度</div>
          <div className="text-sm font-medium text-white/60">{weather.humidity}%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-white/30 mb-1">风速</div>
          <div className="text-sm font-medium text-white/60">{weather.wind} km/h</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-white/30 mb-1">紫外线</div>
          <div className="text-sm font-medium text-white/60">{weather.uvIndex}</div>
        </div>
      </div>
    </div>
  )
}
