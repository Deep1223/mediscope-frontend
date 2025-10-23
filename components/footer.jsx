export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h5 className="text-xl font-bold text-white">AyushVeda</h5>
                <p className="text-emerald-300 text-sm">Medical Research Platform</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Advancing medical knowledge through cutting-edge research and innovative healthcare insights.
            </p>
          </div>

          {/* Journals Section */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold text-white border-b border-emerald-500 pb-2">Our Journals</h5>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  AyushVeda Ayurveda
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
                  AyushVeda Yoga
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  AyushVeda Naturopathy
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold text-white border-b border-emerald-500 pb-2">Resources</h5>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors duration-300">
                  For Authors
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors duration-300">
                  For Reviewers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors duration-300">
                  Editorial Policies
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors duration-300">
                  Research Guidelines
                </a>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold text-white border-b border-emerald-500 pb-2">Connect</h5>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-xs">T</span>
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-xs">f</span>
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-700 rounded flex items-center justify-center text-xs">in</span>
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; 2025 AyushVeda Publications. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-emerald-300 transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-emerald-300 transition-colors duration-300">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-emerald-300 transition-colors duration-300">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
