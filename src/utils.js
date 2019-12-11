import casex from 'casex'
import categoryData from '@/data/categories.json'
import filtersData from '@/data/filters.json'

// Types:
// type Filters = { [idx: string]: string[] }
// type Label = { id: string, slug: string, name: string }

/** Find labels that match a  prefix and convert to the internal type */
export function getLabels(labels, prefix) {
  return (labels || [])
    .filter(l => l.name.startsWith(prefix))
    .map(l => convertLabel(l, prefix))
}

/** Convert a trello label to an internal one */
export function convertLabel(label, prefix) {
  return {
    id: label.id,
    slug: label.name,
    name: casex(label.name.replace(prefix, ''), 'Ca Se')
  }
}

/** Work out the category of a project based on it's labels and a category.match */
export function projectCategory(project) {
  for (const label of project.labels) {
    for (const category of Object.values(categoryData)) {
      if (category.match.some(match => label.name === match)) {
        return category
      }
    }
  }

  return categoryData._fallback
}

/** Generate a URL for a category image */
export function categoryImage(category) {
  return `${process.env.BASE_URL}categories/${category.image}`
}

/** Create a new array with a value removed if it is present or added if not */
export function toggleArrayValue(array, value) {
  const newArray = [...array]
  const index = array.findIndex(item => item === value)

  if (index === -1) newArray.push(value)
  else newArray.splice(index, 1)

  return newArray
}

export function cloneFilters(filters) {
  const newFilters = { ...filters }
  for (const key in newFilters) newFilters[key] = [...newFilters[key]]
  return newFilters
}

function findFilterData(filterId) {
  return filtersData.find(f => f.id === filterId)
}

function searchProject(project, query) {
  const terms = query.split(/\s+/).map(term => new RegExp(term, 'gi'))

  const matchers = [
    project.name,
    project.desc,
    ...project.labels.map(l => l.name.split(':')).flat()
  ]

  return terms.some(term => term.test(matchers))
}

/**
 * Generate a predicate to filter a project based on a search query and set of filters
 * The logic is "escape early" where the worse-case should be true
 *
 * @param {string} search
 * @param {[idx: string]: string[]} filters
 */
export function makePredicate(search, filters) {
  // const filterLabels = new Set(Object.values(filters).flat())

  return project => {
    if (search.length > 0 && !searchProject(project, search)) return false

    for (const [filterId, labelIds] of Object.entries(filters)) {
      const { logic } = findFilterData(filterId) || {}

      if (!logic || labelIds.length === 0) continue

      // Using AND logic ~ return false if the project doesn't have ALL the labels
      if (logic === 'and') {
        if (labelIds.some(id => !project.idLabels.includes(id))) {
          return false
        }
      }

      // Using OR logic ~ return false if the projects doesn't have ANY of the labels
      if (logic === 'or') {
        if (project.idLabels.every(id => !labelIds.includes(id))) {
          return false
        }
      }
    }

    // If nothing escaped early, this project can be kept
    return true
  }
}
