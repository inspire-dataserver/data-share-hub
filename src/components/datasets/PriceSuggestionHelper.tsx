
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Info, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PriceSuggestionHelperProps {
  title: string;
  description: string;
  format: string;
  category: string;
  onPriceSuggested: (price: number) => void;
}

const PriceSuggestionHelper = ({
  title,
  description,
  format,
  category,
  onPriceSuggested,
}: PriceSuggestionHelperProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const getSuggestedPrice = async () => {
    if (!format || !category) {
      toast({
        title: "Missing information",
        description: "Please select a format and category first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("suggest-price", {
        body: { title, description, format, category },
      });

      if (error) {
        throw error;
      }

      if (data && data.suggestedPrice) {
        onPriceSuggested(data.suggestedPrice);
        toast({
          title: "Price suggestion",
          description: `Suggested price: $${data.suggestedPrice.toFixed(2)}`,
        });
      }
    } catch (error) {
      console.error("Error getting price suggestion:", error);
      toast({
        title: "Suggestion failed",
        description: "Could not generate a price suggestion",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={getSuggestedPrice}
        disabled={isLoading || !format || !category}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : null}
        Suggest price
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="w-[200px] text-xs">
              This will suggest a price based on similar datasets in our marketplace
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default PriceSuggestionHelper;
