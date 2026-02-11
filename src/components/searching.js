export function initSearching(searchField) {
  const applySearching = (query, state, action) => {
    if (state[searchField] && state[searchField].trim() !== '') {
      return Object.assign({}, query, {
        search: state[searchField].trim(),
      })
    }

    return query
  }

  return applySearching
}
