
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

// This edge function will run with service_role privileges which bypasses RLS
serve(async (req) => {
  try {
    // Create a Supabase client with the Admin API key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the request body
    const { user_id } = await req.json()

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Insert the seller role for the user
    const { data, error } = await supabaseAdmin
      .from('user_roles')
      .insert({ user_id, role: 'seller' })
      .select()

    if (error) {
      // Check if it's a duplicate constraint error (user already has role)
      if (error.code === '23505') {
        return new Response(
          JSON.stringify({ message: 'User is already a seller' }),
          { headers: { 'Content-Type': 'application/json' }, status: 200 }
        )
      }

      console.error('Error assigning seller role:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
