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
    if (action && action.name === 'clear') {
      const field = action.dataset.field
      const container = action.parentElement
      const input = container.querySelector('input, select')

      if (input) {
        input.value = ''
        state[field] = ''
      }
    }

    // @todo: #4.5 — отфильтровать данные, используя компаратор
    const filter = {}

    Object.keys(elements).forEach((key) => {
      if (
        elements[key] &&
        ['INPUT', 'SELECT'].includes(elements[key].tagName) &&
        elements[key].value
      ) {
        filter[`filter[${elements[key].name}]`] = elements[key].value
      }
    })

    return Object.keys(filter).length ? Object.assign({}, query, filter) : query
  }

  return {
    applyFiltering,
    updateIndexes,
  }
}
