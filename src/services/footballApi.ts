import { supabase } from "@/integrations/supabase/client";

interface ApiResponse<T> {
  get: string;
  parameters: Record<string, string>;
  errors: string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: T;
}

// Generic function to call the football API
async function callFootballApi<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
  const { data, error } = await supabase.functions.invoke('football-api', {
    body: { endpoint, params },
  });

  if (error) {
    console.error('Football API error:', error);
    throw new Error(error.message);
  }

  return data as ApiResponse<T>;
}

// Fixtures/Matches
export interface Fixture {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    periods: {
      first: number | null;
      second: number | null;
    };
    venue: {
      id: number | null;
      name: string | null;
      city: string | null;
    };
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    round: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
}

export interface FixtureEvent {
  time: {
    elapsed: number;
    extra: number | null;
  };
  team: {
    id: number;
    name: string;
    logo: string;
  };
  player: {
    id: number;
    name: string;
  };
  assist: {
    id: number | null;
    name: string | null;
  };
  type: string;
  detail: string;
  comments: string | null;
}

export interface FixtureLineup {
  team: {
    id: number;
    name: string;
    logo: string;
    colors: {
      player: { primary: string; number: string; border: string };
      goalkeeper: { primary: string; number: string; border: string };
    } | null;
  };
  formation: string;
  startXI: Array<{
    player: {
      id: number;
      name: string;
      number: number;
      pos: string;
      grid: string | null;
    };
  }>;
  substitutes: Array<{
    player: {
      id: number;
      name: string;
      number: number;
      pos: string;
      grid: string | null;
    };
  }>;
  coach: {
    id: number;
    name: string;
    photo: string;
  };
}

// API Methods
export const footballApi = {
  // Get live fixtures
  getLiveFixtures: () => 
    callFootballApi<Fixture[]>('/fixtures', { live: 'all' }),

  // Get fixtures by date
  getFixturesByDate: (date: string) => 
    callFootballApi<Fixture[]>('/fixtures', { date }),

  // Get fixture by ID
  getFixtureById: (id: number) => 
    callFootballApi<Fixture[]>('/fixtures', { id: id.toString() }),

  // Get fixture events (goals, cards, substitutions)
  getFixtureEvents: (fixtureId: number) => 
    callFootballApi<FixtureEvent[]>('/fixtures/events', { fixture: fixtureId.toString() }),

  // Get fixture lineups
  getFixtureLineups: (fixtureId: number) => 
    callFootballApi<FixtureLineup[]>('/fixtures/lineups', { fixture: fixtureId.toString() }),

  // Get fixtures by league and season
  getFixturesByLeague: (leagueId: number, season: number) => 
    callFootballApi<Fixture[]>('/fixtures', { 
      league: leagueId.toString(), 
      season: season.toString() 
    }),

  // Get today's fixtures
  getTodayFixtures: () => {
    const today = new Date().toISOString().split('T')[0];
    return callFootballApi<Fixture[]>('/fixtures', { date: today });
  },
};
