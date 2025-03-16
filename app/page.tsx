"use client";

import { Header } from '@/app/components/ui/header';
import { Footer } from '@/app/components/ui/footer';
import { Button } from '@/app/components/ui/button';
import { ArrowRight, GraduationCap, Users, Lightbulb, Globe } from 'lucide-react';
import Link from 'next/link';

import './styles/globals.css';

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 sm:py-32 bg-gradient-to-br from-blue-900 to-slate-900 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
                Empowering Future Tech Leaders
              </h1>
              <p className="mt-6 text-xl text-blue-100 mb-8 leading-relaxed">
                The Banatao Family Filipino American Education Fund supports
                promising students in technology and engineering fields,
                fostering innovation and leadership for a better tomorrow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                  <Link href="/scholars">Meet Our Scholars</Link>
                </Button>
                <Button asChild size="lg" className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-900 transition-colors">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Our Mission and Values
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                We're dedicated to supporting Filipino American students pursuing degrees in STEM fields through financial assistance and mentorship.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-blue-100 mb-6">
                  <GraduationCap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Education</h3>
                <p className="text-gray-600">
                  Supporting academic excellence in STEM fields through scholarships and educational resources.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-blue-100 mb-6">
                  <Lightbulb className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
                <p className="text-gray-600">
                  Encouraging groundbreaking research and projects that push the boundaries of technology.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-blue-100 mb-6">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Leadership</h3>
                <p className="text-gray-600">
                  Developing the next generation of tech leaders with mentorship and community support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-4xl font-bold text-blue-600 mb-2">100+</h3>
                <p className="text-gray-600">Scholars Supported</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-4xl font-bold text-blue-600 mb-2">50+</h3>
                <p className="text-gray-600">Universities</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-4xl font-bold text-blue-600 mb-2">$2M+</h3>
                <p className="text-gray-600">In Scholarships</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-4xl font-bold text-blue-600 mb-2">15+</h3>
                <p className="text-gray-600">Years of Impact</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Scholar Testimonials
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Hear from some of our scholarship recipients about their experiences.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <blockquote className="text-gray-700 italic mb-4">
                  "The Banatao Scholarship allowed me to focus on my studies without the burden of financial stress. I'm now working at a leading tech company building the future of AI."
                </blockquote>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Maria Santos</p>
                    <p className="text-gray-600 text-sm">Computer Science, Stanford '19</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <blockquote className="text-gray-700 italic mb-4">
                  "Being part of the Banatao Scholars community connected me with mentors who guided me through my academic journey and helped launch my career in biotech."
                </blockquote>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                  <div>
                    <p className="font-semibold text-gray-900">James Rodriguez</p>
                    <p className="text-gray-600 text-sm">Bioengineering, UC Berkeley '20</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <blockquote className="text-gray-700 italic mb-4">
                  "The scholarship not only supported me financially but also introduced me to a network of brilliant Filipino Americans in tech that I continue to collaborate with today."
                </blockquote>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Anna Reyes</p>
                    <p className="text-gray-600 text-sm">Electrical Engineering, MIT '21</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0 md:w-2/3">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                  Ready to Apply for a Scholarship?
                </h2>
                <p className="text-blue-100 text-lg">
                  We're looking for motivated Filipino American students pursuing degrees in STEM fields. Applications for the next cohort open soon.
                </p>
              </div>
              <div>
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Link href="/login">
                    Learn About Eligibility <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
