"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Heart, Star, ShoppingCart, Filter, Grid, List, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookDetails } from "@/components/book-details"
import { PaymentModal } from "@/components/payment-modal"
import { PurchaseSuccess } from "@/components/purchase-success"
import { JournalGrid } from "@/components/journal-grid"

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
  saleInfo?: {
    listPrice?: {
      amount: number
      currencyCode: string
    }
    retailPrice?: {
      amount: number
      currencyCode: string
    }
  }
}

export default function BookStore() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [purchasedBooks, setPurchasedBooks] = useState<Book[]>([])
  const [showJournals, setShowJournals] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const genres = [
    "all",
    "fiction",
    "non-fiction",
    "mystery",
    "romance",
    "science-fiction",
    "fantasy",
    "biography",
    "history",
    "self-help",
    "business",
    "technology",
  ]

  useEffect(() => {
    const savedFavorites = localStorage.getItem("bookFavorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }

    const savedPurchases = localStorage.getItem("purchasedBooks")
    if (savedPurchases) {
      setPurchasedBooks(JSON.parse(savedPurchases))
    }

    // Load initial popular books
    loadInitialBooks()
  }, [])

  const loadInitialBooks = async () => {
    setLoading(true)
    setError(null)

    const popularSearches = [
      "bestseller fiction",
      "popular novels 2024",
      "harry potter",
      "stephen king",
      "agatha christie",
      "classic literature",
    ]

    let booksLoaded = false

    for (const searchTerm of popularSearches) {
      if (booksLoaded) break

      try {
        console.log(`Trying to load books with search: ${searchTerm}`)
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&orderBy=relevance&maxResults=40&printType=books&langRestrict=en`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          },
        )

        if (!response.ok) {
          console.log(`HTTP error for ${searchTerm}: ${response.status}`)
          continue
        }

        const data = await response.json()
        console.log(`API Response for ${searchTerm}:`, data)

        if (data.items && data.items.length > 0) {
          const validBooks = data.items.filter(
            (book: Book) =>
              book.volumeInfo.title &&
              book.volumeInfo.authors &&
              book.volumeInfo.authors.length > 0 &&
              (book.volumeInfo.imageLinks?.thumbnail || book.volumeInfo.imageLinks?.smallThumbnail),
          )

          if (validBooks.length > 0) {
            setBooks(validBooks)
            booksLoaded = true
            console.log(`Successfully loaded ${validBooks.length} books`)
            break
          }
        }
      } catch (error) {
        console.error(`Error fetching ${searchTerm} books:`, error)
        continue
      }
    }

    if (!booksLoaded) {
      console.log("Loading sample books as fallback")
      loadSampleBooks()
      setError("Unable to connect to Google Books API. Showing sample books instead.")
    }

    setLoading(false)
  }

  const loadSampleBooks = () => {
    const sampleBooks = [
      {
        id: "sample-1",
        volumeInfo: {
          title: "The Great Gatsby",
          authors: ["F. Scott Fitzgerald"],
          description:
            "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream through the eyes of narrator Nick Carraway.",
          imageLinks: {
            thumbnail: "/placeholder-qb79i.png",
          },
          averageRating: 4.2,
          ratingsCount: 1250,
          categories: ["Fiction", "Classic Literature"],
          pageCount: 180,
          language: "en",
        },
        saleInfo: {
          retailPrice: { amount: 12.99, currencyCode: "USD" },
        },
      },
      {
        id: "sample-2",
        volumeInfo: {
          title: "To Kill a Mockingbird",
          authors: ["Harper Lee"],
          description:
            "A gripping tale of racial injustice and childhood innocence in the American South, told through the eyes of Scout Finch.",
          imageLinks: {
            thumbnail: "/mockingbird.png",
          },
          averageRating: 4.5,
          ratingsCount: 2100,
          categories: ["Fiction", "Classic Literature"],
          pageCount: 324,
          language: "en",
        },
        saleInfo: {
          retailPrice: { amount: 14.99, currencyCode: "USD" },
        },
      },
      {
        id: "sample-3",
        volumeInfo: {
          title: "1984",
          authors: ["George Orwell"],
          description:
            "A dystopian social science fiction novel about totalitarian control, surveillance, and the power of language and thought.",
          imageLinks: {
            thumbnail: "/dystopian-book-cover.png",
          },
          averageRating: 4.3,
          ratingsCount: 1800,
          categories: ["Fiction", "Dystopian", "Science Fiction"],
          pageCount: 328,
          language: "en",
        },
        saleInfo: {
          retailPrice: { amount: 13.99, currencyCode: "USD" },
        },
      },
      {
        id: "sample-4",
        volumeInfo: {
          title: "Pride and Prejudice",
          authors: ["Jane Austen"],
          description:
            "A romantic novel about manners, upbringing, morality, and marriage in Georgian England, featuring Elizabeth Bennet and Mr. Darcy.",
          imageLinks: {
            thumbnail: "/pride-and-prejudice-cover.png",
          },
          averageRating: 4.4,
          ratingsCount: 1650,
          categories: ["Fiction", "Romance", "Classic Literature"],
          pageCount: 432,
          language: "en",
        },
        saleInfo: {
          retailPrice: { amount: 11.99, currencyCode: "USD" },
        },
      },
      {
        id: "sample-5",
        volumeInfo: {
          title: "The Catcher in the Rye",
          authors: ["J.D. Salinger"],
          description:
            "A controversial novel about teenage rebellion and alienation, following Holden Caulfield's experiences in New York City.",
          imageLinks: {
            thumbnail: "/catcher-in-the-rye-cover.png",
          },
          averageRating: 3.8,
          ratingsCount: 980,
          categories: ["Fiction", "Coming of Age"],
          pageCount: 277,
          language: "en",
        },
        saleInfo: {
          retailPrice: { amount: 13.49, currencyCode: "USD" },
        },
      },
      {
        id: "sample-6",
        volumeInfo: {
          title: "Harry Potter and the Sorcerer's Stone",
          authors: ["J.K. Rowling"],
          description:
            "The first book in the beloved Harry Potter series, following a young wizard's journey at Hogwarts School of Witchcraft and Wizardry.",
          imageLinks: {
            thumbnail: "/harry-potter-sorcerers-stone-book.png",
          },
          averageRating: 4.7,
          ratingsCount: 3200,
          categories: ["Fiction", "Fantasy", "Young Adult"],
          pageCount: 309,
          language: "en",
        },
        saleInfo: {
          retailPrice: { amount: 15.99, currencyCode: "USD" },
        },
      },
      {
        id: "sample-7",
        volumeInfo: {
          title: "The Lord of the Rings",
          authors: ["J.R.R. Tolkien"],
          description:
            "An epic high fantasy novel about the quest to destroy the One Ring and defeat the Dark Lord Sauron.",
          imageLinks: {
            thumbnail: "/lord-of-the-rings-cover.png",
          },
          averageRating: 4.6,
          ratingsCount: 2800,
          categories: ["Fiction", "Fantasy", "Adventure"],
          pageCount: 1216,
          language: "en",
        },
        saleInfo: {
          retailPrice: { amount: 18.99, currencyCode: "USD" },
        },
      },
      {
        id: "sample-8",
        volumeInfo: {
          title: "Dune",
          authors: ["Frank Herbert"],
          description:
            "A science fiction masterpiece set on the desert planet Arrakis, following Paul Atreides in his quest for revenge and power.",
          imageLinks: {
            thumbnail: "/dune-desert-planet.png",
          },
          averageRating: 4.4,
          ratingsCount: 1900,
          categories: ["Fiction", "Science Fiction", "Adventure"],
          pageCount: 688,
          language: "en",
        },
        saleInfo: {
          retailPrice: { amount: 16.99, currencyCode: "USD" },
        },
      },
    ]
    setBooks(sampleBooks)
  }

  const searchBooks = async (query: string) => {
    if (!query.trim()) {
      loadInitialBooks()
      return
    }

    setLoading(true)
    setError(null)

    try {
      const genreQuery = selectedGenre !== "all" ? `+subject:${selectedGenre}` : ""
      const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}${genreQuery}&orderBy=relevance&maxResults=40&printType=books&langRestrict=en`

      console.log("Searching with URL:", searchUrl)

      const response = await fetch(searchUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Search results:", data)

      if (data.items && data.items.length > 0) {
        const validBooks = data.items.filter(
          (book: Book) => book.volumeInfo.title && book.volumeInfo.authors && book.volumeInfo.authors.length > 0,
        )

        if (validBooks.length > 0) {
          setBooks(validBooks)
          setError(null)
        } else {
          setError(`No valid books found for "${query}". Try a different search term.`)
        }
      } else {
        setError(`No books found for "${query}". Try a different search term.`)
      }
    } catch (error) {
      console.error("Error fetching books:", error)
      setError("Failed to search books. Please check your internet connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    searchBooks(searchTerm)
  }

  const handleQuickSearch = (term: string) => {
    setSearchTerm(term)
    searchBooks(term)
  }

  const toggleFavorite = (bookId: string) => {
    const newFavorites = favorites.includes(bookId) ? favorites.filter((id) => id !== bookId) : [...favorites, bookId]

    setFavorites(newFavorites)
    localStorage.setItem("bookFavorites", JSON.stringify(newFavorites))
  }

  const handleBookClick = (book: Book) => {
    setSelectedBook(book)
  }

  const handlePurchase = (book: Book) => {
    setSelectedBook(book)
    setShowPayment(true)
  }

  const handlePaymentSuccess = (book: Book) => {
    const newPurchasedBooks = [...purchasedBooks, book]
    setPurchasedBooks(newPurchasedBooks)
    localStorage.setItem("purchasedBooks", JSON.stringify(newPurchasedBooks))

    setShowPayment(false)
    setShowSuccess(true)

    setTimeout(() => {
      setShowSuccess(false)
      setShowJournals(true)
    }, 3000)
  }

  const getBookPrice = (book: Book) => {
    return book.saleInfo?.retailPrice?.amount || book.saleInfo?.listPrice?.amount || Math.floor(Math.random() * 20) + 5
  }

  const getBookImage = (book: Book) => {
    return (
      book.volumeInfo.imageLinks?.thumbnail ||
      book.volumeInfo.imageLinks?.smallThumbnail ||
      `/placeholder.svg?height=300&width=200&query=book+cover+${encodeURIComponent(book.volumeInfo.title)}`
    )
  }

  if (showJournals) {
    return <JournalGrid onBack={() => setShowJournals(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-purple-200 dark:border-purple-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              📚 BookVibe
            </h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                {favorites.length} ❤️
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {purchasedBooks.length} 📖
              </Badge>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for books, authors, or genres..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/90 border-purple-200 focus:border-purple-400"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 sm:px-6"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Search"}
              </Button>
            </form>

            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-full sm:w-40 bg-white/90">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre.charAt(0).toUpperCase() + genre.slice(1).replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2">
                {["Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", "Biography"].map((genre) => (
                  <Button
                    key={genre}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSearch(genre.toLowerCase())}
                    className="bg-white/80 hover:bg-purple-50 text-xs sm:text-sm"
                    disabled={loading}
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-yellow-800 text-sm">{error}</p>
              <Button
                onClick={loadInitialBooks}
                variant="outline"
                size="sm"
                className="mt-2 bg-transparent"
                disabled={loading}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {books.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Discover Amazing Books</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Search for your next favorite read or explore popular genres
            </p>
            <Button
              onClick={loadInitialBooks}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={loading}
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
              Load Popular Books
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Searching for books...</p>
            </div>
          </div>
        )}

        <div
          className={`grid gap-4 sm:gap-6 ${
            viewMode === "grid"
              ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              : "grid-cols-1 max-w-4xl mx-auto"
          }`}
        >
          {books.map((book) => (
            <Card
              key={book.id}
              className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-purple-200/50 cursor-pointer ${
                viewMode === "list" ? "flex flex-row" : "flex flex-col"
              }`}
              onClick={() => handleBookClick(book)}
            >
              <div className={`relative ${viewMode === "list" ? "w-24 sm:w-32 flex-shrink-0" : ""}`}>
                <img
                  src={getBookImage(book) || "/placeholder.svg"}
                  alt={book.volumeInfo.title}
                  className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                    viewMode === "list" ? "w-full h-32 sm:h-48 rounded-l-lg" : "w-full h-48 sm:h-64 rounded-t-lg"
                  }`}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(book.id)
                  }}
                  className="absolute top-1 right-1 bg-white/80 hover:bg-white/90 rounded-full p-1 sm:p-2"
                >
                  <Heart
                    className={`h-3 w-3 sm:h-4 sm:w-4 ${favorites.includes(book.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </Button>
              </div>

              <div className={`flex flex-col ${viewMode === "list" ? "flex-1 p-2 sm:p-4" : ""}`}>
                <CardHeader className={`${viewMode === "list" ? "p-0 pb-2" : "p-3 sm:p-6 pb-2"}`}>
                  <h3 className="font-semibold text-sm sm:text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {book.volumeInfo.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                    {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
                  </p>
                  {book.volumeInfo.averageRating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs sm:text-sm font-medium">{book.volumeInfo.averageRating}</span>
                      <span className="text-xs text-gray-500">({book.volumeInfo.ratingsCount || 0})</span>
                    </div>
                  )}
                </CardHeader>

                <CardContent className={`flex-1 ${viewMode === "list" ? "p-0" : "px-3 sm:px-6 py-0"}`}>
                  {viewMode === "list" && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 sm:line-clamp-3">
                      {book.volumeInfo.description || "No description available."}
                    </p>
                  )}
                  {book.volumeInfo.categories && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {book.volumeInfo.categories.slice(0, viewMode === "list" ? 3 : 2).map((category, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>

                <CardFooter className={`flex flex-col gap-2 ${viewMode === "list" ? "p-0 pt-2" : "p-3 sm:p-6 pt-2"}`}>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm sm:text-lg font-bold text-green-600">${getBookPrice(book)}</span>
                    {viewMode === "grid" && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleBookClick(book)
                        }}
                        variant="outline"
                        size="sm"
                        className="hover:bg-purple-50 text-xs sm:text-sm"
                      >
                        Details
                      </Button>
                    )}
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePurchase(book)
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-xs sm:text-sm"
                    size={viewMode === "grid" ? "sm" : "default"}
                  >
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Buy Now
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-purple-200 dark:border-purple-800 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-2">Powered by Google Books API</p>
            <a
              href="https://developers.google.com/books"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 underline"
            >
              Google Books API Documentation
            </a>
          </div>
        </div>
      </footer>

      {selectedBook && !showPayment && (
        <BookDetails
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onPurchase={() => {
            setShowPayment(true)
          }}
          price={getBookPrice(selectedBook)}
        />
      )}

      {showPayment && selectedBook && (
        <PaymentModal
          book={selectedBook}
          price={getBookPrice(selectedBook)}
          onClose={() => {
            setShowPayment(false)
            setSelectedBook(null)
          }}
          onSuccess={() => handlePaymentSuccess(selectedBook)}
        />
      )}

      {showSuccess && <PurchaseSuccess />}
    </div>
  )
}
