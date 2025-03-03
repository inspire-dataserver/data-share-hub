
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import SalesChart from "@/components/ui/data-visualization/SalesChart";

interface Dataset {
  id: string;
  title: string;
  price: number;
  created_at: string;
  category: {
    name: string | null;
  } | null;
}

interface Purchase {
  id: string;
  amount: number;
  created_at: string;
  status: string;
  dataset: {
    title: string;
  } | null;
  buyer: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/auth");
          return;
        }
        
        const { data: datasetsData, error: datasetsError } = await supabase
          .from("datasets")
          .select(`
            id,
            title,
            price,
            created_at,
            category:category_id(name)
          `)
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false });
        
        if (datasetsError) {
          console.error("Error fetching datasets:", datasetsError);
          toast({
            title: "Error",
            description: "Failed to load your datasets",
            variant: "destructive",
          });
        } else {
          setDatasets(datasetsData || []);
        }
        
        // Only fetch purchases if there are datasets
        if (datasetsData && datasetsData.length > 0) {
          const { data: purchasesData, error: purchasesError } = await supabase
            .from("purchases")
            .select(`
              id,
              amount,
              created_at,
              status,
              dataset:dataset_id(title),
              buyer:buyer_id(first_name, last_name)
            `)
            .in(
              "dataset_id",
              datasetsData.map(d => d.id)
            )
            .order("created_at", { ascending: false });
          
          if (purchasesError) {
            console.error("Error fetching purchases:", purchasesError);
          } else {
            // Handle potential errors or null values in the buyer field
            const typeSafePurchases = purchasesData?.map(purchase => ({
              ...purchase,
              dataset: purchase.dataset || { title: "Unknown Dataset" },
              buyer: purchase.buyer || { first_name: null, last_name: null }
            })) as Purchase[];
            
            setPurchases(typeSafePurchases || []);
            
            const revenue = typeSafePurchases?.reduce((sum, p) => sum + p.amount, 0) || 0;
            setTotalRevenue(revenue);
            setTotalSales(typeSafePurchases?.length || 0);
          }
        }
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSellerData();
  }, [navigate, toast]);
  
  const monthlySalesData = [
    { name: 'Jan', total: 0 },
    { name: 'Feb', total: 0 },
    { name: 'Mar', total: 0 },
    { name: 'Apr', total: 0 },
    { name: 'May', total: 0 },
    { name: 'Jun', total: 0 },
    { name: 'Jul', total: 0 },
    { name: 'Aug', total: 0 },
    { name: 'Sep', total: 0 },
    { name: 'Oct', total: 0 },
    { name: 'Nov', total: 0 },
    { name: 'Dec', total: 0 },
  ];
  
  purchases.forEach(purchase => {
    const date = new Date(purchase.created_at);
    const month = date.getMonth();
    monthlySalesData[month].total += purchase.amount;
  });
  
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <Button onClick={() => navigate("/upload-dataset")}>
            Upload New Dataset
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <p>Loading dashboard...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Sales
                  </CardTitle>
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSales}</div>
                  <p className="text-xs text-muted-foreground">
                    +12.5% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Datasets
                  </CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{datasets.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {datasets.length > 0 ? "Your datasets are live" : "Upload your first dataset"}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <SalesChart data={monthlySalesData} />
              </CardContent>
            </Card>
            
            <Tabs defaultValue="datasets" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="datasets">Your Datasets</TabsTrigger>
                <TabsTrigger value="sales">Recent Sales</TabsTrigger>
              </TabsList>
              
              <TabsContent value="datasets" className="mt-6">
                {datasets.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <p className="mb-4 text-center text-muted-foreground">
                        You haven't uploaded any datasets yet.
                      </p>
                      <Button onClick={() => navigate("/upload-dataset")}>
                        Upload Your First Dataset
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {datasets.map((dataset) => (
                      <Card key={dataset.id}>
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{dataset.title}</CardTitle>
                            <Badge>${dataset.price.toFixed(2)}</Badge>
                          </div>
                          <CardDescription>
                            Category: {dataset.category?.name || "Uncategorized"}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="p-4 pt-0 flex justify-between">
                          <div className="text-sm text-muted-foreground">
                            Uploaded: {new Date(dataset.created_at).toLocaleDateString()}
                          </div>
                          <Button 
                            variant="outline"
                            onClick={() => navigate(`/dataset/${dataset.id}`)}
                          >
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="sales" className="mt-6">
                {purchases.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <p className="text-center text-muted-foreground">
                        No sales recorded yet. 
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <Card key={purchase.id}>
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{purchase.dataset?.title}</CardTitle>
                            <Badge variant="outline" className="bg-green-50">
                              ${purchase.amount.toFixed(2)}
                            </Badge>
                          </div>
                          <CardDescription>
                            Buyer: {purchase.buyer ? `${purchase.buyer.first_name || ''} ${purchase.buyer.last_name || ''}`.trim() || 'Anonymous' : 'Anonymous'}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="p-4 pt-0">
                          <div className="text-sm text-muted-foreground">
                            Date: {new Date(purchase.created_at).toLocaleDateString()}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
