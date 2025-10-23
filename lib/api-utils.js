// API utility functions for public article endpoints

// Use external API base URL
const API_BASE_URL = 'https://brockersbackend.finnovationz.com'

// Generic API request function
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const config = { ...defaultOptions, ...options }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      console.error('API request failed:', response.status, response.statusText, 'URL:', url)
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API request error:', error, 'URL:', url)
    throw error
  }
}

// Public Article API functions

/**
 * Get published articles with optional query parameters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.sortBy - Sort field (default: 'date')
 * @param {string} params.sortOrder - Sort order: 'asc' or 'desc' (default: 'desc')
 * @param {string} params.title - Filter by title (text search)
 * @param {string} params.journal - Filter by journal
 * @param {string} params.articleType - Filter by article type
 * @param {Array} params.keywords - Filter by keywords (array)
 * @param {string} params.badgeType - Filter by badge type
 * @param {Array} params.date - Date range filter [startDate, endDate]
 * @param {string} params.journalCode - Filter by journal code
 */
export async function getPublishedArticles(params = {}) {
  const queryParams = new URLSearchParams()
  
  // Add pagination
  if (params.page) queryParams.append('page', params.page)
  if (params.limit) queryParams.append('limit', params.limit)
  
  // Add sorting
  if (params.sortBy) queryParams.append('sortBy', params.sortBy)
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)
  
  // Add filters
  if (params.title) queryParams.append('title', params.title)
  if (params.journal) queryParams.append('journal', params.journal)
  if (params.articleType) queryParams.append('articleType', params.articleType)
  if (params.keywords && params.keywords.length > 0) {
    params.keywords.forEach(keyword => queryParams.append('keywords', keyword))
  }
  if (params.badgeType) queryParams.append('badgeType', params.badgeType)
  if (params.date && params.date.length === 2) {
    queryParams.append('startDate', params.date[0])
    queryParams.append('endDate', params.date[1])
  }
  if (params.journalCode) queryParams.append('journalCode', params.journalCode)
  
  const queryString = queryParams.toString()
  const endpoint = `/api/article/public/articles${queryString ? `?${queryString}` : ''}`
  
  return apiRequest(endpoint)
}

/**
 * Get a single published article by ID
 * @param {string} id - Article ID
 */
export async function getPublishedArticle(id) {
  return apiRequest(`/api/article/public/articles/${id}`)
}

/**
 * Search articles with query and filters
 * @param {Object} params - Search parameters
 * @param {string} params.q - Search query
 * @param {string} params.journal - Filter by journal
 * @param {string} params.articleType - Filter by article type
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 */
export async function searchArticles(params = {}) {
  const queryParams = new URLSearchParams()
  
  if (params.q) queryParams.append('q', params.q)
  if (params.journal) queryParams.append('journal', params.journal)
  if (params.articleType) queryParams.append('articleType', params.articleType)
  if (params.page) queryParams.append('page', params.page)
  if (params.limit) queryParams.append('limit', params.limit)
  
  const queryString = queryParams.toString()
  const endpoint = `/api/article/public/search${queryString ? `?${queryString}` : ''}`
  
  return apiRequest(endpoint)
}

/**
 * Get filter options for articles
 */
export async function getFilterOptions() {
  try {
    const response = await fetch('/api/article/public/filters')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching filter options:', error)
    throw error
  }
}

/**
 * Submit research article
 * @param {Object} articleData - Article data to submit
 */
export async function submitResearchArticle(articleData) {
  return apiRequest('/api/article/public/articles', {
    method: 'POST',
    body: JSON.stringify(articleData),
  })
}

// Helper function to build query string from filter object
export function buildQueryString(filters) {
  const params = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => params.append(key, item))
      } else {
        params.append(key, value)
      }
    }
  })
  
  return params.toString()
}

// Helper function to format date for API
export function formatDateForAPI(date) {
  if (!date) return null
  if (typeof date === 'string') return date
  if (date instanceof Date) return date.toISOString().split('T')[0]
  return null
}

// Helper function to format date range for API
export function formatDateRangeForAPI(dateRange) {
  if (!dateRange || !Array.isArray(dateRange) || dateRange.length !== 2) {
    return null
  }
  
  return [
    formatDateForAPI(dateRange[0]),
    formatDateForAPI(dateRange[1])
  ].filter(Boolean)
}
