import Header from "@/components/header"
import HeroCarousel from "@/components/hero-carousel"
import LatestNews from "@/components/latest-news"
import LatestResearch from "@/components/latest-research"
import SeriesCommissions from "@/components/series-commissions"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <>
      <Header />
      <HeroCarousel />
      <LatestNews />
      <LatestResearch />
      <SeriesCommissions />
      <Footer />
    </>
  )
}
