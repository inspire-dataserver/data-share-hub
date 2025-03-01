
import { supabase } from "@/integrations/supabase/client";

export interface PaymentIntentData {
  datasetId: string;
  price: number;
  title: string;
  sellerId: string;
}

export interface CheckoutSession {
  id: string;
  url: string;
}

const createPaymentIntent = async (data: PaymentIntentData): Promise<CheckoutSession> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("You must be logged in to make a purchase");
    }

    // In a real implementation, this would call a Supabase Edge Function that creates
    // a Stripe payment intent and returns the checkout URL
    // For now, we'll simulate this with a direct database entry
    
    const { data: purchase, error } = await supabase
      .from("purchases")
      .insert({
        buyer_id: user.id,
        dataset_id: data.datasetId,
        amount: data.price,
        status: "pending"
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating purchase:", error);
      throw new Error("Failed to create purchase record");
    }
    
    // Create notification for the seller
    await supabase
      .from("notifications")
      .insert({
        user_id: data.sellerId,
        message: `New purchase of "${data.title}" for $${data.price}`,
        type: "success",
        read: false
      });
      
    // In a real implementation, this would return Stripe checkout session URL
    // For demo purposes, we'll just return a mock URL
    return {
      id: purchase.id,
      url: `/payment-success?purchaseId=${purchase.id}&datasetId=${data.datasetId}`
    };
  } catch (error) {
    console.error("Payment service error:", error);
    throw error;
  }
};

const completePayment = async (purchaseId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("purchases")
      .update({ status: "completed" })
      .eq("id", purchaseId);
    
    if (error) {
      console.error("Error completing purchase:", error);
      throw new Error("Failed to complete the purchase");
    }
  } catch (error) {
    console.error("Payment service error:", error);
    throw error;
  }
};

export const PaymentService = {
  createPaymentIntent,
  completePayment
};

export default PaymentService;
