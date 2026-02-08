import { cloneTemplate } from '../lib/utils.js'

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */

export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before = [], after = [] } = settings

  const root = cloneTemplate(tableTemplate) // Клонируем основной шаблон таблицы

  // @todo: #1.2 — вывести дополнительные шаблоны до и после

  // Шаблоны "до" добавляем в обратном порядке (через prepend)
  before.reverse().forEach((subName) => {
    // перебираем нужный массив идентификаторов
    root[subName] = cloneTemplate(subName) // клонируем и получаем объект, сохраняем в таблице
    root.container.prepend(root[subName].container) // добавляем к таблице после (append) или до (prepend)
  })

  // Шаблоны "после" добавляем в прямом порядке (через append)
  after.forEach((subName) => {
    // перебираем нужный массив идентификаторов
    root[subName] = cloneTemplate(subName) // клонируем и получаем объект, сохраняем в таблице
    root.container.append(root[subName].container) // добавляем к таблице после (append) или до (prepend)
  })

  // @todo: #1.3 — обработать события и вызвать onAction()
  root.container.addEventListener('change', (e) => {
    onAction()
  })

  root.container.addEventListener('reset', (e) => {
    // Даём браузеру время сбросить поля
    setTimeout(() => {
      // Теперь поля гарантированно очищены
      onAction()
    }, 0)
  })

  root.container.addEventListener('submit', (e) => {
    e.preventDefault()
    onAction(e.submitter)
  })

  const render = (data) => {
    // #1.1 — Преобразовать данные в массив строк на основе шаблона rowTemplate
    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate) // Клонируем шаблон строки

      Object.keys(item).forEach((key) => {
        if (row.elements[key]) {
          row.elements[key].textContent = item[key]
        }
      })

      return row.container
    })

    root.elements.rows.replaceChildren(...nextRows)
  }

  return { ...root, render }
}
