"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

const carouselItems = [
  {
    id: 1,
    title: "Revolutionary AI-Driven Diagnostic Tools in Modern Medicine",
    subtitle: "How artificial intelligence is transforming patient care and clinical decision-making",
    journal: "MediScope Medicine",
    date: "15 Jan 2025",
    image: "/ai-healthcare.png",
    category: "Research",
  },
  {
    id: 2,
    title: "Global Health Equity: Addressing Healthcare Disparities",
    subtitle: "Comprehensive strategies for improving healthcare access worldwide",
    journal: "MediScope Global Health",
    date: "14 Jan 2025",
    image: "/african-healthcare.jpg",
    category: "Article",
  },
  {
    id: 3,
    title: "Climate Change and Public Health: A Critical Connection",
    subtitle: "Understanding the intersection of environmental factors and human health",
    journal: "MediScope Environmental Health",
    date: "13 Jan 2025",
    image: "/climate-change-environmental-health.jpg",
    category: "Comment",
  },
  {
    id: 4,
    title: "Breakthrough in Precision Medicine and Personalized Treatment",
    subtitle: "Tailoring medical interventions to individual patient characteristics",
    journal: "MediScope Oncology",
    date: "12 Jan 2025",
    image: "/cancer-immunotherapy.jpg",
    category: "News",
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [autoPlay])

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setAutoPlay(false)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length)
    setAutoPlay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1))
    setAutoPlay(false)
  }

  const item = carouselItems[currentSlide]

  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-hidden">
      {/* Modern Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

        <div className="container mx-auto px-4 py-24 md:py-40 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Modern Content Design */}
            <div className="space-y-10">
            <div className="inline-flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                {item.category}
              </span>
            </div>

              <h1 className="text-6xl md:text-8xl font-bold leading-tight text-gray-900">
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  {item.title}
                </span>
              </h1>

              <p className="text-2xl md:text-3xl text-gray-600 leading-relaxed font-light max-w-2xl">
                {item.subtitle}
              </p>

              {/* Modern Metadata Cards */}
              <div className="flex flex-wrap gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-emerald-100">
                <p className="text-sm text-gray-500 mb-1">Journal</p>
                <p className="font-semibold text-emerald-600">{item.journal}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-teal-100">
                <p className="text-sm text-gray-500 mb-1">Published</p>
                <p className="font-semibold text-teal-600">{item.date}</p>
              </div>
            </div>

              {/* Modern CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6">
              <Link
                href={`/article/${item.id}`}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 text-lg"
              >
                Read Full Article
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <ChevronRight size={16} />
                </div>
              </Link>
              <Link
                href="/journals"
                className="inline-flex items-center gap-3 bg-white text-emerald-600 border-2 border-emerald-200 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-emerald-50 hover:border-emerald-300 text-lg"
              >
                Browse All Journals
              </Link>
            </div>
          </div>

          {/* Modern Image Design */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={item.image || "/placeholder.svg"} 
                alt={item.title} 
                className="w-full h-[500px] object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 via-transparent to-transparent" />
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>

          {/* Modern Carousel Controls */}
          <div className="mt-20 flex items-center justify-between">
          {/* Modern Indicators */}
          <div className="flex gap-3">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide 
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 w-12 h-3 shadow-lg" 
                    : "bg-gray-300 hover:bg-gray-400 w-3 h-3"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Modern Navigation Arrows */}
          <div className="flex gap-4">
            <button
              onClick={prevSlide}
              className="p-4 rounded-2xl bg-white/90 hover:bg-white text-emerald-600 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:-translate-y-1"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="p-4 rounded-2xl bg-white/90 hover:bg-white text-emerald-600 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:-translate-y-1"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

          {/* Modern Slide Counter */}
          <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
            <span className="text-sm text-gray-600">Article</span>
            <span className="text-emerald-600 font-bold">{currentSlide + 1}</span>
            <span className="text-sm text-gray-400">of</span>
            <span className="text-emerald-600 font-bold">{carouselItems.length}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
