
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DatasetGrid from "@/components/datasets/DatasetGrid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Dataset {
  id: string;
  title: string;
  description: string;
  price: number;
  format: string;
  thumbnail_url: string | null;
  created_at: string;
  seller: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  category: {
    name: string | null;
  } | null;
}

// Adding the required properties for DatasetCardProps
interface DatasetCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  format: "json" | "csv" | "pdf" | "excel";
  thumbnail_url: string | null;
  created_at: string;
  rating?: number;
  downloads?: number;
  lastUpdated?: string;
  seller?: {
    name: string;
    verified: boolean;
  };
  category?: string;
}

interface Category {
  id: string;
  name: string;
}

const Datasets = () => {
  const navigate = useNavigate();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*")
          .order("name");

        if (categoriesError) {
          console.error("Error fetching categories:", categoriesError);
        } else {
          setCategories(categoriesData || []);
        }

        // Fetch datasets with joined seller profile and category
        const { data, error } = await supabase
          .from("datasets")
          .select(`
            *,
            seller:profiles(
              first_name,
              last_name
            ),
            category:categories(
              name
            )
          `)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching datasets:", error);
        } else {
          // Handle potential null values in nested objects
          const typeSafeData = data?.map(item => ({
            ...item,
            seller: item.seller || { first_name: null, last_name: null },
            category: item.category || { name: null }
          })) as Dataset[];
          
          setDatasets(typeSafeData || []);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter datasets based on search term and category
  const filteredDatasets = datasets.filter((dataset) => {
    const matchesSearch = 
      dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "all" || 
      dataset.category?.name === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Transform datasets to match DatasetCardProps
  const datasetCards = filteredDatasets.map(dataset => {
    // Convert format to acceptable type
    const formatAsType = (format: string): "json" | "csv" | "pdf" | "excel" => {
      const normalizedFormat = format.toLowerCase();
      if (normalizedFormat === "json" || normalizedFormat === "csv" || normalizedFormat === "pdf" || normalizedFormat === "excel") {
        return normalizedFormat as "json" | "csv" | "pdf" | "excel";
      }
      // Default to a safe format if it's not a recognized one
      return "csv";
    };
    
    return {
      id: dataset.id,
      title: dataset.title,
      description: dataset.description,
      price: dataset.price,
      format: formatAsType(dataset.format),
      thumbnail_url: dataset.thumbnail_url,
      created_at: dataset.created_at,
      rating: 4.5, // Default rating for now
      downloads: 100, // Default downloads for now
      lastUpdated: new Date(dataset.created_at).toLocaleDateString(),
      // Use category name as a string
      category: dataset.category?.name || "Uncategorized",
      // Also ensure seller is properly formatted
      seller: {
        name: `${dataset.seller?.first_name || ''} ${dataset.seller?.last_name || ''}`.trim() || 'Unknown',
        verified: true // Default to verified for now
      }
    };
  });

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Explore Datasets</h1>
          <Button onClick={() => navigate("/upload-dataset")}>
            Upload Dataset
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              type="search"
              placeholder="Search datasets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <p>Loading datasets...</p>
          </div>
        ) : (
          <DatasetGrid datasets={datasetCards} />
        )}
      </div>
    </div>
  );
};

export default Datasets;
