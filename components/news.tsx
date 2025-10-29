"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

interface NewsArticle {
  id: number
  title: string
  titleCn: string
  date: string
  content: string
  contentCn: string
  images: string[]
}

const newsData: NewsArticle[] = [
  {
    id: 1,
    title: "2025 Spring Semester Registration Now Open",
    titleCn: "2025年春季学期报名现已开放",
    date: "2025-01-15",
    content:
      "We are excited to announce that registration for the 2025 Spring Semester is now open! Our comprehensive curriculum includes Chinese language classes, English enrichment, Math competitions, and Chess training. Early bird discount available until February 1st. Classes begin on February 15th at both Irvine and Yorba Linda campuses.",
    contentCn:
      "我们很高兴地宣布2025年春季学期报名现已开放！我们的综合课程包括中文课程、英语强化、数学竞赛和国际象棋培训。早鸟优惠截止至2月1日。课程将于2月15日在尔湾和约巴林达两个校区开始。",
    images: [
      "/2025-spring-semester-registration-poster.jpg",
      "/chinese-class-poster-with-teacher-profile.jpg",
      "/math-competition-training-poster.jpg",
    ],
  },
  {
    id: 2,
    title: "Summer Camp 2025 - Registration Begins",
    titleCn: "2025年夏令营 - 开始报名",
    date: "2025-01-10",
    content:
      "Golden Sunshine Academy is thrilled to announce our 2025 Summer Camp program! This year's camp features exciting activities including Chinese culture exploration, STEM projects, creative arts, and outdoor adventures. Limited spots available. Camp runs from June 15 to August 15. Register now to secure your child's spot!",
    contentCn:
      "金色阳光学院很高兴宣布我们的2025年夏令营项目！今年的夏令营包括激动人心的活动，包括中国文化探索、STEM项目、创意艺术和户外探险。名额有限。夏令营时间为6月15日至8月15日。现在报名以确保您孩子的位置！",
    images: [
      "/summer-camp-2025-poster-with-activities.jpg",
      "/chess-tournament-announcement-poster.jpg",
      "/english-writing-class-poster.jpg",
    ],
  },
  {
    id: 3,
    title: "Outstanding Achievement in 2024 Math Competition",
    titleCn: "2024年数学竞赛取得优异成绩",
    date: "2024-12-20",
    content:
      "Congratulations to our students who participated in the 2024 Regional Math Competition! Our academy achieved remarkable results with 15 students winning gold medals, 20 silver medals, and 25 bronze medals. Special recognition goes to our top performers who will represent our school at the National Math Olympiad in March 2025.",
    contentCn:
      "祝贺参加2024年地区数学竞赛的学生们！我们学院取得了显著成绩，15名学生获得金牌，20名获得银牌，25名获得铜牌。特别表彰我们的优秀学生，他们将代表我们学校参加2025年3月的全国数学奥林匹克竞赛。",
    images: ["/math-competition-training-poster.jpg", "/2025-spring-semester-registration-poster.jpg"],
  },
  {
    id: 4,
    title: "New English Writing Workshop Launched",
    titleCn: "新英语写作工作坊启动",
    date: "2024-11-15",
    content:
      "We are pleased to introduce our new English Writing Workshop designed for students in grades 3-8. This program focuses on developing creative writing skills, essay composition, and critical thinking. Led by experienced educators, the workshop meets twice weekly and includes personalized feedback sessions. Enrollment is limited to ensure individual attention.",
    contentCn:
      "我们很高兴推出专为3-8年级学生设计的新英语写作工作坊。该项目专注于培养创意写作技能、论文写作和批判性思维。由经验丰富的教育工作者领导，工作坊每周举行两次，包括个性化反馈环节。招生人数有限，以确保个别关注。",
    images: ["/english-writing-class-poster.jpg", "/chinese-class-poster-with-teacher-profile.jpg"],
  },
]

export function News() {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear().toString()
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0")

  const [selectedYear, setSelectedYear] = useState<string>(currentYear)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth)
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({})

  const availableYears = Array.from(new Set(newsData.map((article) => article.date.substring(0, 4)))).sort((a, b) =>
    b.localeCompare(a),
  )

  const availableMonths = [
    { value: "01", label: "January 一月" },
    { value: "02", label: "February 二月" },
    { value: "03", label: "March 三月" },
    { value: "04", label: "April 四月" },
    { value: "05", label: "May 五月" },
    { value: "06", label: "June 六月" },
    { value: "07", label: "July 七月" },
    { value: "08", label: "August 八月" },
    { value: "09", label: "September 九月" },
    { value: "10", label: "October 十月" },
    { value: "11", label: "November 十一月" },
    { value: "12", label: "December 十二月" },
  ]

  const filteredNews = newsData.filter((article) => {
    const articleYear = article.date.substring(0, 4)
    const articleMonth = article.date.substring(5, 7)

    const yearMatch = selectedYear === "all" || articleYear === selectedYear
    const monthMatch = selectedMonth === "all" || articleMonth === selectedMonth

    return yearMatch && monthMatch
  })

  const handlePrevImage = (articleId: number, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [articleId]: ((prev[articleId] || 0) - 1 + totalImages) % totalImages,
    }))
  }

  const handleNextImage = (articleId: number, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [articleId]: ((prev[articleId] || 0) + 1) % totalImages,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">News</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-amber-600 mb-8">近期新闻</h2>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years 所有年份</SelectItem>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months 所有月份</SelectItem>
                {availableMonths.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* News Articles */}
        <div className="space-y-8">
          {filteredNews.map((article) => {
            const currentIndex = currentImageIndex[article.id] || 0
            return (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="grid md:grid-cols-2 gap-6 p-6">
                  {/* Left: Image Gallery */}
                  <div className="relative">
                    <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={article.images[currentIndex] || "/placeholder.svg"}
                        alt={`${article.title} - Image ${currentIndex + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Image Navigation */}
                    {article.images.length > 1 && (
                      <div className="flex items-center justify-between mt-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePrevImage(article.id, article.images.length)}
                          className="rounded-full"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <div className="flex gap-2">
                          {article.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex((prev) => ({ ...prev, [article.id]: index }))}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentIndex ? "bg-amber-600 w-6" : "bg-gray-300"
                              }`}
                              aria-label={`Go to image ${index + 1}`}
                            />
                          ))}
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleNextImage(article.id, article.images.length)}
                          className="rounded-full"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {/* Image Counter */}
                    <div className="text-center mt-2 text-sm text-gray-500">
                      {currentIndex + 1} / {article.images.length}
                    </div>
                  </div>

                  {/* Right: Text Content */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(article.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{article.title}</h3>
                    <h4 className="text-xl font-semibold text-amber-600 mb-4">{article.titleCn}</h4>

                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed">{article.content}</p>
                      <p className="text-gray-600 leading-relaxed">{article.contentCn}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* No Results Message */}
        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No news articles found for the selected period.</p>
            <p className="text-gray-400">所选时间段没有找到新闻文章。</p>
          </div>
        )}
      </div>
    </div>
  )
}
