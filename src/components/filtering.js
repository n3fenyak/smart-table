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
    if (action && action.name === 'clear') {
      const fieldName = action.dataset.field
      // ищем input с нужным name среди всех элементов фильтра
      const input = Object.values(elements).find(
        (el) => el.tagName === 'INPUT' && el.name === fieldName
      )
      if (input) input.value = ''
      if (state[fieldName] !== undefined) state[fieldName] = ''
    }

    const filter = {}
    Object.keys(elements).forEach((key) => {
      if (elements[key]) {
        if (
          ['INPUT', 'SELECT'].includes(elements[key].tagName) &&
          elements[key].value
        ) {
          // ищем поля ввода в фильтре с непустыми данными
          filter[`filter[${elements[key].name}]`] = elements[key].value // чтобы сформировать в query вложенный объект фильтра
        }
      }
    })

    return Object.keys(filter).length ? Object.assign({}, query, filter) : query // если в фильтре что-то добавилось, применим к запросу
  }

  return {
    updateIndexes,
    applyFiltering,
  }
}
