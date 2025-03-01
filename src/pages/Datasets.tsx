
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatasetGrid } from "@/components/datasets/DatasetGrid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/FileUpload";

interface Dataset {
  id: string;
  title: string;
  description: string;
  price: number;
  format: string;
  thumbnail_url: string | null;
  created_at: string;
  seller: {
    first_name: string;
    last_name: string;
  } | null;
  category: {
    name: string;
  } | null;
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
  const [selectedCategory, setSelectedCategory] = useState<string>("");

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
            seller:seller_id(
              first_name,
              last_name
            ),
            category:category_id(
              name
            )
          `)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching datasets:", error);
        } else {
          setDatasets(data || []);
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
      selectedCategory === "" || 
      dataset.category?.name === selectedCategory;
    
    return matchesSearch && matchesCategory;
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
                <SelectItem value="">All Categories</SelectItem>
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
          <DatasetGrid datasets={filteredDatasets} />
        )}
      </div>
    </div>
  );
};

export default Datasets;
