import './fonts/ys-display/fonts.css'
import './style.css'

import { data as sourceData } from './data/dataset_1.js'
import { initData } from './data.js'
import { processFormData } from './lib/utils.js'
import { initTable } from './components/table.js'
import { initPagination } from './components/pagination.js'
import { initSorting } from './components/sorting.js'
import { initFiltering } from './components/filtering.js'
import { initSearching } from './components/searching.js'

// API
const api = initData(sourceData)

// Хранилища функций
let applySearching
let applyFiltering
let applySorting
let applyPagination
let updatePagination

let updateIndexes

/**
 * Сбор состояния формы
 */

function collectState() {
  const state = processFormData(new FormData(sampleTable.container))

  const rowsPerPage = parseInt(state.rowsPerPage) || 10
  const page = parseInt(state.page) || 1

  const result = {
    ...state,
    rowsPerPage,
    page,
  }

  // Добавляем total ТОЛЬКО если хотя бы одно поле заполнено
  if (state.totalFrom || state.totalTo) {
    result.total = [state.totalFrom || null, state.totalTo || null]
  }

  return result
}

// function collectState() {
//   const state = processFormData(new FormData(sampleTable.container))

//   const result = {
//     ...state,
//     rowsPerPage: parseInt(state.rowsPerPage),
//     page: parseInt(state.page ?? 1),
//   }

//   // добавляем total только если реально есть значения
//   if (state.totalFrom || state.totalTo) {
//     result.total = [state.totalFrom, state.totalTo]
//   }

//   return result
// }

// function collectState() {
//   const state = processFormData(new FormData(sampleTable.container))

//   return {
//     ...state,
//     // total: [state.totalFrom, state.totalTo],
//     rowsPerPage: parseInt(state.rowsPerPage),
//     page: parseInt(state.page ?? 1),
//   }

//   if (state.totalFrom || state.totalTo) {
//     result.total = [state.totalFrom, state.totalTo]
//   }
//   return result
// }

/**
 * Рендер таблицы
 */
async function render(action) {
  const state = collectState()
  let query = {}

  query = applySearching(query, state, action)
  query = applyFiltering(query, state, action)
  query = applySorting(query, state, action)
  query = applyPagination(query, state, action)

  const { total, items } = await api.getRecords(query)

  updatePagination(total, query)
  sampleTable.render(items)
}

// Таблица
const sampleTable = initTable(
  {
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination'],
  },
  render
)

const appRoot = document.querySelector('#app')
appRoot.appendChild(sampleTable.container)

// Инициализация логики
;({ applyPagination, updatePagination } = initPagination(
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {
    const input = el.querySelector('input')
    const label = el.querySelector('span')

    input.value = page
    input.checked = isCurrent
    label.textContent = page

    return el
  }
))
;({ applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter.elements
))

applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
])

applySearching = initSearching('search')

// Начальная загрузка
async function render(action) {
  const state = collectState()
  let query = {}

  if (applySearching) {
    query = applySearching(query, state, action)
  }

  if (applyFiltering) {
    query = applyFiltering(query, state, action)
  }

  if (applySorting) {
    query = applySorting(query, state, action)
  }

  if (applyPagination) {
    query = applyPagination(query, state, action)
  }

  const { total, items } = await api.getRecords(query)

  if (updatePagination) {
    updatePagination(total, query)
  }

  sampleTable.render(items)
}

// async function init() {
//   const indexes = await api.getIndexes()

//   updateIndexes({
//     searchBySeller: indexes.sellers,
//   })
// }

init().then(render)
