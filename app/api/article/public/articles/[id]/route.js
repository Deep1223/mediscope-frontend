import { NextResponse } from 'next/server'

// Mock data - same as in the main articles route
const mockArticles = [
  {
    _id: "id_1703123456789_abc123",
    title: "Advanced Research in Ayurvedic Medicine",
    journal: "AyushVeda Ayurveda",
    journalid: 1,
    articletype: "Original Research",
    articletypeid: 1,
    keywords: ["OPEN ACCESS", "RESEARCH", "AYURVEDA"],
    excerpt: "<p>This study explores the efficacy of traditional Ayurvedic treatments in modern healthcare settings.</p>",
    badgetype: "Research",
    badgetypeid: 1,
    date: "2024-01-15",
    journalcode: "Ayurveda",
    journalcodeid: 7,
    status: 1,
    authors: [
      {
        name: "Dr. Rajesh Kumar",
        email: "rajesh@example.com",
        affiliation: "Ayurvedic Research Institute"
      }
    ],
    recordinfo: {
      entryBy: "1760636856216",
      entryTime: "2024-01-15T10:30:00.000Z",
      updateBy: "1760636856216",
      updateTime: "2024-01-15T10:30:00.000Z"
    }
  },
  {
    _id: "id_1703123456790_def456",
    title: "Yoga Therapy for Mental Health",
    journal: "AyushVeda Yoga",
    journalid: 2,
    articletype: "Review Article",
    articletypeid: 2,
    keywords: ["YOGA", "MENTAL HEALTH", "THERAPY"],
    excerpt: "<p>A comprehensive review of yoga-based interventions for mental health conditions.</p>",
    badgetype: "Open Access",
    badgetypeid: 2,
    date: "2024-01-20",
    journalcode: "Yoga",
    journalcodeid: 8,
    status: 1,
    authors: [
      {
        name: "Dr. Priya Sharma",
        email: "priya@example.com",
        affiliation: "Yoga Research Center"
      }
    ],
    recordinfo: {
      entryBy: "1760636856216",
      entryTime: "2024-01-20T14:15:00.000Z",
      updateBy: "1760636856216",
      updateTime: "2024-01-20T14:15:00.000Z"
    }
  },
  {
    _id: "id_1703123456791_ghi789",
    title: "Naturopathic Approaches to Chronic Disease",
    journal: "AyushVeda Naturopathy",
    journalid: 3,
    articletype: "Case Report",
    articletypeid: 4,
    keywords: ["NATUROPATHY", "CHRONIC DISEASE", "HEALING"],
    excerpt: "<p>Case studies demonstrating the effectiveness of naturopathic treatments for chronic conditions.</p>",
    badgetype: "Research",
    badgetypeid: 1,
    date: "2024-01-25",
    journalcode: "Naturopathy",
    journalcodeid: 9,
    status: 1,
    authors: [
      {
        name: "Dr. Michael Chen",
        email: "michael@example.com",
        affiliation: "Naturopathic Medical College"
      }
    ],
    recordinfo: {
      entryBy: "1760636856216",
      entryTime: "2024-01-25T09:45:00.000Z",
      updateBy: "1760636856216",
      updateTime: "2024-01-25T09:45:00.000Z"
    }
  }
]

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
    
    // Find the article by ID
    const article = mockArticles.find(article => article._id === id)
    
    if (!article) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Article not found' 
        },
        { status: 404 }
      )
    }
    
    // Check if article is published (status = 1)
    if (article.status !== 1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Article is not published' 
        },
        { status: 403 }
      )
    }
    
    const response = {
      success: true,
      data: {
        article
      }
    }
    
    return NextResponse.json(response)
    
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
