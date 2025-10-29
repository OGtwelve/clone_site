"use client"

import { useEffect, useMemo, useState } from "react"
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

export function News() {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear().toString()
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0")

    // ← 新增：从 /api/news 读取
    const [newsData, setNewsData] = useState<NewsArticle[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let canceled = false
        ;(async () => {
            try {
                setLoading(true)
                const res = await fetch("/api/news", { cache: "no-store" })
                const data = await res.json()
                if (!canceled) {
                    if (res.ok && Array.isArray(data?.items)) {
                        setNewsData(data.items as NewsArticle[])
                        setError(null)
                    } else {
                        setError(data?.message || "Failed to load news")
                    }
                }
            } catch (e: any) {
                if (!canceled) setError(e?.message || String(e))
            } finally {
                if (!canceled) setLoading(false)
            }
        })()
        return () => { canceled = true }
    }, [])

    const [selectedYear, setSelectedYear] = useState<string>(currentYear)
    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth)
    const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({})

    const availableYears = useMemo(() => {
        const years = new Set<string>()

        for (const a of newsData) {
            // 允许 a.date 为 "YYYY-MM-DD"、"YYYY/MM/DD"、"YYYYMMDD" 或任意以年份开头的字符串
            const raw = String(a?.date ?? "")
            const m = raw.match(/^(\d{4})/) // 只取前四位数字作为年份
            if (m && /^\d{4}$/.test(m[1])) {
                years.add(m[1])
                continue
            }
            // 兜底：尝试用 Date 解析
            const d = new Date(raw)
            if (!isNaN(d.getTime())) {
                years.add(String(d.getFullYear()))
            }
        }

        const list = Array.from(years)
        list.sort((a, b) => b.localeCompare(a)) // 新→旧
        return list
    }, [newsData])


    useEffect(() => {
        if (availableYears.length === 0) {
            // 没有任何年份可选，强制设为 'all'
            if (selectedYear !== "all") setSelectedYear("all")
        } else if (selectedYear !== "all" && !availableYears.includes(selectedYear)) {
            // 数据到达后，当前选项不在可选项里
            setSelectedYear("all")
        }
    }, [availableYears]) // 只依赖年份列表变化


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

    const filteredNews = useMemo(() => {
        return newsData.filter((article) => {
            const articleYear = article.date.substring(0, 4)
            const articleMonth = article.date.substring(5, 7)
            const yearMatch = selectedYear === "all" || articleYear === selectedYear
            const monthMatch = selectedMonth === "all" || articleMonth === selectedMonth
            return yearMatch && monthMatch
        })
    }, [newsData, selectedYear, selectedMonth])

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

                {/* Loading / Error */}
                {loading && <p className="text-center text-gray-500">Loading…</p>}
                {error && !loading && <p className="text-center text-red-500">{error}</p>}

                {/* News Articles */}
                {!loading && !error && (
                    <>
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
                                                        alt={`${article.title || article.titleCn || "news"} - Image ${currentIndex + 1}`}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
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

                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                    {article.title || article.titleCn || "Untitled"}
                                                </h3>
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
                    </>
                )}
            </div>
        </div>
    )
}
