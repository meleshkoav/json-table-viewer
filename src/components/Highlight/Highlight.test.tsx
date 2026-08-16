import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Highlight } from './Highlight'

function marksOf(container: HTMLElement): string[] {
  return [...container.querySelectorAll('mark')].map((mark) => mark.textContent ?? '')
}

describe('Highlight', () => {
  it('подсвечивает каждое вхождение запроса', () => {
    const { container } = render(<Highlight text="est et est fugiat" query="est" />)

    expect(marksOf(container)).toEqual(['est', 'est'])
    expect(container.textContent).toBe('est et est fugiat')
  })

  it('ищет без учёта регистра и сохраняет регистр исходного текста', () => {
    const { container } = render(<Highlight text="Reprehenderit Est Deserunt" query="EST" />)

    expect(marksOf(container)).toEqual(['Est'])
    expect(container.textContent).toBe('Reprehenderit Est Deserunt')
  })

  it('не считает вхождения внахлёст', () => {
    const { container } = render(<Highlight text="aaaa" query="aa" />)

    expect(marksOf(container)).toEqual(['aa', 'aa'])
    expect(container.textContent).toBe('aaaa')
  })

  it('на пустом запросе не подсвечивает ничего', () => {
    const { container } = render(<Highlight text="natus nisi omnis" query="" />)

    expect(container.querySelectorAll('mark')).toHaveLength(0)
    expect(container.textContent).toBe('natus nisi omnis')
  })

  it('на запросе без совпадений оставляет текст целым', () => {
    const { container } = render(<Highlight text="natus nisi omnis" query="quo" />)

    expect(container.querySelectorAll('mark')).toHaveLength(0)
    expect(container.textContent).toBe('natus nisi omnis')
  })
})
