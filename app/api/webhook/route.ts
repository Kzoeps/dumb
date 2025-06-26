import { NextRequest } from "next/server";
import { supabaseServer } from "@/app/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Webhook body:', body);

    const { search_params, ...user_details } = body;
    const sessionId = search_params.sessionId;
    
    if (!sessionId) {
      return new Response("Session ID is required", { status: 400 });
    }
    
    // Fetch the session from Supabase
    const { data: session, error: fetchError } = await supabaseServer
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (fetchError || !session) {
      console.error('Session not found:', fetchError);
      return new Response("Session not found", { status: 404 });
    }
    
    // Update the session with verification and user details
    const { error: updateError } = await supabaseServer
      .from('sessions')
      .update({
        verified: true,
        user_details: user_details,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);
    
    if (updateError) {
      console.error('Failed to update session:', updateError);
      return new Response("Failed to update session", { status: 500 });
    }
    
    console.log(`Session ${sessionId} verified successfully`);
    return new Response("Credential Verified", { status: 200 });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
