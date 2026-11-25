import MarkdownIt from 'markdown-it'
import { h } from 'vue'
import CodeBlock from '../components/CodeBlock.vue'

const markdown = new MarkdownIt({ html: false })
const allowedTags = new Set([
  'a',
  'blockquote',
  'del',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'li',
  'ol',
  'p',
  's',
  'strong',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'tr',
  'ul',
])

export function parseMarkdown(source) {
  return markdown.parse(source, {})
}

function tokenProps(token) {
  if (token.tag === 'a') {
    const href = token.attrGet('href')
    return { href: href && markdown.validateLink(href) ? href : undefined }
  }

  if (token.tag === 'ol' && token.attrGet('start')) return { start: token.attrGet('start') }

  return null
}

export function renderMarkdown(tokens, filename, copyable) {
  const root = { children: [] }
  const stack = [root]

  for (const token of tokens) {
    const { children } = stack.at(-1)

    if (token.nesting === 1) {
      stack.push({ token, children: [] })
      continue
    }

    if (token.nesting === -1) {
      const frame = stack.pop()
      const parent = stack.at(-1).children
      if (frame.token.hidden || !allowedTags.has(frame.token.tag)) {
        parent.push(...frame.children)
      } else {
        parent.push(h(frame.token.tag, tokenProps(frame.token), frame.children))
      }
      continue
    }

    switch (token.type) {
      case 'inline':
        children.push(...renderMarkdown(token.children, filename, copyable))
        break
      case 'fence':
      case 'code_block':
        children.push(
          h(CodeBlock, {
            source: token.content,
            language: token.info.trim().split(/\s+/, 1)[0].toLowerCase(),
            filename,
            copyable,
          }),
        )
        break
      case 'code_inline':
        children.push(h('code', { class: 'inline-code' }, token.content))
        break
      case 'softbreak':
        children.push('\n')
        break
      case 'hardbreak':
        children.push(h('br'))
        break
      case 'hr':
        children.push(h('hr'))
        break
      case 'image':
      case 'text':
        children.push(token.content)
        break
    }
  }

  return root.children
}
