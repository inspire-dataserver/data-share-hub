
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import PaymentService from "@/services/PaymentService";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Dataset {
  id: string;
  title: string;
  price: number;
  file_url: string;
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const purchaseId = searchParams.get("purchaseId");
  const datasetId = searchParams.get("datasetId");

  useEffect(() => {
    const completePaymentProcess = async () => {
      if (!purchaseId || !datasetId) {
        navigate("/datasets");
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Complete the payment
        await PaymentService.completePayment(purchaseId);
        
        // Fetch dataset details
        const { data, error } = await supabase
          .from("datasets")
          .select("id, title, price, file_url")
          .eq("id", datasetId)
          .single();
          
        if (error) {
          console.error("Error fetching dataset:", error);
          toast({
            title: "Error",
            description: "Could not fetch dataset details",
            variant: "destructive",
          });
          return;
        }
        
        setDataset(data as Dataset);
        
        // Add notification for the user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from("notifications")
            .insert({
              user_id: user.id,
              message: `Your purchase of "${data.title}" is complete. You can now download the dataset.`,
              type: "info",
              read: false
            });
        }
      } catch (error) {
        console.error("Error processing payment:", error);
        toast({
          title: "Error",
          description: "There was an error completing your purchase",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    completePaymentProcess();
  }, [purchaseId, datasetId, navigate, toast]);
  
  const handleDownload = () => {
    if (dataset?.file_url) {
      window.open(dataset.file_url, '_blank');
    }
  };

  return (
    <div className="container max-w-md py-16">
      <Card className="w-full">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for your purchase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground">Processing your payment...</p>
          ) : dataset ? (
            <>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Dataset:</span>
                <span>{dataset.title}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Amount:</span>
                <span>${dataset.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Order ID:</span>
                <span className="text-muted-foreground">{purchaseId?.substring(0, 8)}...</span>
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground">Could not load dataset details</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button 
            className="w-full" 
            disabled={isLoading || !dataset}
            onClick={handleDownload}
          >
            Download Dataset
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/datasets")}
          >
            Browse More Datasets
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
