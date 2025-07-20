import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import PublicLayout from "@/components/PublicLayout";
import { ChartLine, Cog, Handshake, Shield, Users, Rocket } from "lucide-react";

export default function Landing() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg"></div>
        <div 
          className="absolute inset-0 bg-center bg-cover opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Building the Future,<br />
              <span className="text-golden">Today</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto font-medium">
              At HLSG Industries, we don't just envision the future—we build it
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services">
                <Button className="px-8 py-4 text-lg font-medium text-white btn-primary rounded-lg transition-all duration-200 shadow-lg">
                  Explore Our Services
                </Button>
              </Link>
              <Button
                className="px-8 py-4 text-lg font-medium text-navyblue bg-white rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg"
                onClick={() => window.location.href = "/api/login"}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navyblue mb-6">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive solutions tailored to drive your business forward with cutting-edge technology and expert guidance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Cards */}
            {[
              {
                icon: <ChartLine className="h-8 w-8 text-white" />,
                title: "Business Strategy",
                description: "Strategic planning and implementation to accelerate your business growth and market positioning."
              },
              {
                icon: <Cog className="h-8 w-8 text-white" />,
                title: "Technology Solutions",
                description: "Advanced technology implementations and digital transformation services for modern enterprises."
              },
              {
                icon: <Handshake className="h-8 w-8 text-white" />,
                title: "Contract Management",
                description: "Comprehensive contract lifecycle management with digital collaboration and tracking capabilities."
              },
              {
                icon: <Shield className="h-8 w-8 text-white" />,
                title: "Risk Management",
                description: "Proactive risk assessment and mitigation strategies to protect your business interests."
              },
              {
                icon: <Users className="h-8 w-8 text-white" />,
                title: "Consulting Services",
                description: "Expert advisory services to guide your organization through complex business challenges."
              },
              {
                icon: <Rocket className="h-8 w-8 text-white" />,
                title: "Innovation Labs",
                description: "Research and development services to bring innovative solutions to market faster."
              }
            ].map((service, index) => (
              <Card key={index} className="service-card bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl card-hover">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-navyblue to-goldenrod1 rounded-lg flex items-center justify-center mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <Button variant="ghost" className="text-navyblue hover:text-goldenrod1 p-0">
                    Learn More →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-navyblue mb-6">About HLSG Industries</h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded with a vision to transform businesses through innovative solutions, HLSG Industries has been at the forefront of technological advancement and strategic business development.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our commitment to excellence and future-focused approach has made us a trusted partner for organizations seeking to navigate the complexities of modern business landscapes.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-navyblue mb-2">500+</div>
                  <div className="text-sm text-gray-600">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-navyblue mb-2">50+</div>
                  <div className="text-sm text-gray-600">Expert Team Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-navyblue mb-2">99%</div>
                  <div className="text-sm text-gray-600">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-navyblue mb-2">24/7</div>
                  <div className="text-sm text-gray-600">Support Available</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/about">
                  <Button className="px-6 py-3 text-white btn-primary rounded-lg transition-all duration-200">
                    About Our Founders
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="px-6 py-3 text-navyblue border-navyblue hover:bg-navyblue hover:text-white">
                    Company History
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Professional team meeting" 
                className="rounded-xl shadow-xl w-full h-auto"
              />
              
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-navyblue to-goldenrod1 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-navyblue">Industry Leader</div>
                    <div className="text-sm text-gray-600">Innovation Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Build Your Future?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Join hundreds of satisfied clients who have transformed their businesses with our expertise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="px-8 py-4 text-lg font-medium text-navyblue bg-white rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg">
                Start Your Project
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="px-8 py-4 text-lg font-medium text-white btn-golden rounded-lg transition-all duration-200 shadow-lg">
                Schedule Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
