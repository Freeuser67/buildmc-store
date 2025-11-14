import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { serverIP } = await req.json();
    
    if (!serverIP) {
      throw new Error('Server IP is required');
    }

    console.log('Fetching status for server:', serverIP);

    // Use mcstatus.io API to get Minecraft server status
    const response = await fetch(`https://api.mcstatus.io/v2/status/java/${serverIP}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch server status: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('Server status:', data);

    const result = {
      online: data.online || false,
      players: {
        online: data.players?.online || 0,
        max: data.players?.max || 0,
      },
      version: data.version?.name_clean || 'Unknown',
      motd: data.motd?.clean || '',
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error fetching Minecraft server status:', error);
    return new Response(
      JSON.stringify({ 
        error: error?.message || 'Unknown error',
        online: false,
        players: { online: 0, max: 0 }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
