import React from 'react';
import { Link } from 'wouter';
import useEmblaCarousel from 'embla-carousel-react';

const slides = [
  { src: 'https://picsum.photos/seed/picsum/800/400', alt: 'Factory Image 1' },
  { src: 'https://picsum.photos/seed/random/800/400', alt: 'Factory Image 2' },
  { src: 'https://picsum.photos/seed/test/800/400', alt: 'Factory Image 3' },
];

const Home: React.FC = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true });

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center bg-cover bg-center hero-section">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Pioneering Industrial Excellence
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            HLSG Industries is a new force in the industrial sector, committed to innovation, quality, and building a sustainable future.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">About HLSG Industries</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Though newly established, our foundations are built on decades of combined expertise and a forward-thinking vision. We aim to redefine industry standards through cutting-edge solutions and a steadfast commitment to our clients.
            </p>
            <Link to="/about" className="btn-primary">
              Learn More About Us
            </Link>
          </div>
          <div className="embla" ref={emblaRef}>
            <div className="embla__container">
              {slides.map((slide, index) => (
                <div className="embla__slide" key={index}>
                  <img src={slide.src} alt={slide.alt} className="rounded-lg shadow-lg object-cover h-full w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            We offer a dynamic range of services designed to meet the evolving needs of the modern industrial landscape. Discover how we can empower your next project.
          </p>
          <Link to="/services" className="btn-secondary">
            Explore Our Services
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Ready to Build Your Future?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            We are actively seeking partners and clients who share our passion for innovation and quality. Let's start a conversation about how we can achieve great things together.
          </p>
          <Link to="/contact" className="btn-primary">
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
