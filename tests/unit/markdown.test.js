// @vitest-environment jsdom
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import MarkdownContent from '../../src/components/MarkdownContent.vue'

function render(source, props = {}) {
  return mount(MarkdownContent, { props: { source, ...props } })
}

afterEach(() => vi.unstubAllGlobals())

describe('conteúdo Markdown de revisão', () => {
  it('preserva a ordem de parágrafos, bloco de código e código inline', () => {
    const wrapper = render('Antes.\n\n```python\n    print(1)\n```\n\nDepois de `print()`.')
    expect(Array.from(wrapper.element.children, (child) => child.tagName)).toEqual([
      'P',
      'FIGURE',
      'P',
    ])
    expect(wrapper.get('p:last-child code').text()).toBe('print()')
    expect(wrapper.element.textContent).not.toContain('```')
  })

  it.each(['python', 'py'])('realça %s e preserva espaços, operadores e acentos', (language) => {
    const body = 'if valor > 0:\n    print("ação")\n\n    # fim\n'
    const wrapper = render('```' + language + '\n' + body + '```')
    const code = wrapper.get('pre code')
    expect(code.element.textContent).toBe(body)
    expect(code.find('.hljs-keyword').exists()).toBe(true)
    expect(code.find('.hljs-string').exists()).toBe(true)
    expect(wrapper.get('figcaption').text()).toContain('trecho.py')
  })

  it('renderiza operadores, caracteres e a tag PHP apenas quando chegam na fonte', () => {
    const body =
      '<?php\n    $dados = ["ação" => Entidade::montar($a->id < $b->id)];\n\n    // fim\n'
    const wrapper = render('```php\n' + body + '```')
    expect(wrapper.get('pre code').element.textContent).toBe(body)
    expect(wrapper.find('pre .hljs-string').exists()).toBe(true)
    expect(wrapper.find('pre .hljs-comment').exists()).toBe(true)
  })

  it('exibe em texto simples quando a linguagem não está disponível', () => {
    const wrapper = render('```outra\n    % teste <tag>\n```')
    expect(wrapper.get('pre code').element.textContent).toBe('    % teste <tag>\n')
    expect(wrapper.find('pre code span').exists()).toBe(false)
  })

  it('não cria HTML executável nem recursos remotos a partir do Markdown', () => {
    const wrapper = render(
      '<script>alert(1)</script>\n\n' +
        '<img src="https://example.test/a" onerror="alert(1)">\n\n' +
        '[Link bloqueado](javascript:alert%281%29)\n\n' +
        '![Imagem ilustrativa](https://example.test/fixture.png)\n\n' +
        '[Referência](https://example.test/referencia)',
    )

    expect(wrapper.find('script, img, [onerror], a[href^="javascript:"]').exists()).toBe(false)
    expect(wrapper.element.textContent).toContain('<script>alert(1)</script>')
    expect(wrapper.element.textContent).toContain('Imagem ilustrativa')
    expect(wrapper.get('a').attributes('href')).toBe('https://example.test/referencia')
  })
})

describe('cópia do código', () => {
  function mockClipboard(writeText) {
    vi.stubGlobal('navigator', { clipboard: { writeText } })
  }

  it('copia somente o código literal, sem números de linha nem nome de arquivo', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    mockClipboard(writeText)
    const body = 'class Item {\n    // comentário\n}\n'
    const wrapper = render('```php\n' + body + '```', { filename: 'fragmento.php' })
    const gutter = wrapper.get('.code-gutter')
    expect(gutter.attributes('aria-hidden')).toBe('true')
    expect(gutter.findAll('[data-line]')).toHaveLength(3)
    expect(gutter.element.textContent).toBe('')

    await wrapper.get('button').trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledExactlyOnceWith(body)
    expect(wrapper.get('[role="status"]').text()).toBe('Código copiado.')
  })

  it('oferece cópia manual quando o navegador recusa a área de transferência', async () => {
    mockClipboard(vi.fn().mockRejectedValue(new Error('permissão')))
    const wrapper = render('```php\necho 1;\n```')
    await wrapper.get('button').trigger('click')
    await flushPromises()
    expect(wrapper.get('[role="status"]').text()).toContain('Selecione o código')
  })
})
