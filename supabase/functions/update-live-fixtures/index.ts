import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_FOOTBALL_KEY = Deno.env.get('API_FOOTBALL_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

interface ApiFixture {
  fixture: {
    id: number;
    status: {
      short: string;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[update-live-fixtures] Starting fixture update check...');

    if (!API_FOOTBALL_KEY) {
      throw new Error('API_FOOTBALL_KEY is not configured');
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials are not configured');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch fixtures that:
    // 1. Are about to start (within 10 minutes) and still NS
    // 2. Are currently in progress (1H, HT, 2H, ET, P, BT, LIVE)
    const { data: fixtures, error: fetchError } = await supabase
      .from('fixtures')
      .select('id, date_time, status_short')
      .or(`and(date_time.lte.${new Date(Date.now() + 10 * 60 * 1000).toISOString()},status_short.eq.NS),status_short.in.(1H,HT,2H,ET,P,BT,LIVE)`);

    if (fetchError) {
      console.error('[update-live-fixtures] Error fetching fixtures:', fetchError);
      throw fetchError;
    }

    console.log(`[update-live-fixtures] Found ${fixtures?.length || 0} fixtures to check`);

    if (!fixtures || fixtures.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No fixtures to update', updated: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const updatedFixtures: number[] = [];

    // Update each fixture from API-Football
    for (const fixture of fixtures) {
      try {
        console.log(`[update-live-fixtures] Fetching update for fixture ${fixture.id}...`);

        const response = await fetch(
          `https://v3.football.api-sports.io/fixtures?id=${fixture.id}`,
          {
            headers: {
              'x-apisports-key': API_FOOTBALL_KEY,
            },
          }
        );

        if (!response.ok) {
          console.error(`[update-live-fixtures] API error for fixture ${fixture.id}:`, response.status);
          continue;
        }

        const data = await response.json();
        const apiFixture: ApiFixture = data.response?.[0];

        if (!apiFixture) {
          console.log(`[update-live-fixtures] No data returned for fixture ${fixture.id}`);
          continue;
        }

        const newStatus = apiFixture.fixture.status.short;
        const homeScore = apiFixture.goals.home;
        const awayScore = apiFixture.goals.away;

        console.log(`[update-live-fixtures] Fixture ${fixture.id}: ${fixture.status_short} -> ${newStatus}, Score: ${homeScore}-${awayScore}`);

        // Only update if something changed
        if (newStatus !== fixture.status_short || homeScore !== null || awayScore !== null) {
          const { error: updateError } = await supabase
            .from('fixtures')
            .update({
              status_short: newStatus,
              home_score: homeScore,
              away_score: awayScore,
              updated_at: new Date().toISOString(),
            })
            .eq('id', fixture.id);

          if (updateError) {
            console.error(`[update-live-fixtures] Error updating fixture ${fixture.id}:`, updateError);
          } else {
            console.log(`[update-live-fixtures] Successfully updated fixture ${fixture.id}`);
            updatedFixtures.push(fixture.id);

            // Log when predictions get blocked
            if (fixture.status_short === 'NS' && newStatus !== 'NS') {
              console.log(`[update-live-fixtures] ⚠️ Predictions BLOCKED for fixture ${fixture.id} (status changed from NS to ${newStatus})`);
            }
          }
        }
      } catch (fixtureError) {
        console.error(`[update-live-fixtures] Error processing fixture ${fixture.id}:`, fixtureError);
      }
    }

    console.log(`[update-live-fixtures] Completed. Updated ${updatedFixtures.length} fixtures`);

    return new Response(
      JSON.stringify({ 
        message: 'Fixtures updated successfully',
        checked: fixtures.length,
        updated: updatedFixtures.length,
        updatedIds: updatedFixtures
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[update-live-fixtures] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
