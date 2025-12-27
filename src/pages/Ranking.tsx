import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";
import { Trophy, Medal, Target, Crosshair } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
}

interface LeaderboardEntry {
  id: string;
  user_id: string;
  total_points: number;
  correct_winners: number;
  exact_scores: number;
  profile?: Profile;
}

const Ranking = () => {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      // Fetch leaderboard
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from("leaderboard")
        .select("*")
        .order("total_points", { ascending: false })
        .limit(50);

      if (leaderboardError) throw leaderboardError;
      if (!leaderboardData || leaderboardData.length === 0) return [];

      // Get unique user IDs
      const userIds = leaderboardData.map(entry => entry.user_id);

      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Map profiles to leaderboard entries
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      return leaderboardData.map(entry => ({
        ...entry,
        profile: profileMap.get(entry.user_id)
      })) as LeaderboardEntry[];
    },
  });

  const getRankStyle = (index: number) => {
    if (index === 0) return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/50";
    if (index === 1) return "bg-gradient-to-r from-slate-400/20 to-slate-500/10 border-slate-400/50";
    if (index === 2) return "bg-gradient-to-r from-amber-700/20 to-amber-800/10 border-amber-700/50";
    return "bg-card border-border/50";
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-slate-400" />;
    if (index === 2) return <Medal className="w-6 h-6 text-amber-700" />;
    return <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">{index + 1}</span>;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border/50 px-4 py-4">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">Ranking</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto px-4 py-4 pb-24">
        {/* Stats Legend */}
        <div className="flex items-center justify-center gap-6 mb-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-green-500" />
            <span>Vencedor: 10 pts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Crosshair className="w-4 h-4 text-primary" />
            <span>Exato: 25 pts</span>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="space-y-2">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border bg-card">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))
          ) : leaderboard && leaderboard.length > 0 ? (
            leaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${getRankStyle(index)}`}
              >
                {/* Rank */}
                <div className="flex-shrink-0">
                  {getRankIcon(index)}
                </div>

                {/* Avatar */}
                <Avatar className="w-10 h-10 border-2 border-border">
                  <AvatarImage src={entry.profile?.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {entry.profile?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                {/* Name & Stats */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">
                    {entry.profile?.full_name || entry.profile?.username || "Usuário"}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3 text-green-500" />
                      {entry.correct_winners}
                    </span>
                    <span className="flex items-center gap-1">
                      <Crosshair className="w-3 h-3 text-primary" />
                      {entry.exact_scores}
                    </span>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className="font-bold text-lg text-primary">{entry.total_points}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">pts</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Trophy className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Nenhum ranking ainda</p>
              <p className="text-sm text-muted-foreground/70">
                Faça palpites para aparecer aqui!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0">
        <BottomNav />
      </div>
    </div>
  );
};

export default Ranking;
