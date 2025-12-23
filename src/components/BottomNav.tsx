import { Home, User } from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, label, isActive = false, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center gap-1 py-2 px-6 rounded-xl transition-all
      ${isActive 
        ? 'text-primary bg-primary/10' 
        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
      }
    `}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

const BottomNav = () => {
  return (
    <nav className="flex items-center justify-center gap-8 py-2 px-4 bg-background border-t border-border/50">
      <NavItem
        icon={<Home className="w-5 h-5" />}
        label="Home"
        isActive={true}
      />
      <NavItem
        icon={<User className="w-5 h-5" />}
        label="Perfil"
      />
    </nav>
  );
};

export default BottomNav;
