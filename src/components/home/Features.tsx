
import { useState, useEffect } from "react";
import { 
  Sparkles, 
  ShieldCheck, 
  BarChart4, 
  CreditCard, 
  Database, 
  UserCheck,
  ExternalLink,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: "default" | "primary";
  delay?: number;
}

const Feature = ({ icon, title, description, variant = "default", delay = 0 }: FeatureProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100 + delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={cn(
        "p-6 rounded-2xl transition-all duration-700",
        variant === "primary" 
          ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white" 
          : "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800",
        "hover:shadow-elevation-medium hover:-translate-y-1 transition-all duration-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
        variant === "primary" 
          ? "bg-white/10" 
          : "bg-blue-50 dark:bg-blue-900/30"
      )}>
        <div className={variant === "primary" ? "text-white" : "text-blue-600 dark:text-blue-400"}>
          {icon}
        </div>
      </div>
      <h3 className={cn(
        "text-xl font-semibold mb-2",
        variant === "primary" ? "text-white" : "text-gray-900 dark:text-gray-100"
      )}>
        {title}
      </h3>
      <p className={cn(
        "text-base",
        variant === "primary" ? "text-white/80" : "text-gray-600 dark:text-gray-400"
      )}>
        {description}
      </p>
    </div>
  );
};

const Features = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="max-w-xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Powerful features designed for data exchange
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Our platform provides everything you need to discover, trade, and monetize datasets securely.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feature 
            icon={<Filter className="h-6 w-6" />}
            title="Advanced Search"
            description="Find datasets based on keywords, categories, formats, or seller ratings."
            delay={100}
          />
          
          <Feature 
            icon={<ExternalLink className="h-6 w-6" />}
            title="Dataset Previews"
            description="Preview snippets of datasets before purchasing to ensure they meet your needs."
            delay={200}
          />
          
          <Feature 
            icon={<ShieldCheck className="h-6 w-6" />}
            title="Secure Transactions"
            description="Stripe integration ensures safe transactions with encrypted processing."
            variant="primary"
            delay={300}
          />
          
          <Feature 
            icon={<UserCheck className="h-6 w-6" />}
            title="User Verification"
            description="Verified seller badges provide confidence in data authenticity and quality."
            delay={400}
          />
          
          <Feature 
            icon={<CreditCard className="h-6 w-6" />}
            title="Flexible Pricing"
            description="One-time purchases, subscriptions, or pay-per-use access to fit your needs."
            delay={500}
          />
          
          <Feature 
            icon={<Sparkles className="h-6 w-6" />}
            title="AI-Powered Insights"
            description="Automated data quality checks and pricing suggestions for optimal value."
            variant="primary"
            delay={600}
          />
          
          <Feature 
            icon={<Database className="h-6 w-6" />}
            title="Easy Data Management"
            description="Upload and manage Excel, CSV, PDF, and JSON files with custom metadata."
            delay={700}
          />
          
          <Feature 
            icon={<BarChart4 className="h-6 w-6" />}
            title="Analytics Dashboard"
            description="Track sales, earnings, and customer interactions with detailed insights."
            delay={800}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
