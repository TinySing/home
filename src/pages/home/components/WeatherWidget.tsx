import { useState, useEffect } from 'react'
import { HudPanel } from './HudPanel'

const WMO: Record<number, { label: string; icon: string }> = {
  0: { label: '晴', icon: '☀' },
  1: { label: '晴转多云', icon: '☁' },
  2: { label: '多云', icon: '☁' },
  3: { label: '阴', icon: '☁' },
  45: { label: '雾', icon: '≡' },
  48: { label: '冻雾', icon: '≡' },
  51: { label: '毛毛雨', icon: '☂' },
  53: { label: '毛毛雨', icon: '☂' },
  55: { label: '毛毛雨', icon: '☂' },
  61: { label: '小雨', icon: '☂' },
  63: { label: '中雨', icon: '☂' },
  65: { label: '大雨', icon: '☂' },
  71: { label: '小雪', icon: '*' },
  73: { label: '中雪', icon: '*' },
  75: { label: '大雪', icon: '*' },
  80: { label: '阵雨', icon: '☂' },
  81: { label: '阵雨', icon: '☂' },
  82: { label: '强阵雨', icon: '⚡' },
  95: { label: '雷暴', icon: '⚡' },
  96: { label: '雷暴冰雹', icon: '⚡' },
  99: { label: '强雷暴', icon: '⚡' },
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
            '&timezone=Asia%2FShanghai&forecast_days=1',
        )
        if (!res.ok) throw new Error('fetch failed')
        const data = await res.json()
        const cw = data.current_weather
        const hour = new Date().getHours()
        const info = WMO[cw.weathercode] ?? { label: '未知', icon: '·' }

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
      <HudPanel className="p-5 h-full corner-amber animate-pulse">
        <div className="h-4 bg-[#eee8df] rounded w-24 mb-4" />
        <div className="h-8 bg-[#eee8df] rounded w-16" />
      </HudPanel>
    )
  }

  if (error || !weather) {
    return (
      <HudPanel className="p-5 h-full corner-amber">
        <div className="text-center text-[#9aa0a6] text-sm py-4 font-mono">
          WEATHER LINK FAILED
        </div>
      </HudPanel>
    )
  }

  return (
    <HudPanel className="p-5 h-full corner-amber">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="font-display text-2xl text-[#b8894a] leading-none">
            {weather.icon}
          </span>
          <div>
            <div className="font-display text-sm font-semibold text-[#2c3338] tracking-wide">
              北京
            </div>
            <div className="font-mono text-[11px] text-[#9aa0a6]">{weather.condition}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-3xl font-semibold text-[#b8894a]">
            {weather.temp}°
          </div>
          <div className="font-mono text-[10px] text-[#9aa0a6]">
            FEELS {weather.feelsLike}°
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#eee8df]">
        {[
          { label: 'HUM', value: `${weather.humidity}%`, color: 'text-[#3d6b5a]' },
          { label: 'WIND', value: `${weather.windspeed}`, color: 'text-[#5b6b8a]' },
          { label: 'UV', value: `${weather.uvIndex}`, color: 'text-[#b06a6a]' },
        ].map((m) => (
          <div key={m.label} className="text-center">
            <div className="font-mono text-[10px] tracking-wider text-[#9aa0a6] mb-1">
              {m.label}
            </div>
            <div className={`text-sm font-medium ${m.color}`}>{m.value}</div>
          </div>
        ))}
      </div>
    </HudPanel>
  )
}
