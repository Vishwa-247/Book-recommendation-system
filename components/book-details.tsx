"use client"

import { X, Star, Calendar, BookOpen, Globe, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

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
    ratingsCount?: number
    publishedDate?: string
    categories?: string[]
    pageCount?: number
    language?: string
    previewLink?: string
  }
}

interface BookDetailsProps {
  book: Book
  onClose: () => void
  onPurchase: () => void
  price: number
}

export function BookDetails({ book, onClose, onPurchase, price }: BookDetailsProps) {
  const getBookImage = (book: Book) => {
    return (
      book.volumeInfo.imageLinks?.thumbnail ||
      book.volumeInfo.imageLinks?.smallThumbnail ||
      `/placeholder.svg?height=400&width=300&query=book+cover+${encodeURIComponent(book.volumeInfo.title)}`
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md">
        <CardHeader className="relative">
          <Button variant="ghost" size="sm" onClick={onClose} className="absolute right-4 top-4 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-8 p-6">
          {/* Book Cover */}
          <div className="flex justify-center">
            <img
              src={getBookImage(book) || "/placeholder.svg"}
              alt={book.volumeInfo.title}
              className="max-w-full h-auto max-h-96 rounded-lg shadow-lg"
            />
          </div>

          {/* Book Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.volumeInfo.title}</h1>
              <p className="text-xl text-gray-600 mb-4">by {book.volumeInfo.authors?.join(", ") || "Unknown Author"}</p>

              {book.volumeInfo.averageRating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(book.volumeInfo.averageRating!)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{book.volumeInfo.averageRating}</span>
                  <span className="text-gray-500">({book.volumeInfo.ratingsCount || 0} reviews)</span>
                </div>
              )}

              <div className="text-3xl font-bold text-green-600 mb-6">${price}</div>
            </div>

            {/* Book Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {book.volumeInfo.publishedDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Published: {new Date(book.volumeInfo.publishedDate).getFullYear()}</span>
                </div>
              )}
              {book.volumeInfo.pageCount && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <span>{book.volumeInfo.pageCount} pages</span>
                </div>
              )}
              {book.volumeInfo.language && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span>Language: {book.volumeInfo.language.toUpperCase()}</span>
                </div>
              )}
            </div>

            {/* Categories */}
            {book.volumeInfo.categories && (
              <div>
                <h3 className="font-semibold mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {book.volumeInfo.categories.map((category, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {book.volumeInfo.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <div
                  className="text-gray-700 leading-relaxed max-h-40 overflow-y-auto"
                  dangerouslySetInnerHTML={{
                    __html: book.volumeInfo.description.replace(/<[^>]*>/g, ""),
                  }}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={onPurchase}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-lg py-3"
              >
                Purchase for ${price}
              </Button>
              {book.volumeInfo.previewLink && (
                <Button
                  variant="outline"
                  onClick={() => window.open(book.volumeInfo.previewLink, "_blank")}
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
