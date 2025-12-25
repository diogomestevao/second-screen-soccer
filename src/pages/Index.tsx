import BottomNav from '@/components/BottomNav';

const Index = () => {
  return (
    <div className="h-screen h-[100dvh] flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0">
        <div className="px-4 py-2 flex items-center justify-center border-b border-border/50">
          <h1 className="font-display text-2xl tracking-wider text-primary">
            2S<span className="text-accent">FUT</span>
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center min-h-0 overflow-hidden px-4">
        <h2 className="text-xl font-semibold text-foreground mb-2">Bem-vindo ao 2SFUT</h2>
        <p className="text-muted-foreground text-center">
          Acompanhe partidas ao vivo no menu Live
        </p>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
