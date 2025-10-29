"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: "Home 欢迎主页", page: "home" },
    { label: "News 近期新闻", page: "news" },
    { label: "Our School 学院简介", page: "school" },
    { label: "Our Standards 教学研讨", page: "standards" },
    { label: "Our Classes 学术课程", page: "classes" },
    { label: "Our Staff 关于我们", page: "staff" },
    { label: "Contact Us 了解更多", page: "contact" },
  ]

  const handleClick = (page: string) => {
    onPageChange(page)
    setIsOpen(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 w-full justify-center">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleClick(item.page)}
                className={`text-sm transition-colors whitespace-nowrap ${
                  currentPage === item.page ? "text-amber-600 font-semibold" : "text-gray-700 hover:text-amber-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center w-full justify-end">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleClick(item.page)}
                  className={`text-sm transition-colors py-2 text-left ${
                    currentPage === item.page ? "text-amber-600 font-semibold" : "text-gray-700 hover:text-amber-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
