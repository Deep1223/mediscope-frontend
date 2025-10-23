"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { FileText, Clock, CheckCircle, AlertCircle, Eye, Download, Edit, Trash2, Plus } from "lucide-react"
import { getDashboardResearchData } from "../../lib/research-utils"

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [submissions, setSubmissions] = useState([])

  const [activeTab, setActiveTab] = useState("all")
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      window.location.href = "/login"
    }

    // Load research submissions
    const researchData = getDashboardResearchData()
    setSubmissions(researchData)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const handleDeleteSubmission = (id) => {
    if (confirm("Are you sure you want to delete this submission?")) {
      // Remove from localStorage
      const key = `submit-research-${id}`
      localStorage.removeItem(key)
      
      // Update state
      setSubmissions(submissions.filter((s) => s._id !== id))
    }
  }

  const handleDownloadSubmission = (id) => {
    try {
      const submission = submissions.find(s => s._id === id)
      if (!submission) {
        alert('Submission not found!')
        return
      }

      // Create submission content
      const submissionContent = `
        SUBMISSION DETAILS
        ==================
        
        Title: ${submission.title}
        Journal: ${submission.journal}
        Status: ${submission.status === 1 ? 'Published' : 'Under Review'}
        Submitted Date: ${new Date(submission.recordinfo?.entryTime || submission.date).toLocaleDateString()}
        Last Updated: ${new Date(submission.recordinfo?.updateTime || submission.date).toLocaleDateString()}
        Authors: ${submission.authors?.map(a => a.name).join(", ") || "Unknown"}
        Keywords: ${submission.keywords?.join(", ") || "None"}
        
        This is a demo download. In a real application, this would contain the full submission files.
      `
      
      // Create a blob with the content
      const blob = new Blob([submissionContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      
      // Create download link
      const link = document.createElement('a')
      link.href = url
      link.download = `submission-${id}.txt`
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      alert('Submission downloaded successfully! (Downloaded as text file for demo purposes)')
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      1: { bg: "bg-green-100", text: "text-green-800", label: "Published" },
      0: { bg: "bg-blue-100", text: "text-blue-800", label: "Under Review" },
      "under-review": { bg: "bg-blue-100", text: "text-blue-800", label: "Under Review" },
      accepted: { bg: "bg-green-100", text: "text-green-800", label: "Accepted" },
      "revision-requested": { bg: "bg-yellow-100", text: "text-yellow-800", label: "Revision Requested" },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
      draft: { bg: "bg-gray-100", text: "text-gray-800", label: "Draft" },
    }
    const config = statusConfig[status] || statusConfig.draft
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 1:
      case "accepted":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 0:
      case "under-review":
        return <Clock className="w-5 h-5 text-blue-600" />
      case "revision-requested":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const filteredSubmissions = activeTab === "all" ? submissions : submissions.filter((s) => {
    if (activeTab === "under-review") return s.status === 0
    if (activeTab === "accepted") return s.status === 1
    return s.status === activeTab
  })

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-lancet-gray">
      {/* Header */}
      <div className="bg-white border-b border-lancet-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-lancet-blue">
            THE LANCET
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <button onClick={handleLogout} className="btn btn-lancet-outline text-sm px-4 py-2">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-lancet-dark mb-2">Welcome back, {user.email.split("@")[0]}</h1>
          <p className="text-gray-600">Manage your research submissions and track their progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-lancet-blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Submissions</p>
                <p className="text-3xl font-bold text-lancet-dark mt-2">{submissions.length}</p>
              </div>
              <FileText className="w-12 h-12 text-lancet-blue/20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Under Review</p>
                <p className="text-3xl font-bold text-lancet-dark mt-2">
                  {submissions.filter((s) => s.status === 0).length}
                </p>
              </div>
              <Clock className="w-12 h-12 text-blue-500/20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Published</p>
                <p className="text-3xl font-bold text-lancet-dark mt-2">
                  {submissions.filter((s) => s.status === 1).length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500/20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Revisions Needed</p>
                <p className="text-3xl font-bold text-lancet-dark mt-2">
                  {submissions.filter((s) => s.status === "revision-requested").length}
                </p>
              </div>
              <AlertCircle className="w-12 h-12 text-yellow-500/20" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="font-bold text-lancet-dark mb-4">Quick Actions</h3>
              <Link
                href="/submit-research"
                className="btn btn-lancet w-full mb-3 flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                New Submission
              </Link>
              <Link href="/author-guidelines" className="btn btn-lancet-outline w-full mb-3 text-center">
                Guidelines
              </Link>

              <div className="mt-6 pt-6 border-t border-lancet-border">
                <h4 className="font-medium text-lancet-dark mb-3 text-sm">Filter by Status</h4>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All Submissions" },
                    { value: "under-review", label: "Under Review" },
                    { value: "accepted", label: "Accepted" },
                    { value: "revision-requested", label: "Revision Requested" },
                    { value: "rejected", label: "Rejected" },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setActiveTab(filter.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        activeTab === filter.value
                          ? "bg-lancet-blue text-white font-medium"
                          : "text-gray-700 hover:bg-lancet-gray"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submissions List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {filteredSubmissions.length > 0 ? (
                <div className="divide-y divide-lancet-border">
                  {filteredSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="p-6 hover:bg-lancet-gray/50 transition cursor-pointer"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(submission.status)}
                            <h3 className="text-lg font-bold text-lancet-dark hover:text-lancet-blue transition">
                              {submission.title}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{submission.journal}</p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                            <span>Submitted: {new Date(submission.recordinfo?.entryTime || submission.date).toLocaleDateString()}</span>
                            <span>Updated: {new Date(submission.recordinfo?.updateTime || submission.date).toLocaleDateString()}</span>
                            {submission.authors && (
                              <span className="text-lancet-blue font-medium">
                                {submission.authors.length} author{submission.authors.length !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          {getStatusBadge(submission.status)}
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedSubmission(submission)
                              }}
                              className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600"
                              title="View details"
                            >
                              <Eye size={18} />
                            </button>
                            {submission.status !== 1 && submission.status !== "rejected" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  window.location.href = `/submit-research?edit=${submission._id}`
                                }}
                                className="p-2 hover:bg-yellow-100 rounded-lg transition text-yellow-600"
                                title="Edit submission"
                              >
                                <Edit size={18} />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteSubmission(submission._id)
                              }}
                              className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                              title="Delete submission"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No submissions found</p>
                  <Link href="/submit-research" className="btn btn-lancet inline-block">
                    Submit Your First Research
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submission Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-lancet-border flex justify-between items-start">
              <h2 className="text-2xl font-bold text-lancet-dark">{selectedSubmission.title}</h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">Journal</p>
                <p className="text-lancet-dark">{selectedSubmission.journal}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Status</p>
                {getStatusBadge(selectedSubmission.status)}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Submitted</p>
                  <p className="text-lancet-dark">{new Date(selectedSubmission.recordinfo?.entryTime || selectedSubmission.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Last Updated</p>
                  <p className="text-lancet-dark">{new Date(selectedSubmission.recordinfo?.updateTime || selectedSubmission.date).toLocaleDateString()}</p>
                </div>
              </div>
              {selectedSubmission.authors && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    Authors ({selectedSubmission.authors.length})
                  </p>
                  <p className="text-sm text-blue-800">{selectedSubmission.authors.map(a => a.name).join(", ")}</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-lancet-border flex gap-3">
              <button 
                onClick={() => handleDownloadSubmission(selectedSubmission._id)}
                className="btn btn-lancet flex-1 flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download Submission
              </button>
              <button onClick={() => setSelectedSubmission(null)} className="btn btn-lancet-outline flex-1">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
