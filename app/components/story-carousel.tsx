"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface Story {
  id: string
  slug: string
  title: string
  excerpt: string
  imageUrl?: string
  category?: string
}

interface StoryCarouselProps {
  stories: Story[]
  title?: string
  autoplay?: boolean
  autoplayInterval?: number
}

export function StoryCarousel({
  stories,
  title = "Featured Stories",
  autoplay = true,
  autoplayInterval = 5000,
}: StoryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const storiesPerView = 3;
  const totalSlides = Math.ceil(stories.length / storiesPerView)

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return

      setIsAnimating(true)

      let newIndex = index
      if (newIndex < 0) newIndex = totalSlides - 1
      if (newIndex >= totalSlides) newIndex = 0

      setCurrentIndex(newIndex)

      setTimeout(() => {
        setIsAnimating(false)
      }, 500)
    },
    [isAnimating, totalSlides],
  )

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1)
  }, [currentIndex, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1)
  }, [currentIndex, goToSlide])

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      nextSlide()
    }, autoplayInterval)

    return () => clearInterval(interval)
  }, [autoplay, autoplayInterval, nextSlide])

  return (
    <div className="w-full py-8">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}

      <div className="relative">
        <div className="relative overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, pageIndex) => {
              const startIdx = pageIndex * storiesPerView
              const pageStories = stories.slice(startIdx, startIdx + storiesPerView)

              return (
                <div key={pageIndex} className="w-full flex-shrink-0 flex gap-4 px-1" style={{ width: "100%" }}>
                  {pageStories.map((story) => (
                    <StoryCard key={story.id} story={story} />
                  ))}

                  {pageStories.length < storiesPerView &&
                    Array.from({ length: storiesPerView - pageStories.length }).map((_, i) => (
                      <div key={`placeholder-${i}`} className="flex-1 min-w-0"></div>
                    ))}
                </div>
              )
            })}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white shadow-md border-gray-200 z-10"
          onClick={prevSlide}
          disabled={isAnimating}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow-md border-gray-200 z-10"
          onClick={nextSlide}
          disabled={isAnimating}
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all",
                currentIndex === index ? "bg-primary w-6" : "bg-gray-300 hover:bg-gray-400",
              )}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={currentIndex === index ? "true" : "false"}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function StoryCard({ story }: { story: Story }) {
  return (
    <Card className="flex-1 min-w-0 overflow-hidden flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img
          src={story.imageUrl || "/unknown_avatar.svg?height=400&width=600"}
          alt={story.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {story.category && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
            {story.category}
          </span>
        )}
      </div>

      <CardContent className="flex-grow p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{story.title}</h3>
        <p className="text-muted-foreground line-clamp-3">{story.excerpt}</p>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Link
          href={`/stories/${story.slug}`}
          className="inline-flex items-center text-primary font-medium hover:underline"
        >
          Learn More
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  )
}
