"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Download, FileText, Users, AlertCircle, MessageSquare, CheckCircle } from "lucide-react"

export default function SubmissionDetailPage({ params }) {
  const [submission, setSubmission] = useState({
    id: params.id,
    title: "Novel Immunotherapy Approach for Advanced Melanoma",
    journal: "The Lancet Oncology",
    articleType: "Original Research",
    status: "under-review",
    submittedDate: "2024-01-15",
    lastUpdated: "2024-01-20",
    keywords: ["melanoma", "immunotherapy", "cancer treatment", "clinical trial"],
    authors: [
      {
        name: "Dr. John Smith",
        email: "john@example.com",
        affiliation: "Harvard Medical School",
      },
      { name: "Dr. Jane Doe", email: "jane@example.com", affiliation: "Stanford University" },
    ],
    reviewStatus: "under-review",
    reviewerCount: 2,
    reviewsReceived: 1,
    comments: [
      {
        id: 1,
        reviewer: "Reviewer 1",
        date: "2024-01-18",
        comment: "Excellent study design. Please clarify the statistical methods used in section 3.2.",
        type: "comment",
      },
      {
        id: 2,
        reviewer: "Editor",
        date: "2024-01-20",
        comment: "Awaiting second reviewer feedback. Expected by January 25.",
        type: "status",
      },
    ],
    files: [
      { name: "Manuscript_Final.pdf", size: "2.4 MB", uploadDate: "2024-01-15" },
      { name: "Figures.zip", size: "15.3 MB", uploadDate: "2024-01-15" },
      { name: "Supplementary_Data.xlsx", size: "3.1 MB", uploadDate: "2024-01-15" },
    ],
  })

  const [newComment, setNewComment] = useState("")
  const [showCommentForm, setShowCommentForm] = useState(false)

  const handleDownloadAllFiles = () => {
    try {
      // Create a combined file content
      const allFilesContent = `
        SUBMISSION FILES - ${submission.title}
        ======================================
        
        Submission ID: ${submission.id}
        Journal: ${submission.journal}
        Article Type: ${submission.articleType}
        Status: ${submission.status}
        
        FILES INCLUDED:
        ${submission.files.map((file, index) => `
        ${index + 1}. ${file.name}
            Size: ${file.size}
            Upload Date: ${file.uploadDate}
        `).join('')}
        
        KEYWORDS:
        ${submission.keywords.join(', ')}
        
        AUTHORS:
        ${submission.authors.map(author => `
        - ${author.name}
          Email: ${author.email}
          Affiliation: ${author.affiliation}
        `).join('')}
        
        This is a demo download. In a real application, this would be a ZIP file containing all the actual submission files.
      `
      
      // Create a blob with the content
      const blob = new Blob([allFilesContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      
      // Create download link
      const link = document.createElement('a')
      link.href = url
      link.download = `submission-${submission.id}-all-files.txt`
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      alert('All files downloaded successfully! (Downloaded as text file for demo purposes)')
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    }
  }

  const handleDownloadFile = (fileName) => {
    try {
      // Find the file details
      const file = submission.files.find(f => f.name === fileName)
      
      // Create file content
      const fileContent = `
        FILE: ${fileName}
        ================
        
        Size: ${file ? file.size : 'Unknown'}
        Upload Date: ${file ? file.uploadDate : 'Unknown'}
        Submission ID: ${submission.id}
        
        This is a demo download of the file: ${fileName}
        In a real application, this would contain the actual file content.
      `
      
      // Create a blob with the content
      const blob = new Blob([fileContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      
      // Create download link
      const link = document.createElement('a')
      link.href = url
      link.download = fileName.replace(/\.[^/.]+$/, '') + '.txt' // Replace extension with .txt
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      alert(`File downloaded successfully: ${fileName} (Downloaded as text file for demo purposes)`)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    }
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      setSubmission({
        ...submission,
        comments: [
          ...submission.comments,
          {
            id: submission.comments.length + 1,
            reviewer: "You",
            date: new Date().toISOString().split("T")[0],
            comment: newComment,
            type: "author-comment",
          },
        ],
      })
      setNewComment("")
      setShowCommentForm(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "under-review":
        return "text-blue-600"
      case "accepted":
        return "text-green-600"
      case "revision-requested":
        return "text-yellow-600"
      case "rejected":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusLabel = (status) => {
    const labels = {
      "under-review": "Under Review",
      accepted: "Accepted",
      "revision-requested": "Revision Requested",
      rejected: "Rejected",
    }
    return labels[status] || status
  }

  return (
    <div className="min-h-screen bg-lancet-gray">
      {/* Header */}
      <div className="bg-white border-b border-lancet-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="text-lancet-blue hover:text-lancet-dark transition flex items-center gap-2 mb-4"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-lancet-dark mb-2">{submission.title}</h1>
                  <p className="text-gray-600">{submission.journal}</p>
                </div>
                <span
                  className={`inline-block px-4 py-2 rounded-full font-medium text-sm ${getStatusColor(submission.status)}`}
                >
                  {getStatusLabel(submission.status)}
                </span>
              </div>
            </div>

            {/* Submission Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-lancet-dark mb-4">Submission Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Article Type</p>
                  <p className="text-lancet-dark">{submission.articleType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Submitted Date</p>
                  <p className="text-lancet-dark">{new Date(submission.submittedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Last Updated</p>
                  <p className="text-lancet-dark">{new Date(submission.lastUpdated).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {submission.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="inline-block px-2 py-1 bg-lancet-gray rounded text-sm text-gray-700"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Authors */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-lancet-dark mb-4 flex items-center gap-2">
                <Users size={20} />
                Authors
              </h2>
              <div className="space-y-4">
                {submission.authors.map((author, index) => (
                  <div key={index} className="p-4 bg-lancet-gray rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-lancet-dark">
                          {author.name}
                        </p>
                        <p className="text-sm text-gray-600">{author.affiliation}</p>
                        <p className="text-sm text-gray-600">{author.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Progress */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-lancet-dark mb-4">Review Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Reviewer Feedback</span>
                    <span className="text-sm text-gray-600">
                      {submission.reviewsReceived} of {submission.reviewerCount} received
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-lancet-blue h-2 rounded-full transition-all"
                      style={{ width: `${(submission.reviewsReceived / submission.reviewerCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments and Feedback */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-lancet-dark mb-4 flex items-center gap-2">
                <MessageSquare size={20} />
                Comments & Feedback
              </h2>

              <div className="space-y-4 mb-6">
                {submission.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-4 rounded-lg border ${
                      comment.type === "status"
                        ? "bg-blue-50 border-blue-200"
                        : comment.type === "author-comment"
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{comment.reviewer}</p>
                        <p className="text-xs text-gray-600">{comment.date}</p>
                      </div>
                      {comment.type === "status" && <AlertCircle size={18} className="text-blue-600" />}
                      {comment.type === "author-comment" && <CheckCircle size={18} className="text-green-600" />}
                    </div>
                    <p className="text-gray-700 text-sm">{comment.comment}</p>
                  </div>
                ))}
              </div>

              {!showCommentForm ? (
                <button onClick={() => setShowCommentForm(true)} className="btn btn-lancet-outline px-4 py-2 text-sm">
                  Add Comment
                </button>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add your comment or response..."
                    rows="4"
                    className="w-full px-4 py-2 border border-lancet-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lancet-blue/50"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleAddComment} className="btn btn-lancet px-4 py-2 text-sm">
                      Post Comment
                    </button>
                    <button
                      onClick={() => {
                        setShowCommentForm(false)
                        setNewComment("")
                      }}
                      className="btn btn-lancet-outline px-4 py-2 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Uploaded Files */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-lancet-dark mb-4 flex items-center gap-2">
                <FileText size={20} />
                Uploaded Files
              </h3>
              <div className="space-y-3">
                {submission.files.map((file, index) => (
                  <div
                    key={index}
                    onClick={() => handleDownloadFile(file.name)}
                    className="p-3 bg-lancet-gray rounded-lg hover:bg-gray-200 transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-lancet-dark truncate">{file.name}</p>
                        <p className="text-xs text-gray-600">{file.size}</p>
                        <p className="text-xs text-gray-500">{new Date(file.uploadDate).toLocaleDateString()}</p>
                      </div>
                      <Download size={16} className="text-lancet-blue flex-shrink-0 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-lancet-dark mb-4">Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={handleDownloadAllFiles}
                  className="w-full btn btn-lancet text-sm py-2"
                >
                  Download All Files
                </button>
                <button className="w-full btn btn-lancet-outline text-sm py-2">Request Revision</button>
                <button className="w-full btn btn-lancet-outline text-sm py-2">Withdraw Submission</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
