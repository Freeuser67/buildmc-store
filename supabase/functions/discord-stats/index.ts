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
    const { serverId } = await req.json();
    
    if (!serverId) {
      throw new Error('Discord server ID is required');
    }

    console.log('Fetching Discord stats for server:', serverId);

    // Use Discord Widget API (no auth required)
    const response = await fetch(`https://discord.com/api/guilds/${serverId}/widget.json`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Discord API error:', response.statusText);
      throw new Error(`Failed to fetch Discord stats: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Discord stats:', data);

    const result = {
      memberCount: data.presence_count || 0,
      name: data.name || 'Unknown',
      instantInvite: data.instant_invite || null,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error fetching Discord stats:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        memberCount: 0,
        name: 'Unknown',
        instantInvite: null
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
