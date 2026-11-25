import DOMPurify from 'dompurify'
import hljs from 'highlight.js/lib/core'
import php from 'highlight.js/lib/languages/php'
import python from 'highlight.js/lib/languages/python'
import { h } from 'vue'

hljs.registerLanguage('php', php)
hljs.registerLanguage('python', python)

function renderSyntax(node) {
  if (node.nodeType === 3) return node.data

  // The sanitizer allows only spans and classes from the grammar output.
  return h('span', { class: node.className }, Array.from(node.childNodes, renderSyntax))
}

export function highlightCode(source, language) {
  if (!hljs.getLanguage(language)) return source

  try {
    const { value } = hljs.highlight(source, { language, ignoreIllegals: true })
    const fragment = DOMPurify.sanitize(value, {
      ALLOWED_TAGS: ['span'],
      ALLOWED_ATTR: ['class'],
      ALLOW_ARIA_ATTR: false,
      ALLOW_DATA_ATTR: false,
      RETURN_DOM_FRAGMENT: true,
    })

    if (fragment.textContent === source) return Array.from(fragment.childNodes, renderSyntax)
  } catch {
    // A grammar or sanitization failure always leaves the original code readable.
  }

  return source
}
