"use client"

import { useState, useRef, use } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, User, BookOpen, Share2, Download, Heart, MessageCircle, Tag } from "lucide-react"
import html2canvas from 'html2canvas'

export default function ArticlePage({ params }) {
    const resolvedParams = use(params)
    const [isLiked, setIsLiked] = useState(false)
    const [showShare, setShowShare] = useState(false)
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
    const articleRef = useRef(null)

    const handleDownloadPDF = async () => {
        if (isGeneratingPDF) return

        setIsGeneratingPDF(true)

        try {
            if (!articleRef.current) {
                return
            }

            // Create a temporary container for A4 PDF generation
            const tempContainer = document.createElement('div')
            tempContainer.style.position = 'absolute'
            tempContainer.style.left = '-9999px'
            tempContainer.style.top = '0'
            tempContainer.style.width = '794px' // A4 width in pixels (210mm)
            tempContainer.style.backgroundColor = '#ffffff'
            tempContainer.style.padding = '20px'
            tempContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif'
            tempContainer.style.boxSizing = 'border-box'
            tempContainer.style.overflow = 'visible'
            
            // Clone the article content
            const clonedArticle = articleRef.current.cloneNode(true)
            
            // Remove rounded-3xl and shadow-xl classes from cloned article
            const articleElement = clonedArticle.querySelector('article')
            if (articleElement) {
                articleElement.classList.remove('rounded-3xl', 'shadow-xl')
            }

            // Apply comprehensive CSS for proper PDF rendering
            const style = document.createElement('style')
            style.textContent = `
                * {
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    box-sizing: border-box !important;
                }
                
                body, html {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                    height: auto !important;
                }
                
                .lg\\:col-span-3 {
                    width: 100% !important;
                    max-width: none !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    transform: none !important;
                    position: static !important;
                    left: 0 !important;
                    right: 0 !important;
                }
                
                article {
                    width: 100% !important;
                    max-width: none !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                    border: none !important;
                    border-radius: 0 !important;
                    position: static !important;
                }
                
                /* Tailwind CSS Classes - Exact RGB Values */
                .bg-gradient-to-r {
                    background: linear-gradient(to right, #10b981, #14b8a6) !important;
                }
                .from-emerald-500 {
                    background-color: #10b981 !important;
                }
                .to-teal-500 {
                    background-color: #14b8a6 !important;
                }
                .text-emerald-600 {
                    color: #059669 !important;
                }
                .text-teal-600 {
                    color: #0d9488 !important;
                }
                .bg-emerald-50 {
                    background-color: #ecfdf5 !important;
                }
                .bg-teal-50 {
                    background-color: #f0fdfa !important;
                }
                .bg-cyan-50 {
                    background-color: #ecfeff !important;
                }
                .border-emerald-100 {
                    border-color: #d1fae5 !important;
                }
                .border-teal-100 {
                    border-color: #ccfbf1 !important;
                }
                .border-cyan-100 {
                    border-color: #cffafe !important;
                }
                .text-emerald-700 {
                    color: #047857 !important;
                }
                .text-blue-700 {
                    color: #1d4ed8 !important;
                }
                .text-cyan-600 {
                    color: #0891b2 !important;
                }
                .bg-white {
                    background-color: #ffffff !important;
                }
                .text-gray-900 {
                    color: #111827 !important;
                }
                .text-gray-700 {
                    color: #374151 !important;
                }
                .text-gray-600 {
                    color: #4b5563 !important;
                }
                .text-gray-500 {
                    color: #6b7280 !important;
                }
                .text-gray-400 {
                    color: #9ca3af !important;
                }
                .bg-gray-50 {
                    background-color: #f9fafb !important;
                }
                .border-gray-100 {
                    border-color: #f3f4f6 !important;
                }
                .border-gray-200 {
                    border-color: #e5e7eb !important;
                }
                .text-white {
                    color: #ffffff !important;
                }
                .text-white\\/90 {
                    color: rgba(255, 255, 255, 0.9) !important;
                }
                .text-white\\/80 {
                    color: rgba(255, 255, 255, 0.8) !important;
                }
                .bg-white\\/20 {
                    background-color: rgba(255, 255, 255, 0.2) !important;
                }
                .bg-white\\/30 {
                    background-color: rgba(255, 255, 255, 0.3) !important;
                }
                .rounded-3xl {
                    border-radius: 1.5rem !important;
                }
                .rounded-2xl {
                    border-radius: 1rem !important;
                }
                .rounded-xl {
                    border-radius: 0.75rem !important;
                }
                .rounded-lg {
                    border-radius: 0.5rem !important;
                }
                .rounded-full {
                    border-radius: 9999px !important;
                }
                .shadow-xl {
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
                }
                .shadow-lg {
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
                }
                .shadow-md {
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
                }
                .backdrop-blur-sm {
                    backdrop-filter: blur(4px) !important;
                }
                .animate-pulse {
                    animation: none !important;
                }
                .prose {
                    max-width: none !important;
                }
                .prose h2 {
                    font-size: 1.5rem !important;
                    font-weight: 700 !important;
                    margin-top: 2rem !important;
                    margin-bottom: 1rem !important;
                    color: #111827 !important;
                }
                .prose p {
                    margin-bottom: 1rem !important;
                    line-height: 1.7 !important;
                    color: #374151 !important;
                }
                .prose ul {
                    margin-bottom: 1rem !important;
                }
                .prose li {
                    margin-bottom: 0.5rem !important;
                    color: #374151 !important;
                }
                
                /* Layout Fixes */
                .p-12p {
                    padding: 3rem !important;
                }
                .p-8 {
                    padding: 2rem !important;
                }
                .p-6 {
                    padding: 1.5rem !important;
                }
                .p-4 {
                    padding: 1rem !important;
                }
                .mb-8 {
                    margin-bottom: 2rem !important;
                }
                .mb-6 {
                    margin-bottom: 1.5rem !important;
                }
                .mb-4 {
                    margin-bottom: 1rem !important;
                }
                .mt-12 {
                    margin-top: 3rem !important;
                }
                .mt-8 {
                    margin-top: 2rem !important;
                }
                .gap-8 {
                    gap: 2rem !important;
                }
                .gap-6 {
                    gap: 1.5rem !important;
                }
                .gap-4 {
                    gap: 1rem !important;
                }
                .gap-3 {
                    gap: 0.75rem !important;
                }
                .gap-2 {
                    gap: 0.5rem !important;
                }
                .flex {
                    display: flex !important;
                }
                .grid {
                    display: grid !important;
                }
                .grid-cols-1 {
                    grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
                }
                .md\\:grid-cols-3 {
                    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                }
                .space-y-4 > * + * {
                    margin-top: 1rem !important;
                }
                .text-center {
                    text-align: center !important;
                }
                .text-left {
                    text-align: left !important;
                }
                .font-bold {
                    font-weight: 700 !important;
                }
                .font-semibold {
                    font-weight: 600 !important;
                }
                .font-medium {
                    font-weight: 500 !important;
                }
                .text-4xl {
                    font-size: 2.25rem !important;
                    line-height: 2.5rem !important;
                }
                .text-2xl {
                    font-size: 1.5rem !important;
                    line-height: 2rem !important;
                }
                .text-xl {
                    font-size: 1.25rem !important;
                    line-height: 1.75rem !important;
                }
                .text-lg {
                    font-size: 1.125rem !important;
                    line-height: 1.75rem !important;
                }
                .text-sm {
                    font-size: 0.875rem !important;
                    line-height: 1.25rem !important;
                }
                .text-xs {
                    font-size: 0.75rem !important;
                    line-height: 1rem !important;
                }
                .leading-tight {
                    line-height: 1.25 !important;
                }
                .leading-relaxed {
                    line-height: 1.625 !important;
                }
                .w-full {
                    width: 100% !important;
                }
                .h-64 {
                    height: 16rem !important;
                }
                .md\\:h-80 {
                    height: 20rem !important;
                }
                .w-8 {
                    width: 2rem !important;
                }
                .h-8 {
                    height: 2rem !important;
                }
                .w-12 {
                    width: 3rem !important;
                }
                .h-12 {
                    height: 3rem !important;
                }
                .w-3 {
                    width: 0.75rem !important;
                }
                .h-3 {
                    height: 0.75rem !important;
                }
                .object-cover {
                    object-fit: cover !important;
                }
                .flex-wrap {
                    flex-wrap: wrap !important;
                }
                .items-center {
                    align-items: center !important;
                }
                .justify-center {
                    justify-content: center !important;
                }
                .flex-1 {
                    flex: 1 1 0% !important;
                }
                .overflow-hidden {
                    overflow: hidden !important;
                }
                .relative {
                    position: relative !important;
                }
                .absolute {
                    position: absolute !important;
                }
                .inset-0 {
                    top: 0 !important;
                    right: 0 !important;
                    bottom: 0 !important;
                    left: 0 !important;
                }
                .bottom-4 {
                    bottom: 1rem !important;
                }
                .left-4 {
                    left: 1rem !important;
                }
                .mt-2 {
                    margin-top: 0.5rem !important;
                }
                .mt-1 {
                    margin-top: 0.25rem !important;
                }
                .opacity-90 {
                    opacity: 0.9 !important;
                }
                .italic {
                    font-style: italic !important;
                }
                .line-clamp-2 {
                    overflow: hidden !important;
                    display: -webkit-box !important;
                    -webkit-box-orient: vertical !important;
                    -webkit-line-clamp: 2 !important;
                }
            `

            tempContainer.appendChild(style)
            tempContainer.appendChild(clonedArticle)
            document.body.appendChild(tempContainer)

            // Wait for styles to apply
            await new Promise(resolve => setTimeout(resolve, 300))

            // Capture with A4-optimized settings
            const canvas = await html2canvas(tempContainer, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: 794, // A4 width in pixels
                height: tempContainer.scrollHeight,
                scrollX: 0,
                scrollY: 0,
                logging: false,
                imageTimeout: 20000,
                removeContainer: true,
                foreignObjectRendering: true,
                windowWidth: 794,
                windowHeight: 1123, // A4 height
                x: 0,
                y: 0,
            })

            // Clean up
            document.body.removeChild(tempContainer)

            // Create a new window for PDF generation
            const printWindow = window.open('', '_blank')

            // Create PDF content with exact article styling
            const pdfContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Article - ${article.title}</title>
                    <style>
                        @page {
                            size: A4;
                            margin: 10mm;
                        }
                        * {
                            -webkit-print-color-adjust: exact !important;
                            color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            box-sizing: border-box !important;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: system-ui, -apple-system, sans-serif;
                            background: white;
                        }
                        .pdf-container {
                            width: 100%;
                            max-width: 794px;
                            margin: 0 auto;
                            background: white;
                        }
                        .article-content {
                            background: white;
                            border-radius: 0;
                            box-shadow: none;
                            border: none;
                            overflow: visible;
                        }
                        .bg-gradient-to-r {
                            background: linear-gradient(to right, #10b981, #14b8a6) !important;
                        }
                        .from-emerald-500 {
                            background-color: #10b981 !important;
                        }
                        .to-teal-500 {
                            background-color: #14b8a6 !important;
                        }
                        .text-emerald-600 {
                            color: #059669 !important;
                        }
                        .text-teal-600 {
                            color: #0d9488 !important;
                        }
                        .bg-emerald-50 {
                            background-color: #ecfdf5 !important;
                        }
                        .bg-teal-50 {
                            background-color: #f0fdfa !important;
                        }
                        .bg-cyan-50 {
                            background-color: #ecfeff !important;
                        }
                        .border-emerald-100 {
                            border-color: #d1fae5 !important;
                        }
                        .border-teal-100 {
                            border-color: #ccfbf1 !important;
                        }
                        .border-cyan-100 {
                            border-color: #cffafe !important;
                        }
                        .text-emerald-700 {
                            color: #047857 !important;
                        }
                        .text-blue-700 {
                            color: #1d4ed8 !important;
                        }
                        .text-cyan-600 {
                            color: #0891b2 !important;
                        }
                        .bg-white {
                            background-color: #ffffff !important;
                        }
                        .text-gray-900 {
                            color: #111827 !important;
                        }
                        .text-gray-700 {
                            color: #374151 !important;
                        }
                        .text-gray-600 {
                            color: #4b5563 !important;
                        }
                        .text-gray-500 {
                            color: #6b7280 !important;
                        }
                        .text-gray-400 {
                            color: #9ca3af !important;
                        }
                        .bg-gray-50 {
                            background-color: #f9fafb !important;
                        }
                        .border-gray-100 {
                            border-color: #f3f4f6 !important;
                        }
                        .border-gray-200 {
                            border-color: #e5e7eb !important;
                        }
                        .text-white {
                            color: #ffffff !important;
                        }
                        .text-white\\/90 {
                            color: rgba(255, 255, 255, 0.9) !important;
                        }
                        .text-white\\/80 {
                            color: rgba(255, 255, 255, 0.8) !important;
                        }
                        .bg-white\\/20 {
                            background-color: rgba(255, 255, 255, 0.2) !important;
                        }
                        .bg-white\\/30 {
                            background-color: rgba(255, 255, 255, 0.3) !important;
                        }
                        .rounded-3xl {
                            border-radius: 1.5rem !important;
                        }
                        .rounded-2xl {
                            border-radius: 1rem !important;
                        }
                        .rounded-xl {
                            border-radius: 0.75rem !important;
                        }
                        .rounded-lg {
                            border-radius: 0.5rem !important;
                        }
                        .rounded-full {
                            border-radius: 9999px !important;
                        }
                        .shadow-xl {
                            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
                        }
                        .shadow-lg {
                            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
                        }
                        .shadow-md {
                            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
                        }
                        .backdrop-blur-sm {
                            backdrop-filter: blur(4px) !important;
                        }
                        .animate-pulse {
                            animation: none !important;
                        }
                        .prose {
                            max-width: none !important;
                        }
                        .prose h2 {
                            font-size: 1.5rem !important;
                            font-weight: 700 !important;
                            margin-top: 2rem !important;
                            margin-bottom: 1rem !important;
                            color: #111827 !important;
                        }
                        .prose p {
                            margin-bottom: 1rem !important;
                            line-height: 1.7 !important;
                            color: #374151 !important;
                        }
                        .prose ul {
                            margin-bottom: 1rem !important;
                        }
                        .prose li {
                            margin-bottom: 0.5rem !important;
                            color: #374151 !important;
                        }
                        .p-12p { padding: 3rem !important; }
                        .p-8 { padding: 2rem !important; }
                        .p-6 { padding: 1.5rem !important; }
                        .p-4 { padding: 1rem !important; }
                        .mb-8 { margin-bottom: 2rem !important; }
                        .mb-6 { margin-bottom: 1.5rem !important; }
                        .mb-4 { margin-bottom: 1rem !important; }
                        .mt-12 { margin-top: 3rem !important; }
                        .mt-8 { margin-top: 2rem !important; }
                        .gap-8 { gap: 2rem !important; }
                        .gap-6 { gap: 1.5rem !important; }
                        .gap-4 { gap: 1rem !important; }
                        .gap-3 { gap: 0.75rem !important; }
                        .gap-2 { gap: 0.5rem !important; }
                        .flex { display: flex !important; }
                        .grid { display: grid !important; }
                        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
                        .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
                        .space-y-4 > * + * { margin-top: 1rem !important; }
                        .text-center { text-align: center !important; }
                        .text-left { text-align: left !important; }
                        .font-bold { font-weight: 700 !important; }
                        .font-semibold { font-weight: 600 !important; }
                        .font-medium { font-weight: 500 !important; }
                        .text-4xl { font-size: 2.25rem !important; line-height: 2.5rem !important; }
                        .text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
                        .text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
                        .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
                        .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
                        .text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
                        .leading-tight { line-height: 1.25 !important; }
                        .leading-relaxed { line-height: 1.625 !important; }
                        .w-full { width: 100% !important; }
                        .h-64 { height: 16rem !important; }
                        .md\\:h-80 { height: 20rem !important; }
                        .w-8 { width: 2rem !important; }
                        .h-8 { height: 2rem !important; }
                        .w-12 { width: 3rem !important; }
                        .h-12 { height: 3rem !important; }
                        .w-3 { width: 0.75rem !important; }
                        .h-3 { height: 0.75rem !important; }
                        .object-cover { object-fit: cover !important; }
                        .flex-wrap { flex-wrap: wrap !important; }
                        .items-center { align-items: center !important; }
                        .justify-center { justify-content: center !important; }
                        .flex-1 { flex: 1 1 0% !important; }
                        .overflow-hidden { overflow: hidden !important; }
                        .relative { position: relative !important; }
                        .absolute { position: absolute !important; }
                        .inset-0 { top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important; }
                        .bottom-4 { bottom: 1rem !important; }
                        .left-4 { left: 1rem !important; }
                        .mt-2 { margin-top: 0.5rem !important; }
                        .mt-1 { margin-top: 0.25rem !important; }
                        .opacity-90 { opacity: 0.9 !important; }
                        .italic { font-style: italic !important; }
                        .line-clamp-2 { overflow: hidden !important; display: -webkit-box !important; -webkit-box-orient: vertical !important; -webkit-line-clamp: 2 !important; }
                    </style>
                </head>
                <body>
                    <div class="pdf-container">
                        <div class="article-content">
                            ${tempContainer.innerHTML}
                        </div>
                    </div>
                    <script>
                        window.onload = function() {
                            setTimeout(function() {
                                window.print();
                            }, 1000);
                        };
                    </script>
                </body>
                </html>
            `

            // Write content to new window
            printWindow.document.write(pdfContent)
            printWindow.document.close()

        } catch (error) {
            console.error('PDF generation failed:', error)
        } finally {
            setIsGeneratingPDF(false)
        }
    }

    // Mock article data - in real app, this would come from API
    const article = {
        id: resolvedParams.id,
        title: "Revolutionary AI-Driven Diagnostic Tools in Modern Medicine",
        subtitle: "How artificial intelligence is transforming patient care and clinical decision-making",
        image: "/ai-healthcare.png",
        imageAlt: "AI-Driven Diagnostic Tools in Modern Medicine",
        imageCaption: "Artificial intelligence is revolutionizing medical diagnosis and patient care",
        content: `
      <p>Artificial intelligence (AI) is revolutionizing the field of medicine, offering unprecedented opportunities to enhance diagnostic accuracy, improve patient outcomes, and streamline clinical workflows. This comprehensive study examines the latest developments in AI-driven diagnostic tools and their transformative impact on modern healthcare.</p>
      
      <h2>Introduction</h2>
      <p>The integration of artificial intelligence into medical practice represents one of the most significant technological advances in healthcare history. From machine learning algorithms that can detect cancer in medical images to natural language processing systems that analyze patient records, AI is fundamentally changing how we approach medical diagnosis and treatment.</p>
      
      <h2>Methodology</h2>
      <p>Our research team conducted a comprehensive analysis of AI diagnostic tools across multiple medical specialties. We examined over 500 peer-reviewed studies, analyzed data from 50+ healthcare institutions, and interviewed leading experts in the field of medical AI.</p>
      
      <h2>Key Findings</h2>
      <p>The study reveals several groundbreaking insights:</p>
      <ul>
        <li>AI diagnostic tools show 95% accuracy in early cancer detection</li>
        <li>Reduction in diagnostic time by an average of 40%</li>
        <li>Significant improvement in patient outcomes across multiple specialties</li>
        <li>Enhanced efficiency in radiology and pathology departments</li>
      </ul>
      
      <h2>Clinical Applications</h2>
      <p>AI diagnostic tools are being successfully implemented across various medical specialties, including radiology, pathology, cardiology, and dermatology. These tools not only improve diagnostic accuracy but also help healthcare providers make more informed treatment decisions.</p>
      
      <h2>Future Implications</h2>
      <p>As AI technology continues to evolve, we can expect even more sophisticated diagnostic tools that will further enhance medical practice. The integration of AI into routine clinical workflows promises to improve patient care while reducing healthcare costs.</p>
    `,
        authors: [
            { name: "Dr. Sarah Chen", affiliation: "Stanford Medical School", email: "s.chen@stanford.edu" },
            { name: "Prof. Michael Rodriguez", affiliation: "Harvard Medical School", email: "m.rodriguez@harvard.edu" },
            { name: "Dr. Emily Watson", affiliation: "Mayo Clinic", email: "e.watson@mayo.edu" }
        ],
        journal: "MediScope Technology",
        date: "January 15, 2025",
        doi: "10.1000/mediscope.2025.001",
        keywords: ["Artificial Intelligence", "Medical Diagnosis", "Machine Learning", "Healthcare Technology", "Clinical Decision Support"],
        abstract: "This study examines the revolutionary impact of AI-driven diagnostic tools in modern medicine, analyzing their effectiveness, clinical applications, and future potential in transforming healthcare delivery.",
        citations: 42,
        views: 1250,
        downloads: 380
    }

    const relatedArticles = [
        {
            id: 2,
            title: "Precision Medicine Approaches in Cardiovascular Disease Management",
            excerpt: "Tailored therapeutic strategies improve outcomes in cardiovascular care",
            image: "/cardiometabolic-health.jpg",
            journal: "MediScope Cardiology",
            date: "Jan 2025"
        },
        {
            id: 3,
            title: "Digital Mental Health Interventions: Comparative Effectiveness",
            excerpt: "Technology-enhanced psychological treatments show promising results",
            image: "/mental-health-digital.jpg",
            journal: "MediScope Psychiatry",
            date: "Jan 2025"
        },
        {
            id: 4,
            title: "Antimicrobial Stewardship in the Digital Age",
            excerpt: "Technology-driven approaches to combat antimicrobial resistance",
            image: "/antibiotic-research.jpg",
            journal: "MediScope Medicine",
            date: "Jan 2025"
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/30">
            {/* PDF Generation Overlay */}
            {isGeneratingPDF && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-sm mx-4">
                        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <h3 className="text-xl font-semibold text-gray-900">Generating PDF...</h3>
                        <p className="text-sm text-gray-600 text-center">Please wait while we prepare your document</p>
                    </div>
                </div>
            )}
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-100">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-3 text-emerald-600 hover:text-emerald-700 transition-colors duration-300"
                        >
                            <ArrowLeft size={20} />
                            <span className="font-medium">Back to Home</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className={`p-2 rounded-full transition-all duration-300 ${isLiked
                                    ? "bg-red-100 text-red-500"
                                    : "bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500"
                                    }`}
                            >
                                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                            </button>

                            <button
                                onClick={() => setShowShare(!showShare)}
                                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-emerald-100 hover:text-emerald-600 transition-all duration-300"
                            >
                                <Share2 size={20} />
                            </button>

                            <button
                                onClick={handleDownloadPDF}
                                disabled={isGeneratingPDF}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download size={16} />
                                {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div ref={articleRef} className="lg:col-span-3">
                        <article className={`bg-white ${isGeneratingPDF ? '' : 'rounded-3xl shadow-xl'} border border-gray-100 overflow-hidden`}>

                            {/* Article Header */}
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 text-white p-12p">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                                        Research Article
                                    </span>
                                </div>

                                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                                    {article.title}
                                </h1>

                                <p className="text-xl text-white/90 leading-relaxed mb-6">
                                    {article.subtitle}
                                </p>

                                {/* Article Meta */}
                                <div className="flex flex-wrap gap-6 text-white/80">
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={18} />
                                        <span className="font-medium">{article.journal}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={18} />
                                        <span>{article.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageCircle size={18} />
                                        <span>{article.citations} Citations</span>
                                    </div>
                                </div>
                            </div>

                            {/* Article Content */}
                            <div className="p-12p">
                                {/* Abstract */}
                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 mb-8 border border-emerald-100">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">A</span>
                                        </div>
                                        Abstract
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed text-lg">
                                        {article.abstract}
                                    </p>
                                </div>

                                {/* Article Image */}
                                <div className="mb-8">
                                    <div className="relative overflow-hidden rounded-2xl shadow-lg">
                                        <img
                                            src={article.image}
                                            alt={article.imageAlt}
                                            className="w-full h-64 md:h-80 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <p className="text-sm font-medium opacity-90">AI Technology in Healthcare</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2 text-center italic">
                                        {article.imageCaption}
                                    </p>
                                </div>

                                {/* Keywords */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Tag size={20} className="text-emerald-600" />
                                        Keywords
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {article.keywords.map((keyword, index) => (
                                            <span
                                                key={index}
                                                className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium border border-emerald-200"
                                            >
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div
                                    className="prose prose-lg max-w-none"
                                    dangerouslySetInnerHTML={{ __html: article.content }}
                                />

                                {/* Authors */}
                                <div className="mt-12 bg-gray-50 rounded-2xl p-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                                            <User className="text-white" size={20} />
                                        </div>
                                        Authors
                                    </h3>
                                    <div className="space-y-4">
                                        {article.authors.map((author, index) => (
                                            <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
                                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg">
                                                        {author.name.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{author.name}</h4>
                                                    <p className="text-gray-600">{author.affiliation}</p>
                                                    <p className="text-emerald-600 text-sm">{author.email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Article Stats */}
                                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
                                        <div className="text-2xl font-bold text-emerald-600">{article.views}</div>
                                        <div className="text-sm text-gray-600">Views</div>
                                    </div>
                                    <div className="bg-teal-50 rounded-xl p-4 text-center border border-teal-100">
                                        <div className="text-2xl font-bold text-teal-600">{article.downloads}</div>
                                        <div className="text-sm text-gray-600">Downloads</div>
                                    </div>
                                    <div className="bg-cyan-50 rounded-xl p-4 text-center border border-cyan-100">
                                        <div className="text-2xl font-bold text-cyan-600">{article.citations}</div>
                                        <div className="text-sm text-gray-600">Citations</div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* DOI */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                <h3 className="font-semibold text-gray-900 mb-3">DOI</h3>
                                <p className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded-lg">
                                    {article.doi}
                                </p>
                            </div>

                            {/* Related Articles */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Related Articles</h3>
                                <div className="space-y-4">
                                    {relatedArticles.map((related) => (
                                        <Link
                                            key={related.id}
                                            href={`/article/${related.id}`}
                                            className="block group"
                                        >
                                            <div className="p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300">
                                                <div className="flex gap-3">
                                                    <img
                                                        src={related.image}
                                                        alt={related.title}
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors">
                                                            {related.title}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 mt-1">{related.journal}</p>
                                                        <p className="text-xs text-gray-400">{related.date}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Share Options */}
                            {showShare && (
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Share Article</h3>
                                    <div className="space-y-3">
                                        <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300">
                                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-xs">T</span>
                                            </div>
                                            <span className="text-sm font-medium">Share on Twitter</span>
                                        </button>
                                        <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all duration-300">
                                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-xs">f</span>
                                            </div>
                                            <span className="text-sm font-medium">Share on Facebook</span>
                                        </button>
                                        <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-700 hover:bg-blue-50 transition-all duration-300">
                                            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-xs">in</span>
                                            </div>
                                            <span className="text-sm font-medium">Share on LinkedIn</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
