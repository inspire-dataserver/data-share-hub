import { useState } from "react";
import { Link } from "react-router-dom";
import ChipBadge from "../ui/ChipBadge";
import { 
  FileSpreadsheet, 
  FileJson, 
  FileText,
  HardDrive, 
  Star, 
  Clock, 
  Users, 
  Eye,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface DatasetCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  format: "csv" | "json" | "pdf" | "excel";
  price: number;
  rating: number;
  downloads: number;
  lastUpdated: string;
  seller: {
    name: string;
    verified: boolean;
  };
  imageUrl?: string;
  featured?: boolean;
  className?: string;
}

const DatasetCard = ({
  id,
  title,
  description,
  category,
  format,
  price,
  rating,
  downloads,
  lastUpdated,
  seller,
  imageUrl,
  featured = false,
  className,
}: DatasetCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatIcons = {
    csv: <FileSpreadsheet className="h-5 w-5" />,
    excel: <FileSpreadsheet className="h-5 w-5" />,
    json: <FileJson className="h-5 w-5" />,
    pdf: <FileText className="h-5 w-5" />,
  };

  return (
    <Link 
      to={`/datasets/${id}`}
      className={cn(
        "block group", 
        featured ? "md:col-span-2" : "",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={cn(
          "relative rounded-2xl overflow-hidden h-full transition-all duration-300",
          "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800",
          "hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-elevation-medium",
          featured ? "flex flex-col md:flex-row" : ""
        )}
      >
        {featured && (
          <div className="absolute top-3 left-3 z-10">
            <ChipBadge variant="info" size="sm">Featured</ChipBadge>
          </div>
        )}
        
        <div 
          className={cn(
            "relative overflow-hidden bg-gray-100 dark:bg-gray-800",
            featured ? "w-full md:w-2/5 aspect-video md:aspect-auto" : "aspect-video"
          )}
        >
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title} 
              className={cn(
                "object-cover w-full h-full transition-transform duration-700",
                isHovered ? "scale-105" : "scale-100"
              )}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <HardDrive className="h-12 w-12 text-blue-300 dark:text-blue-700" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div 
          className={cn(
            "p-5 flex flex-col h-full", 
            featured ? "md:w-3/5" : ""
          )}
        >
          <div className="flex items-start justify-between mb-3">
            <ChipBadge variant="secondary" size="sm">{category}</ChipBadge>
            <span className="flex items-center text-sm font-medium text-amber-500">
              <Star className="h-4 w-4 fill-amber-500 mr-1" />
              {rating.toFixed(1)}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {description}
          </p>
          
          <div className="mt-auto space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <div className="flex items-center mr-3">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{lastUpdated}</span>
                </div>
                <div className="flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  <span>{downloads}+</span>
                </div>
              </div>
              <div className="flex items-center">
                {formatIcons[format]}
                <span className="ml-1 uppercase text-xs font-medium">{format}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xs text-gray-600 dark:text-gray-400">by </span>
                <span className="text-sm font-medium ml-1 flex items-center">
                  {seller.name}
                  {seller.verified && (
                    <span className="ml-1 h-3.5 w-3.5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="h-2 w-2 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </span>
              </div>
              <div className="font-semibold text-blue-600 dark:text-blue-400">
                {price === 0 ? "Free" : `$${price.toFixed(2)}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DatasetCard;
