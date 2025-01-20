"use client";

import Link from 'next/link';
import { Header } from '@/app/components/ui/header';
import { Footer } from '@/app/components/ui/footer';

import './styles/globals.css';

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <section className="py-20 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Empowering Future Tech Leaders
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-muted-foreground">
                The Banatao Family Filipino American Education Fund supports
                promising students in technology and engineering fields,
                fostering innovation and leadership.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Education</h2>
                <p className="mt-2 text-muted-foreground">
                  Supporting academic excellence in STEM fields
                </p>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold">Innovation</h2>
                <p className="mt-2 text-muted-foreground">
                  Encouraging groundbreaking research and projects
                </p>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold">Leadership</h2>
                <p className="mt-2 text-muted-foreground">
                  Developing the next generation of tech leaders
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
