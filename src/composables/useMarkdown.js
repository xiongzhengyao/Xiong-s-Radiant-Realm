import MarkdownIt from 'markdown-it'
import markdownItTable from 'markdown-it-table'

// 创建 markdown 解析器实例（单例模式）
let mdInstance = null

export function useMarkdown() {
  if (!mdInstance) {
    mdInstance = new MarkdownIt({
      html: true,
      breaks: true,
      linkify: true,
      typographer: true
    }).use(markdownItTable)
  }

  const render = content => {
    if (!content) return ''
    return mdInstance.render(content)
  }

  return {
    render
  }
}
