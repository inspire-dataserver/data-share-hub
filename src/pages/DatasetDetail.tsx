
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, DollarSign, Calendar, User, Tag } from "lucide-react";

interface Dataset {
  id: string;
  title: string;
  description: string;
  price: number;
  seller_id: string;
  category_id: string;
  format: string;
  sample_url: string | null;
  file_url: string;
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

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    first_name: string;
    last_name: string;
  } | null;
}

const DatasetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadDataset() {
      try {
        // Get dataset details
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
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching dataset:", error);
          toast({
            title: "Error",
            description: "Could not load dataset details",
            variant: "destructive",
          });
          navigate("/datasets");
        } else {
          setDataset(data);
        }

        // Get reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select(`
            *,
            user:user_id(
              first_name,
              last_name
            )
          `)
          .eq("dataset_id", id)
          .order("created_at", { ascending: false });

        if (reviewsError) {
          console.error("Error fetching reviews:", reviewsError);
        } else {
          setReviews(reviewsData);
        }

        // Check if user has purchased this dataset
        if (user) {
          const { data: purchaseData, error: purchaseError } = await supabase
            .from("purchases")
            .select("*")
            .eq("dataset_id", id)
            .eq("buyer_id", user.id)
            .single();

          if (!purchaseError && purchaseData) {
            setIsPurchased(true);
          }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDataset();
  }, [id, navigate, toast, user]);

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase this dataset",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!dataset) return;

    setIsPurchasing(true);
    try {
      // Create a purchase record
      const { error } = await supabase
        .from("purchases")
        .insert({
          dataset_id: dataset.id,
          buyer_id: user.id,
          amount: dataset.price,
          status: "completed",
        });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already purchased",
            description: "You have already purchased this dataset",
          });
          setIsPurchased(true);
        } else {
          toast({
            title: "Purchase failed",
            description: error.message,
            variant: "destructive",
          });
          console.error(error);
        }
      } else {
        toast({
          title: "Purchase successful",
          description: "You now have access to this dataset",
        });
        setIsPurchased(true);
      }
    } catch (error) {
      console.error("Error during purchase:", error);
      toast({
        title: "Purchase failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleDownload = async () => {
    if (!dataset || !isPurchased) return;

    try {
      // Get download URL (in a real app, you would get this from your storage)
      toast({
        title: "Downloading",
        description: "Your dataset is being prepared for download",
      });
      
      // Simulate download delay
      setTimeout(() => {
        toast({
          title: "Download complete",
          description: "Your dataset has been downloaded",
        });
      }, 2000);
    } catch (error) {
      console.error("Error downloading dataset:", error);
      toast({
        title: "Download failed",
        description: "An error occurred while downloading the dataset",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center min-h-[300px]">
          <p>Loading dataset details...</p>
        </div>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Dataset not found</h2>
          <p className="mt-2">The dataset you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-4" onClick={() => navigate("/datasets")}>
            Back to Datasets
          </Button>
        </div>
      </div>
    );
  }

  // Format date
  const formattedDate = new Date(dataset.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container py-10">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => navigate("/datasets")}
      >
        Back to Datasets
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{dataset.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
              <span className="mx-2">•</span>
              <FileText className="h-4 w-4" />
              <span>{dataset.format.toUpperCase()}</span>
              {dataset.category && (
                <>
                  <span className="mx-2">•</span>
                  <Tag className="h-4 w-4" />
                  <span>{dataset.category.name}</span>
                </>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="whitespace-pre-line">{dataset.description}</p>
          </div>

          {reviews.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Reviews</h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold">
                          {review.user
                            ? `${review.user.first_name} ${review.user.last_name}`
                            : "Anonymous User"}
                        </div>
                        <div className="flex items-center">
                          <span className="text-amber-500 font-semibold mr-1">
                            {review.rating}
                          </span>
                          <span className="text-amber-500">★</span>
                        </div>
                      </div>
                      <p>{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <div className="text-3xl font-bold mb-2">
                  ${dataset.price.toFixed(2)}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <User className="h-4 w-4 mr-2" />
                  {dataset.seller
                    ? `${dataset.seller.first_name} ${dataset.seller.last_name}`
                    : "Unknown Seller"}
                </div>
              </div>

              <div className="space-y-2">
                {isPurchased ? (
                  <Button 
                    className="w-full" 
                    onClick={handleDownload}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Dataset
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={handlePurchase}
                    disabled={isPurchasing}
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    {isPurchasing ? "Processing..." : "Purchase Dataset"}
                  </Button>
                )}

                {dataset.sample_url && (
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Download Sample
                  </Button>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Dataset Details</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Format</span>
                    <span className="font-medium">{dataset.format.toUpperCase()}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{dataset.category?.name || "Uncategorized"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Listed on</span>
                    <span className="font-medium">{formattedDate}</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DatasetDetail;
