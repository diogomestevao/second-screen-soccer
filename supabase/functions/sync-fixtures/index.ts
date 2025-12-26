import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_FOOTBALL_KEY = Deno.env.get('API_FOOTBALL_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const API_BASE_URL = 'https://v3.football.api-sports.io';

interface ApiFixture {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
    };
  };
  league: {
    id: number;
    round: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
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
    if (!API_FOOTBALL_KEY) {
      throw new Error('API_FOOTBALL_KEY not configured');
    }

    // Create Supabase client with service role for write access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch next 3 fixtures for Palmeiras (team 121) - season 2026
    const url = `${API_BASE_URL}/fixtures?team=121&season=2026&next=3&timezone=America/Sao_Paulo`;
    
    console.log(`Fetching fixtures from: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-apisports-key': API_FOOTBALL_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    const fixtures: ApiFixture[] = data.response || [];

    console.log(`Received ${fixtures.length} fixtures from API`);

    if (fixtures.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No fixtures to sync',
        synced: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Transform and upsert fixtures
    const fixturesData = fixtures.map((f) => ({
      id: f.fixture.id,
      date_time: f.fixture.date,
      status_short: f.fixture.status.short,
      home_team_id: f.teams.home.id,
      home_team_name: f.teams.home.name,
      home_team_logo: f.teams.home.logo,
      away_team_id: f.teams.away.id,
      away_team_name: f.teams.away.name,
      away_team_logo: f.teams.away.logo,
      league_id: f.league.id,
      round: f.league.round,
      home_score: f.goals.home,
      away_score: f.goals.away,
      processed: false,
      updated_at: new Date().toISOString(),
    }));

    console.log(`Upserting ${fixturesData.length} fixtures to database`);

    const { error } = await supabase
      .from('fixtures')
      .upsert(fixturesData, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      });

    if (error) {
      console.error('Database upsert error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log(`Successfully synced ${fixturesData.length} fixtures`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Synced ${fixturesData.length} fixtures`,
      synced: fixturesData.length,
      fixtures: fixturesData.map(f => ({ id: f.id, home: f.home_team_name, away: f.away_team_name }))
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in sync-fixtures function:', errorMessage);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
