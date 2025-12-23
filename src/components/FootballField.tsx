import Player from './Player';

// Jogadores do Palmeiras - Formação 4-3-3 (meio campo superior)
const players = [
  // Goleiro
  { id: 1, name: 'Weverton', number: 21, position: { x: 50, y: 85 } },
  
  // Defesa (4)
  { id: 2, name: 'Marcos Rocha', number: 2, position: { x: 85, y: 70 } },
  { id: 3, name: 'Gustavo Gómez', number: 15, position: { x: 65, y: 72 } },
  { id: 4, name: 'Murilo', number: 26, position: { x: 35, y: 72 } },
  { id: 5, name: 'Piquerez', number: 22, position: { x: 15, y: 70 } },
  
  // Meio-campo (3)
  { id: 6, name: 'Aníbal Moreno', number: 5, position: { x: 50, y: 50 } },
  { id: 7, name: 'Zé Rafael', number: 8, position: { x: 75, y: 42 } },
  { id: 8, name: 'Raphael Veiga', number: 23, position: { x: 25, y: 42 } },
  
  // Ataque (3)
  { id: 9, name: 'Estêvão', number: 41, position: { x: 80, y: 22 } },
  { id: 10, name: 'Flaco López', number: 42, position: { x: 50, y: 15 } },
  { id: 11, name: 'Dudu', number: 7, position: { x: 20, y: 22 } },
];

const FootballField = () => {
  return (
    <div className="relative w-full h-full field-pattern overflow-hidden">
      {/* Half field lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Outer boundary - half field */}
        <rect
          x="2"
          y="2"
          width="96"
          height="96"
          fill="none"
          stroke="hsl(0 0% 98% / 0.4)"
          strokeWidth="0.3"
        />
        
        {/* Bottom line (center line of full field) */}
        <line
          x1="2"
          y1="98"
          x2="98"
          y2="98"
          stroke="hsl(0 0% 98% / 0.4)"
          strokeWidth="0.3"
        />
        
        {/* Center circle arc (half) */}
        <path
          d="M 38 98 A 12 12 0 0 1 62 98"
          fill="none"
          stroke="hsl(0 0% 98% / 0.4)"
          strokeWidth="0.3"
        />
        
        {/* Top penalty area */}
        <rect
          x="22"
          y="2"
          width="56"
          height="22"
          fill="none"
          stroke="hsl(0 0% 98% / 0.4)"
          strokeWidth="0.3"
        />
        
        {/* Top goal area */}
        <rect
          x="35"
          y="2"
          width="30"
          height="8"
          fill="none"
          stroke="hsl(0 0% 98% / 0.4)"
          strokeWidth="0.3"
        />
        
        {/* Top penalty arc */}
        <path
          d="M 38 24 Q 50 32 62 24"
          fill="none"
          stroke="hsl(0 0% 98% / 0.4)"
          strokeWidth="0.3"
        />
        
        {/* Top penalty spot */}
        <circle cx="50" cy="16" r="0.6" fill="hsl(0 0% 98% / 0.4)" />
        
        {/* Corner arcs */}
        <path d="M 2 6 Q 6 2 10 2" fill="none" stroke="hsl(0 0% 98% / 0.4)" strokeWidth="0.3" />
        <path d="M 90 2 Q 94 2 98 6" fill="none" stroke="hsl(0 0% 98% / 0.4)" strokeWidth="0.3" />
      </svg>

      {/* Players */}
      {players.map((player) => (
        <Player
          key={player.id}
          id={player.id}
          name={player.name}
          number={player.number}
          position={player.position}
        />
      ))}

      {/* Coach */}
      <Player
        id={0}
        name="Abel Ferreira"
        number={0}
        position={{ x: 92, y: 55 }}
        isCoach={true}
      />
    </div>
  );
};

export default FootballField;
