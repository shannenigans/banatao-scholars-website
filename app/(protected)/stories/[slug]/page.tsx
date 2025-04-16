import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { stories } from "@/app/constants/testimonials"

const getStoryBySlug = (slug: string) => {
    return stories.find((story) => story.slug === slug)
}

export default function StoryPage({ params }: { params: { slug: string } }) {
    const story = getStoryBySlug(params.slug)
  
    if (!story) {
      return (
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Story not found</h1>
          <p className="mb-6">The story you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      )
    }
  
    return (
      <main className="min-h-screen">
        {/* Hero section */}
        <div className="relative w-full h-[50vh] min-h-[400px]">
          <div className="absolute inset-0">
            <img src={story.imageUrl || "/unknown_avatar.svg"} alt={story.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
          </div>
  
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
            <div className="container mx-auto max-w-4xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{story.title}</h1>
            </div>
          </div>
        </div>
  
        {/* Content */}
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Button variant="outline" asChild className="mb-8">
            <Link href="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Stories
            </Link>
          </Button>
  
          <div className="prose prose-lg max-w-none">
            <div style={{ whiteSpace: 'pre-line'}} dangerouslySetInnerHTML={{ __html: story.excerpt }} />
          </div>
        </div>
      </main>
    )
  }