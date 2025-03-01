
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
}

const UploadDataset = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [hasSellerRole, setHasSellerRole] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [format, setFormat] = useState("csv");
  const [file, setFile] = useState<File | null>(null);
  const [sample, setSample] = useState<File | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    async function checkSellerRole() {
      try {
        // Check if user has seller role
        const { data, error } = await supabase
          .from("user_roles")
          .select("*")
          .eq("user_id", user.id)
          .eq("role", "seller")
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error checking seller role:", error);
        } else {
          setHasSellerRole(!!data);
        }

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
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkSellerRole();
  }, [user, navigate]);

  const handleBecomeSeller = async () => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: user!.id, role: "seller" });
      
      if (error) {
        toast({
          title: "Error",
          description: "Could not update your role. Please try again.",
          variant: "destructive",
        });
        console.error(error);
      } else {
        toast({
          title: "Success",
          description: "You are now a seller on DataHubX!",
        });
        setHasSellerRole(true);
      }
    } catch (error) {
      console.error("Error becoming seller:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSampleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSample(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !file) return;

    setIsSubmitting(true);
    try {
      // Validate
      if (!title || !description || !price || !category || !format) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Upload main file
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("datasets")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: fileData } = supabase.storage
        .from("datasets")
        .getPublicUrl(filePath);

      // Upload sample if provided
      let sampleUrl = null;
      if (sample) {
        const sampleExt = sample.name.split(".").pop();
        const sampleName = `sample_${Math.random().toString(36).substring(2, 15)}.${sampleExt}`;
        const samplePath = `${user.id}/samples/${sampleName}`;

        const { error: sampleUploadError } = await supabase.storage
          .from("datasets")
          .upload(samplePath, sample);

        if (sampleUploadError) {
          console.error("Error uploading sample:", sampleUploadError);
        } else {
          const { data: sampleData } = supabase.storage
            .from("datasets")
            .getPublicUrl(samplePath);
          
          sampleUrl = sampleData.publicUrl;
        }
      }

      // Create dataset record
      const { data: dataset, error: datasetError } = await supabase
        .from("datasets")
        .insert({
          title,
          description,
          price: parseFloat(price),
          seller_id: user.id,
          category_id: category,
          format,
          sample_url: sampleUrl,
          file_url: fileData.publicUrl,
          thumbnail_url: null,
        })
        .select()
        .single();

      if (datasetError) {
        throw datasetError;
      }

      toast({
        title: "Dataset uploaded",
        description: "Your dataset has been successfully uploaded.",
      });

      navigate(`/dataset/${dataset.id}`);
    } catch (error) {
      console.error("Error uploading dataset:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your dataset.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center min-h-[300px]">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasSellerRole) {
    return (
      <div className="container py-10">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Become a Seller</h1>
          <Card>
            <CardHeader>
              <CardTitle>Start Selling Datasets</CardTitle>
              <CardDescription>
                To upload and sell datasets, you need to become a seller first.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                As a seller, you can upload datasets, set prices, and earn money when others purchase your data.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={handleBecomeSeller} disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Become a Seller"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Upload New Dataset</h1>
        
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Dataset Details</CardTitle>
              <CardDescription>
                Fill in the details about your dataset. Be descriptive to help potential buyers understand its value.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title for your dataset"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your dataset, its contents, and potential use cases"
                  rows={6}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="9.99"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <Select value={format} onValueChange={setFormat} required>
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select file format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file">Dataset File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Upload the complete dataset file that buyers will receive
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sample">Sample File (Optional)</Label>
                <Input
                  id="sample"
                  type="file"
                  onChange={handleSampleChange}
                />
                <p className="text-sm text-muted-foreground">
                  Provide a sample that potential buyers can preview before purchasing
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/datasets")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Uploading..." : "Upload Dataset"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default UploadDataset;
