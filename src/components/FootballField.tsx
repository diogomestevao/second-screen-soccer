import Player from './Player';

// Jogadores do Palmeiras - Formação 4-3-3
const players = [
  // Goleiro
  { id: 1, name: 'Weverton', number: 21, position: { x: 50, y: 90 } },
  
  // Defesa (4)
  { id: 2, name: 'Marcos Rocha', number: 2, position: { x: 85, y: 75 } },
  { id: 3, name: 'Gustavo Gómez', number: 15, position: { x: 65, y: 78 } },
  { id: 4, name: 'Murilo', number: 26, position: { x: 35, y: 78 } },
  { id: 5, name: 'Piquerez', number: 22, position: { x: 15, y: 75 } },
  
  // Meio-campo (3)
  { id: 6, name: 'Aníbal Moreno', number: 5, position: { x: 50, y: 58 } },
  { id: 7, name: 'Zé Rafael', number: 8, position: { x: 75, y: 48 } },
  { id: 8, name: 'Raphael Veiga', number: 23, position: { x: 25, y: 48 } },
  
  // Ataque (3)
  { id: 9, name: 'Estêvão', number: 41, position: { x: 82, y: 25 } },
  { id: 10, name: 'Flaco López', number: 42, position: { x: 50, y: 20 } },
  { id: 11, name: 'Dudu', number: 7, position: { x: 18, y: 25 } },
];

const FootballField = () => {
  return (
    <div className="relative w-full h-full field-pattern overflow-hidden">
      {/* Field lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Outer boundary */}
        <rect
          x="2"
          y="2"
          width="96"
          height="96"
          fill="none"
          stroke="hsl(0 0% 98% / 0.4)"
          strokeWidth="0.3"
        />
        
        {/* Center line */}
        <line
          x1="2"
          y1="50"
          x2="98"
          y2="50"
          stroke="hsl(0 0% 98% / 0.4)"
          strokeWidth="0.3"
        />
        
        {/* Center circle */}
        <circle
          cx="50"
          cy="50"
          r="12"
          fill="none"
          stroke="hsl(0 0% 98% / 0.4)"
          strokeWidth="0.3"
        />
        
        {/* Center dot */}
        <circle cx="50" cy="50" r="0.8" fill="hsl(0 0% 98% / 0.4)" />
        
        {/* Top penalty area */}
        <rect
          x="22"
          y="2"
          width="56"
          height="18"
          fill="none"
          stroke="hsl(0 0% 98% / 0.4)"
          strokeWidth="0.3"
        />
        
        {/* Top goal area */}
        <rect
          x="35"
          y="2"
          width="30"
          height="7"
          fill="none"
          stroke="hsl(0 0% 98% / 0.4)"
          strokeWidth="0.3"
        />
        
        {/* Top penalty arc */}
        <path
          d="M 38 20 Q 50 26 62 20"
          fill="none"
          stroke="hsl(0 0% 98% / 0.4)"
          strokeWidth="0.3"
        />
        
        {/* Top penalty spot */}
        <circle cx="50" cy="14" r="0.5" fill="hsl(0 0% 98% / 0.4)" />
        
        {/* Bottom penalty area */}
        <rect
          x="22"
          y="80"
          width="56"
          height="18"
          fill="none"
          stroke="hsl(0 0% 98% / 0.4)"
          strokeWidth="0.3"
        />
        
        {/* Bottom goal area */}
        <rect
          x="35"
          y="91"
          width="30"
          height="7"
          fill="none"
          stroke="hsl(0 0% 98% / 0.4)"
          strokeWidth="0.3"
        />
        
        {/* Bottom penalty arc */}
        <path
          d="M 38 80 Q 50 74 62 80"
          fill="none"
          stroke="hsl(0 0% 98% / 0.4)"
          strokeWidth="0.3"
        />
        
        {/* Bottom penalty spot */}
        <circle cx="50" cy="86" r="0.5" fill="hsl(0 0% 98% / 0.4)" />
        
        {/* Corner arcs */}
        <path d="M 2 5 Q 5 2 8 2" fill="none" stroke="hsl(0 0% 98% / 0.4)" strokeWidth="0.3" />
        <path d="M 92 2 Q 95 2 98 5" fill="none" stroke="hsl(0 0% 98% / 0.4)" strokeWidth="0.3" />
        <path d="M 2 95 Q 5 98 8 98" fill="none" stroke="hsl(0 0% 98% / 0.4)" strokeWidth="0.3" />
        <path d="M 92 98 Q 95 98 98 95" fill="none" stroke="hsl(0 0% 98% / 0.4)" strokeWidth="0.3" />
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
        position={{ x: 92, y: 50 }}
        isCoach={true}
      />
    </div>
  );
};

export default FootballField;
