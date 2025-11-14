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

    // Retry logic with exponential backoff
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch(`https://api.mcstatus.io/v2/status/java/${serverIP}`, {
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });
        
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
      } catch (error) {
        lastError = error;
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }
    
    throw lastError;
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
