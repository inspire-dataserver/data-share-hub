
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: number;
  content: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  avatar?: string;
}

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const testimonials: Testimonial[] = [
    {
      id: 1,
      content: "DataHubX transformed our research capabilities. We found exactly the dataset we needed for our AI model training, saving us months of data collection.",
      author: "Sarah Johnson",
      role: "Data Scientist",
      company: "TechInnovate",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    },
    {
      id: 2,
      content: "As a data provider, I've been able to monetize our company's anonymized datasets, creating a new revenue stream we hadn't considered before.",
      author: "Michael Chen",
      role: "CTO",
      company: "DataMetrics",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    },
    {
      id: 3,
      content: "The platform's verification system gives me confidence in the data quality. Every dataset I've purchased has exceeded my expectations.",
      author: "Emily Rodriguez",
      role: "Market Analyst",
      company: "Global Insights",
      rating: 4,
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(document.getElementById("testimonials") as HTMLElement);

    return () => observer.disconnect();
  }, []);

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden bg-white dark:bg-gray-900">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 opacity-5 dark:opacity-[0.02]">
        <svg width="350" height="350" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M40.5,-52.5C52.9,-41.7,63.1,-28.5,65.3,-14.2C67.5,0.2,61.7,15.6,52.7,27.2C43.7,38.8,31.4,46.6,17.4,52.8C3.5,59,-12.2,63.6,-24.2,59.1C-36.2,54.5,-44.6,40.7,-52.5,26.5C-60.4,12.3,-67.7,-2.4,-64.9,-15.1C-62,-27.9,-49,-38.8,-35.8,-49.2C-22.5,-59.5,-9,-69.4,3.4,-73.4C15.9,-77.3,28.1,-63.3,40.5,-52.5Z" transform="translate(100 100)" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 opacity-5 dark:opacity-[0.02]">
        <svg width="350" height="350" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M44.6,-51.5C59.3,-40.9,73.5,-27.9,76.4,-12.8C79.4,2.4,71.1,19.9,60.6,33.5C50.1,47,37.6,56.7,22.8,63.4C8.1,70.2,-8.9,73.9,-23.4,68.9C-37.9,63.9,-49.9,50.1,-59.3,34.3C-68.7,18.5,-75.7,0.6,-73.3,-16.2C-70.9,-32.9,-59.2,-48.5,-44.7,-59.1C-30.1,-69.7,-15.1,-75.3,-0.4,-74.9C14.3,-74.4,29.9,-62.1,44.6,-51.5Z" transform="translate(100 100)" />
        </svg>
      </div>
      
      <div className="container px-4 mx-auto relative">
        <div className="max-w-xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            What our users say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Join thousands of satisfied data providers and consumers on our platform
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div 
            className={`relative overflow-hidden transition-opacity duration-700 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
              <button 
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </div>
            
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
              <button 
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            
            <div 
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="w-full flex-shrink-0 px-12"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-elevation-medium">
                    <div className="flex justify-center mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={cn(
                            "h-5 w-5 mx-0.5", 
                            i < testimonial.rating 
                              ? "text-amber-500 fill-amber-500" 
                              : "text-gray-300 dark:text-gray-600"
                          )} 
                        />
                      ))}
                    </div>
                    
                    <blockquote className="text-xl text-center mb-8">
                      "{testimonial.content}"
                    </blockquote>
                    
                    <div className="flex flex-col items-center">
                      {testimonial.avatar ? (
                        <div className="w-16 h-16 mb-4">
                          <img 
                            src={testimonial.avatar} 
                            alt={testimonial.author}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                          <span className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                            {testimonial.author.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="text-center">
                        <div className="font-semibold text-lg">{testimonial.author}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.role}, {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === activeIndex 
                      ? "bg-blue-600" 
                      : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
