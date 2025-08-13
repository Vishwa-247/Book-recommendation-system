"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, BookOpen, Calendar, User, Star, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Book {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    description?: string
    imageLinks?: {
      thumbnail?: string
      smallThumbnail?: string
    }
    averageRating?: number
    publishedDate?: string
    categories?: string[]
    pageCount?: number
  }
}

interface JournalGridProps {
  onBack: () => void
}

export function JournalGrid({ onBack }: JournalGridProps) {
  const [purchasedBooks, setPurchasedBooks] = useState<Book[]>([])

  useEffect(() => {
    const savedPurchases = localStorage.getItem("purchasedBooks")
    if (savedPurchases) {
      setPurchasedBooks(JSON.parse(savedPurchases))
    }
  }, [])

  const getBookImage = (book: Book) => {
    return (
      book.volumeInfo.imageLinks?.thumbnail ||
      book.volumeInfo.imageLinks?.smallThumbnail ||
      `/placeholder.svg?height=300&width=200&query=book+cover+${encodeURIComponent(book.volumeInfo.title)}`
    )
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown"
    return new Date(dateString).getFullYear().toString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-indigo-200 dark:border-indigo-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Store
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                📖 My Digital Library
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Your purchased books and journals</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {purchasedBooks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Library is Empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Purchase some books to start building your digital collection
            </p>
            <Button onClick={onBack} className="bg-gradient-to-r from-indigo-600 to-purple-600">
              Browse Books
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Your Collection ({purchasedBooks.length} books)
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Access your purchased books anytime, anywhere</p>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {purchasedBooks.map((book) => (
                <Card
                  key={book.id}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-indigo-200/50"
                >
                  <div className="relative">
                    <img
                      src={getBookImage(book) || "/placeholder.svg"}
                      alt={book.volumeInfo.title}
                      className="w-full h-64 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-500 text-white">Owned</Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {book.volumeInfo.title}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <User className="h-3 w-3" />
                      <span className="line-clamp-1">{book.volumeInfo.authors?.join(", ") || "Unknown Author"}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(book.volumeInfo.publishedDate)}</span>
                      </div>
                      {book.volumeInfo.pageCount && (
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          <span>{book.volumeInfo.pageCount}p</span>
                        </div>
                      )}
                    </div>

                    {book.volumeInfo.averageRating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{book.volumeInfo.averageRating}</span>
                      </div>
                    )}

                    {book.volumeInfo.categories && (
                      <div className="flex flex-wrap gap-1">
                        {book.volumeInfo.categories.slice(0, 2).map((category, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-indigo-100 text-indigo-700">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Button
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                      onClick={() => {
                        // Simulate download/read action
                        alert(`Opening "${book.volumeInfo.title}" for reading...`)
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Read Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
