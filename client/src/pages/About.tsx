import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const About: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 text-center bg-gray-50 dark:bg-gray-800">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">About HLSG Industries</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Discover the story, values, and people driving our mission to innovate and lead in the industrial sector.
        </p>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <img src="https://picsum.photos/seed/story/600/400" alt="Our Story" className="rounded-lg shadow-lg" />
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              HLSG Industries was founded on the principle of transformative innovation. Our journey began with a simple idea: to challenge the status quo and introduce a new era of efficiency, quality, and sustainability in the industrial world.
            </p>
            <Button asChild>
              <Link to="/about/company">Read Our Full Story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Foundation Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Our Foundation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader><CardTitle>Our Mission</CardTitle></CardHeader>
              <CardContent>To deliver exceptional value to our clients through pioneering technology, sustainable practices, and unwavering integrity.</CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Our Commitment</CardTitle></CardHeader>
              <CardContent>We are dedicated to fostering long-term partnerships, empowering our team, and making a positive impact on the communities we serve.</CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Leadership Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Our Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <img src="https://picsum.photos/seed/leader1/200" alt="Leader 1" className="w-40 h-40 rounded-full mb-4 shadow-lg" />
              <h3 className="text-xl font-semibold">Leader Name 1</h3>
              <p className="text-gray-500 dark:text-gray-400">CEO & Co-Founder</p>
            </div>
            <div className="flex flex-col items-center">
              <img src="https://picsum.photos/seed/leader2/200" alt="Leader 2" className="w-40 h-40 rounded-full mb-4 shadow-lg" />
              <h3 className="text-xl font-semibold">Leader Name 2</h3>
              <p className="text-gray-500 dark:text-gray-400">CTO & Co-Founder</p>
            </div>
          </div>
          <div className="mt-12">
            <Button asChild>
              <Link to="/about/founders">Learn More About Our Founders</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Brand Story Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Our Brand Story</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            The HLSG name and logo represent our core principles of Heritage, Leadership, Strategy, and Growth. It's a symbol of our promise to uphold these values in every venture.
          </p>
          <Button asChild>
            <Link to="/about/company">Explore Our Brand</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
