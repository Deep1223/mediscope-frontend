"use client"

import Link from "next/link"
import { CheckCircle, FileText, Users, AlertCircle } from "lucide-react"

export default function AuthorGuidelinesPage() {
  const guidelines = [
    {
      title: "Manuscript Preparation",
      icon: <FileText className="w-6 h-6" />,
      items: [
        "Use clear, concise language appropriate for an international audience",
        "Use SI units for all measurements",
        "Number all figures and tables sequentially",
        "Include figure legends and table captions",
      ],
    },
    {
      title: "Author Requirements",
      icon: <Users className="w-6 h-6" />,
      items: [
        "All authors must have made substantial contributions to conception or design",
        "All authors must have approved the final version",
        "Corresponding author must be clearly identified",
        "Include author affiliations and email addresses",
        "Provide ORCID identifiers if available",
        "Disclose all funding sources and conflicts of interest",
      ],
    },
    {
      title: "Ethical Requirements",
      icon: <AlertCircle className="w-6 h-6" />,
      items: [
        "Research involving human subjects must have ethics approval",
        "Include informed consent statement",
        "Clinical trials must be registered in a public registry",
        "Animal research must comply with institutional guidelines",
        "Disclose any potential conflicts of interest",
        "Ensure data availability and reproducibility",
      ],
    },
  ]

  const fileFormats = [
    { type: "Manuscript", format: "DOCX, PDF", maxSize: "50 MB" },
    { type: "Figures", format: "JPG, PNG, TIFF, GIF", maxSize: "50 MB total" },
    { type: "Tables", format: "XLSX, XLS, CSV", maxSize: "50 MB total" },
    { type: "Supplementary", format: "ZIP, RAR, 7Z", maxSize: "100 MB" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="hero-section py-12">
        <div className="container mx-auto px-4">
          <Link href="/for-authors" className="text-white/80 hover:text-white transition mb-4 inline-block">
            Back to For Authors
          </Link>
          <h1 className="text-4xl font-bold mb-4">Author Guidelines</h1>
          <p className="text-xl text-white/90">
            Comprehensive guidelines for preparing and submitting your research manuscript
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Guidelines Sections */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {guidelines.map((section, index) => (
            <div key={index} className="bg-lancet-gray rounded-lg p-6">
              <div className="text-lancet-blue mb-4">{section.icon}</div>
              <h2 className="text-xl font-bold text-lancet-dark mb-4">{section.title}</h2>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* File Formats */}
        <div className="bg-lancet-gray rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-lancet-dark mb-6">File Formats & Size Limits</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-lancet-blue">
                  <th className="text-left py-3 px-4 font-bold text-lancet-dark">File Type</th>
                  <th className="text-left py-3 px-4 font-bold text-lancet-dark">Accepted Formats</th>
                  <th className="text-left py-3 px-4 font-bold text-lancet-dark">Maximum Size</th>
                </tr>
              </thead>
              <tbody>
                {fileFormats.map((row, index) => (
                  <tr key={index} className="border-b border-lancet-border hover:bg-white transition">
                    <td className="py-3 px-4 text-lancet-dark font-medium">{row.type}</td>
                    <td className="py-3 px-4 text-gray-700">{row.format}</td>
                    <td className="py-3 px-4 text-gray-700">{row.maxSize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reference Format */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-lancet-dark mb-6">Reference Format</h2>
          <p className="text-gray-700 mb-4">
            The Lancet uses the Vancouver style for references. References should be numbered in the order they appear
            in the text.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm space-y-2 mb-4">
            <p>Journal article:</p>
            <p className="text-gray-600">Smith J, Doe J. Title of article. Journal Name. 2024;15(3):123-145.</p>
            <p className="mt-4">Book:</p>
            <p className="text-gray-600">Smith J. Title of Book. Publisher; 2024.</p>
            <p className="mt-4">Website:</p>
            <p className="text-gray-600">
              Organization Name. Title of webpage. https://www.example.com. Accessed January 15, 2024.
            </p>
          </div>
        </div>

        {/* Submission Checklist */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-lancet-dark mb-6">Pre-Submission Checklist</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Manuscript is original and not under review elsewhere",
              "All authors have approved the final version",
              "Conflicts of interest are disclosed",
              "Ethics approval is documented",
              "Figures and tables are high quality",
              "References are complete and formatted correctly",
              "Manuscript follows journal style guidelines",
              "All author affiliations are included",
              "Data availability statement is provided",
              "Supplementary files are organized",
              "File sizes are within limits",
            ].map((item, index) => (
              <label key={index} className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-lancet-border mt-1" />
                <span className="text-gray-700">{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Ready to submit your research?</p>
          <Link href="/submit-research" className="btn btn-lancet inline-block px-8 py-3">
            Start Submission
          </Link>
        </div>
      </div>
    </div>
  )
}
