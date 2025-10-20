"use client"

import Link from "next/link"
import { useState } from "react"
import { Search, Menu, X } from "lucide-react"

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const navLinks = [
    { href: "/journals", label: "Journals" },
    // { href: "/for-authors", label: "Publish" },
    // { href: "/clinical", label: "Clinical" },
    // { href: "/global-health", label: "Global Health" },
    // { href: "/research", label: "Research" },
    // { href: "/education", label: "Education" },
    // { href: "/about", label: "About" },
  ]

  return (
    <>
      {/* Modern Top Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">🌍 Global Medical Research Platform</span>
            </div>
            <div className="flex gap-6">
              <Link
                href="/submit-research"
                className="text-sm font-semibold hover:text-emerald-200 transition-colors duration-300 flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-emerald-200 rounded-full"></span>
                Publish Research
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Main Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-6">
            {/* Modern Logo Design */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  MediScope
                </span>
                <span className="text-xs text-gray-500 font-medium">Medical Research Platform</span>
              </div>
            </Link>

            {/* Modern Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2 flex-1 ml-8">
              <nav className="flex gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium px-4 py-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-300 text-gray-700"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Modern Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center gap-3 ml-auto">
              <div className={`relative flex items-center transition-all duration-300 ${searchFocused ? "w-72" : "w-56"}`}>
                <div className="absolute left-4 z-10">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search medical research..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-gray-50 focus:bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
              <Link href="/advanced-search" className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl text-sm font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap">
                Advanced Search
              </Link>
            </form>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden ml-4 p-2 hover:bg-mediscope-gray rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden pb-4 border-t border-mediscope-border">
              <nav className="flex flex-col gap-2 mt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="nav-link-main text-sm font-medium px-3 py-2 rounded hover:bg-mediscope-gray transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mt-4 flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full px-4 py-2 border border-mediscope-border rounded-lg text-sm focus:outline-none focus:border-mediscope-primary focus:ring-2 focus:ring-mediscope-primary/10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="flex gap-2">
                  <button type="submit" className="btn btn-mediscope flex-1 text-sm py-2">
                    Search
                  </button>
                  <Link href="/advanced-search" className="btn btn-mediscope-outline flex-1 text-sm py-2 text-center">
                    Advanced
                  </Link>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
