import { Home, User, Radio, Trophy } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleNavigation = (path: string, isProtected: boolean = false) => {
    if (isProtected && !user) {
      toast({
        title: 'Acesso restrito',
        description: 'Faça login para acessar esta página',
        variant: 'destructive',
      });
      navigate('/perfil');
      return;
    }
    navigate(path);
  };

  return (
    <nav className="flex items-center justify-center gap-8 py-2 px-4 bg-background border-t border-border/50">
      <NavItem
        icon={<Home className="w-5 h-5" />}
        label="Home"
        isActive={location.pathname === '/'}
        onClick={() => handleNavigation('/')}
      />
      <NavItem
        icon={<Radio className="w-5 h-5" />}
        label="Live"
        isActive={location.pathname === '/live'}
        onClick={() => handleNavigation('/live', true)}
      />
      <NavItem
        icon={<Trophy className="w-5 h-5" />}
        label="Ranking"
        isActive={location.pathname === '/ranking'}
        onClick={() => handleNavigation('/ranking', true)}
      />
      <NavItem
        icon={<User className="w-5 h-5" />}
        label="Perfil"
        isActive={location.pathname === '/perfil'}
        onClick={() => handleNavigation('/perfil')}
      />
    </nav>
  );
};

export default BottomNav;
