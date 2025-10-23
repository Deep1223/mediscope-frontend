import { NextResponse } from 'next/server'

// GET /api/article/public/filters
export async function GET(request) {
  try {
    // Mock filter options - in a real application, these would come from the database
    const filterOptions = {
      journals: [
        "AyushVeda Ayurveda",
        "AyushVeda Yoga", 
        "AyushVeda Naturopathy",
        "AyushVeda Homeopathy",
        "AyushVeda Unani",
        "AyushVeda Siddha",
        "AyushVeda Global Health"
      ],
      articleTypes: [
        "Original Research",
        "Review Article",
        "Commentary",
        "Case Report",
        "Letter to the Editor",
        "Editorial",
        "Clinical Trial",
        "Meta-Analysis"
      ],
      journalCodes: [
        "Technology",
        "Cardiology",
        "Medicine",
        "Pediatrics",
        "Oncology",
        "Psychiatry",
        "Ayurveda",
        "Yoga",
        "Naturopathy",
        "Homeopathy",
        "Unani",
        "Siddha",
        "Global Health"
      ],
      badgeTypes: [
        "Research",
        "Open Access",
        "Comment",
        "News",
        "Review"
      ]
    }
    
    const response = {
      success: true,
      data: filterOptions
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error fetching filter options:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch filter options',
        message: error.message 
      },
      { status: 500 }
    )
  }
}
