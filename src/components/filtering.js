export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      elements[elementName].append(
        ...Object.values(indexes[elementName]).map((name) => {
          const el = document.createElement('option')
          el.textContent = name
          el.value = name
          return el
        })
      )
    })
  }

  const applyFiltering = (query, state, action) => {
    // @todo: обработка очистки поля
    if (action && action.name === 'clear' && action.field) {
      const field = action.field
      // ищем input с нужным name среди всех элементов фильтра
      const input = Object.values(elements).find(
        (el) => ['INPUT', 'SELECT'].includes(el.tagName) && el.name === field
      )
      if (input) input.value = ''
      if (state[field] !== undefined) state[field] = ''
    }

    const filter = {}
    Object.keys(elements).forEach((key) => {
      const el = elements[key]
      if (!el) return

      if (['INPUT', 'SELECT'].includes(el.tagName) && el.value) {
        state[el.name] = el.value // синхронизируем state с элементами
        filter[`filter[${el.name}]`] = el.value
      }
    })

    return Object.keys(filter).length ? { ...query, ...filter } : query
  }

  return {
    updateIndexes,
    applyFiltering,
  }
}
