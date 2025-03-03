
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description, format, category } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get average dataset prices by format and category
    const { data: formatPrices, error: formatError } = await supabase
      .from('datasets')
      .select('format, price')
      .eq('format', format);
    
    const { data: categoryPrices, error: categoryError } = await supabase
      .from('datasets')
      .select('category_id, price')
      .eq('category_id', category);

    if (formatError || categoryError) {
      console.error('Database query error:', formatError || categoryError);
      return new Response(
        JSON.stringify({ error: 'Failed to query price data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Simple price suggestion logic
    // In a real app, this would use a more sophisticated algorithm
    let suggestedPrice = 9.99; // Default price

    // Adjust based on format
    if (formatPrices && formatPrices.length > 0) {
      const avgFormatPrice = formatPrices.reduce((sum, item) => sum + Number(item.price), 0) / formatPrices.length;
      suggestedPrice = (suggestedPrice + avgFormatPrice) / 2;
    }

    // Adjust based on category
    if (categoryPrices && categoryPrices.length > 0) {
      const avgCategoryPrice = categoryPrices.reduce((sum, item) => sum + Number(item.price), 0) / categoryPrices.length;
      suggestedPrice = (suggestedPrice + avgCategoryPrice) / 2;
    }

    // Adjust based on title and description length
    // Longer descriptions might indicate more comprehensive datasets
    const contentLength = (title?.length || 0) + (description?.length || 0);
    if (contentLength > 500) {
      suggestedPrice *= 1.2;
    } else if (contentLength > 200) {
      suggestedPrice *= 1.1;
    }

    // Round to 2 decimal places
    suggestedPrice = Math.round(suggestedPrice * 100) / 100;

    // Return the suggested price
    return new Response(
      JSON.stringify({ 
        suggestedPrice, 
        factors: {
          formatFactor: format,
          categoryFactor: category,
          contentLength
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in suggest-price function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
