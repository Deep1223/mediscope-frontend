// Utility functions for research data management

/**
 * Strip HTML tags from text content
 * @param {string} html - HTML string
 * @returns {string} Plain text without HTML tags
 */
export function stripHtmlTags(html) {
  if (!html) return ''
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

/**
 * Get all research submissions from localStorage
 * @returns {Array} Array of research submissions
 */
export function getAllResearchSubmissions() {
  if (typeof window === 'undefined') return []

  try {
    // Get submissions from the new array structure
    const submissionsData = localStorage.getItem('submit-research')
    if (!submissionsData) return []
    
    const submissions = JSON.parse(submissionsData)
    return Array.isArray(submissions) ? submissions : []
  } catch (error) {
    console.error('Error getting research submissions:', error)
    return []
  }
}

/**
 * Sort research items with status 1 at the top, ordered by entry date
 * @param {Array} researchItems - Array of research items
 * @returns {Array} Sorted array with status 1 items first
 */
export function sortResearchByStatusAndDate(researchItems) {
  return researchItems.sort((a, b) => {
    // First, sort by status (1 comes first)
    if (a.status !== b.status) {
      return (b.status || 0) - (a.status || 0)
    }

    // If status is the same, sort by entry date (newest first)
    const dateA = new Date(a.recordinfo?.entryTime || a.date || 0)
    const dateB = new Date(b.recordinfo?.entryTime || b.date || 0)
    return dateB - dateA
  })
}

/**
 * Convert research submission to article format for display
 * @param {Object} submission - Research submission data
 * @returns {Object} Article format data
 */
export function convertSubmissionToArticle(submission) {
  return {
    id: submission._id,
    title: submission.title,
    excerpt: stripHtmlTags(submission.excerpt),
    image: submission.image?.base64 ? `data:${submission.image.type};base64,${submission.image.base64.split(',')[1]}` : "/placeholder.jpg",
    badge: submission.keywords?.[0]?.toUpperCase() || "RESEARCH",
    badgeType: submission.badgeType || "research",
    journal: submission.journal,
    authors: submission.authors?.map(a => a.name).join(", ") || "Unknown Author",
    date: new Date(submission.recordinfo?.entryTime || submission.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    }),
    link: `/article/${submission._id}`,
    type: "research",
    journalCode: submission.journalCode,
    status: submission.status,
    entryTime: submission.recordinfo?.entryTime || submission.date
  }
}

/**
 * Get research data for Latest Research component
 * @returns {Array} Sorted research articles
 */
export function getLatestResearchData() {
  const submissions = getAllResearchSubmissions()
  // Only show submissions with status 1 (approved/published)
  const approvedSubmissions = submissions.filter(submission => submission.status === 1)
  const articles = approvedSubmissions.map(convertSubmissionToArticle)
  return sortResearchByStatusAndDate(articles)
}

/**
 * Get research data for Dashboard
 * @returns {Array} Sorted research submissions
 */
export function getDashboardResearchData() {
  const submissions = getAllResearchSubmissions()
  return sortResearchByStatusAndDate(submissions)
}
