import type {
  QuickLink,
  Bookmark,
} from '../types'

export const quickLinks: QuickLink[] = [
  {
    id: '1',
    title: 'GitHub',
    description: '代码仓库',
    icon: '🐙',
    url: 'https://github.com',
    color: 'from-gray-500/20 to-gray-700/20',
  },
  {
    id: '2',
    title: 'ChatGPT',
    description: 'AI 助手',
    icon: '🤖',
    url: 'https://chat.openai.com',
    color: 'from-emerald-500/20 to-teal-700/20',
  },
  {
    id: '3',
    title: 'Notion',
    description: '知识管理',
    icon: '📝',
    url: 'https://notion.so',
    color: 'from-gray-400/20 to-gray-600/20',
  },
  {
    id: '4',
    title: 'Figma',
    description: '设计工具',
    icon: '🎨',
    url: 'https://figma.com',
    color: 'from-violet-500/20 to-purple-700/20',
  },
  {
    id: '5',
    title: 'Vercel',
    description: '部署平台',
    icon: '▲',
    url: 'https://vercel.com',
    color: 'from-sky-500/20 to-blue-700/20',
  },
  {
    id: '6',
    title: 'Linear',
    description: '项目管理',
    icon: '📋',
    url: 'https://linear.app',
    color: 'from-indigo-500/20 to-violet-700/20',
  },
]

export const bookmarks: Bookmark[] = [
  { id: '1', name: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: '📚', category: '文档' },
  { id: '2', name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '💡', category: '社区' },
  { id: '3', name: 'TypeScript Playground', url: 'https://www.typescriptlang.org/play', icon: '🔷', category: '工具' },
  { id: '4', name: 'Can I Use', url: 'https://caniuse.com', icon: '🔍', category: '工具' },
  { id: '5', name: 'NPM', url: 'https://www.npmjs.com', icon: '📦', category: '包管理' },
  { id: '6', name: 'Tailwind CSS', url: 'https://tailwindcss.com', icon: '🎐', category: '文档' },
]
