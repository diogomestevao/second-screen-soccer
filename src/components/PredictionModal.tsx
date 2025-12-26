import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface PredictionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  homeTeamName: string;
  homeTeamLogo: string;
  awayTeamName: string;
  awayTeamLogo: string;
  fixtureId: number;
  existingHomeScore?: number | null;
  existingAwayScore?: number | null;
  onSave: (fixtureId: number, homeScore: number, awayScore: number) => Promise<void>;
}

const PredictionModal = ({
  open,
  onOpenChange,
  homeTeamName,
  homeTeamLogo,
  awayTeamName,
  awayTeamLogo,
  fixtureId,
  existingHomeScore,
  existingAwayScore,
  onSave,
}: PredictionModalProps) => {
  const [homeScore, setHomeScore] = useState<string>(existingHomeScore?.toString() ?? '0');
  const [awayScore, setAwayScore] = useState<string>(existingAwayScore?.toString() ?? '0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    const home = parseInt(homeScore, 10);
    const away = parseInt(awayScore, 10);

    if (isNaN(home) || isNaN(away) || home < 0 || away < 0) {
      setError('Digite um placar válido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSave(fixtureId, home, away);
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar palpite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Fazer Palpite</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between gap-4 py-4">
          {/* Home Team */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <img src={homeTeamLogo} alt={homeTeamName} className="w-12 h-12 object-contain" />
            <span className="text-xs font-medium text-foreground text-center truncate w-full">
              {homeTeamName}
            </span>
          </div>

          {/* Score Inputs */}
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max="99"
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value)}
              className="w-14 text-center text-lg font-bold"
              placeholder="0"
            />
            <span className="text-lg text-muted-foreground">:</span>
            <Input
              type="number"
              min="0"
              max="99"
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
              className="w-14 text-center text-lg font-bold"
              placeholder="0"
            />
          </div>

          {/* Away Team */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <img src={awayTeamLogo} alt={awayTeamName} className="w-12 h-12 object-contain" />
            <span className="text-xs font-medium text-foreground text-center truncate w-full">
              {awayTeamName}
            </span>
          </div>
        </div>

        {error && (
          <p className="text-destructive text-sm text-center">{error}</p>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Salvar Palpite'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PredictionModal;
