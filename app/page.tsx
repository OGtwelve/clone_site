"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { CampusInfo } from "@/components/campus-info"
import { OurSchool } from "@/components/our-school"
import { OurStandards } from "@/components/our-standards"
import { OurClasses } from "@/components/our-classes"
import { OurStaff } from "@/components/our-staff"
import { ContactUs } from "@/components/contact-us"
import { Footer } from "@/components/footer"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("home")

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <>
            <Hero />
            <CampusInfo />
          </>
        )
      case "school":
        return (
          <>
            <OurSchool />
            <CampusInfo />
          </>
        )
      case "standards":
        return (
          <>
            <OurStandards />
            <CampusInfo />
          </>
        )
      case "classes":
        return (
          <>
            <OurClasses />
            <CampusInfo />
          </>
        )
      case "staff":
        return (
          <>
            <OurStaff />
            <CampusInfo />
          </>
        )
      case "contact":
        return (
          <>
            <ContactUs />
            <CampusInfo />
          </>
        )
      default:
        return (
          <>
            <Hero />
            <CampusInfo />
          </>
        )
    }
  }

  return (
    <main className="min-h-screen">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderPage()}
      <Footer />
    </main>
  )
}
