import { NextResponse } from 'next/server'

// POST /api/article/upload
export async function POST(request) {
    try {
        const formData = await request.formData()
        const file = formData.get('image')

        if (!file) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'No image file provided'
                },
                { status: 400 }
            )
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/tiff']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid file type. Only image files (JPG, PNG, GIF, WebP, TIFF) are allowed.'
                },
                { status: 400 }
            )
        }

        // Validate file size (max 3MB)
        const maxSize = 3 * 1024 * 1024 // 3MB
        if (file.size > maxSize) {
            return NextResponse.json(
                {
                    success: false,
                    error: `File too large. Maximum size is 3MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
                },
                { status: 400 }
            )
        }

        // Create a unique filename
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 15)
        const fileExtension = file.name.split('.').pop()
        const fileName = `${timestamp}-${randomStr}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // In a real application, you would upload to your cloud storage service (AWS S3, Cloudinary, etc.)
        // For now, we'll simulate the upload and return a mock URL
        const mockImageUrl = `https://form3150.s3.ap-south-1.amazonaws.com/articles/${fileName}.${fileExtension}`

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        return NextResponse.json({
            success: true,
            message: "Image uploaded successfully",
            imageUrl: mockImageUrl,
            fileName: fileName,
            fileSize: file.size,
            fileType: file.type
        })

    } catch (error) {
        console.error('Error uploading image:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to upload image',
                message: error.message
            },
            { status: 500 }
        )
    }
}
