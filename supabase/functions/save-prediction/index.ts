import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PredictionPayload {
  fixture_id: number;
  home_score: number;
  away_score: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Client with user's auth token
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Usuário não autenticado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload: PredictionPayload = await req.json();
    const { fixture_id, home_score, away_score } = payload;

    // Validate input
    if (typeof fixture_id !== 'number' || typeof home_score !== 'number' || typeof away_score !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Dados inválidos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (home_score < 0 || away_score < 0) {
      return new Response(
        JSON.stringify({ error: 'Placar não pode ser negativo' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check fixture status using service role to bypass RLS
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: fixture, error: fixtureError } = await supabaseAdmin
      .from('fixtures')
      .select('status_short')
      .eq('id', fixture_id)
      .maybeSingle();

    if (fixtureError) {
      console.error('Error fetching fixture:', fixtureError);
      return new Response(
        JSON.stringify({ error: 'Erro ao verificar partida' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!fixture) {
      return new Response(
        JSON.stringify({ error: 'Partida não encontrada' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (fixture.status_short !== 'NS') {
      return new Response(
        JSON.stringify({ error: 'As apostas já fecharam!' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Upsert prediction (user client for RLS)
    const { data: prediction, error: predictionError } = await supabase
      .from('predictions')
      .upsert({
        user_id: user.id,
        fixture_id,
        home_score,
        away_score,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,fixture_id'
      })
      .select()
      .single();

    if (predictionError) {
      console.error('Error saving prediction:', predictionError);
      return new Response(
        JSON.stringify({ error: 'Erro ao salvar palpite' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Prediction saved: user=${user.id}, fixture=${fixture_id}, score=${home_score}x${away_score}`);

    return new Response(
      JSON.stringify({ success: true, prediction }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
