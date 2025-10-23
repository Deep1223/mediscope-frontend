import { NextResponse } from 'next/server'

// Base URL for the external API
const API_BASE_URL = 'https://brockersbackend.finnovationz.com'

// Function to fetch article from external API
async function fetchArticleFromAPI(id) {
  try {
    const url = `${API_BASE_URL}/api/article/public/articles/${id}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching article from API:', error)
    throw error
  }
}

// GET /api/article/public/articles/[id]
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Article ID is required' 
        },
        { status: 400 }
      )
    }
    
    // Fetch article from external API
    const apiResponse = await fetchArticleFromAPI(id)
    
    if (apiResponse.success && apiResponse.data) {
      // The external API returns article data directly in data field, not data.article
      const article = apiResponse.data
      
      // Check if article is published (status = 1 or "1")
      if (article.status !== 1 && article.status !== "1") {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Article is not published' 
          },
          { status: 403 }
        )
      }
      
      // Transform article to match expected format
      const transformedArticle = {
        _id: article._id,
        title: article.title,
        journal: article.journal,
        journalid: article.journalid,
        articletype: article.articleType || article.articletype,
        articletypeid: article.articletypeid,
        keywords: article.keywords || [],
        excerpt: article.excerpt,
        badgetype: article.badgeType || article.badgetype,
        badgetypeid: article.badgetypeid,
        date: article.date,
        journalcode: article.journalCode || article.journalcode,
        journalcodeid: article.journalcodeid,
        status: 1, // Ensure status is always 1 for published articles
        authors: article.authors || [],
        recordinfo: {
          entryBy: article.createdBy || "system",
          entryTime: article.createdAt || article.date,
          updateBy: article.lastModifiedBy || "system",
          updateTime: article.updatedAt || article.date
        },
        image: article.image
      }
      
      const response = {
        success: true,
        data: {
          article: transformedArticle
        }
      }
      
      return NextResponse.json(response)
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Article not found' 
        },
        { status: 404 }
      )
    }
    
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch article',
        message: error.message 
      },
      { status: 500 }
    )
  }
}
