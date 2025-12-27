import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Camera, Lock, ArrowLeft, Loader2, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

type AuthMode = 'login' | 'signup' | 'forgot';

export default function Profile() {
  const { user, profile, loading, signIn, signUp, signOut, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+55');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatPhone = (value: string) => {
    // Remove non-digits except +
    let cleaned = value.replace(/[^\d+]/g, '');
    
    // Ensure it starts with +55
    if (!cleaned.startsWith('+55')) {
      cleaned = '+55' + cleaned.replace(/^\+?55?/, '');
    }
    
    return cleaned.slice(0, 14); // +55 + 11 digits max
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return null;

    const fileExt = avatarFile.name.split('.').pop();
    const filePath = `${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: 'Erro ao entrar',
        description: error.message === 'Invalid login credentials' 
          ? 'Email ou senha incorretos' 
          : error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Bem-vindo!',
        description: 'Login realizado com sucesso',
      });
      navigate('/');
    }

    setIsSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!avatarFile) {
      toast({
        title: 'Foto obrigatória',
        description: 'Por favor, selecione uma foto de perfil',
        variant: 'destructive',
      });
      return;
    }

    if (phone.length < 13) {
      toast({
        title: 'Telefone inválido',
        description: 'Insira um número de telefone válido com DDD',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // First create the auth user to get the ID
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/perfil`,
      },
    });

    if (authError || !authData.user) {
      toast({
        title: 'Erro ao criar conta',
        description: authError?.message === 'User already registered'
          ? 'Este email já está cadastrado'
          : authError?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    // Upload avatar with the user ID
    const avatarUrl = await uploadAvatar(authData.user.id);

    if (!avatarUrl) {
      toast({
        title: 'Erro ao enviar foto',
        description: 'Não foi possível fazer upload da foto. Tente novamente.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    // Create profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      username,
      full_name: fullName,
      avatar_url: avatarUrl,
      phone,
    });

    if (profileError) {
      toast({
        title: 'Erro ao criar perfil',
        description: profileError.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Conta criada!',
        description: 'Sua conta foi criada com sucesso',
      });
    }

    setIsSubmitting(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await resetPassword(email);

    if (error) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Email enviado',
        description: 'Verifique sua caixa de entrada para redefinir a senha',
      });
      setAuthMode('login');
    }

    setIsSubmitting(false);
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: 'Até logo!',
      description: 'Você saiu da sua conta',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Authenticated view
  if (user && profile) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </Link>
            <h1 className="font-display text-2xl text-primary">MEU PERFIL</h1>
            <div className="w-20" />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto bg-card border-border">
            <CardContent className="pt-8">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                  />
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground">{profile.full_name}</h2>
                  <p className="text-muted-foreground">@{profile.username}</p>
                </div>

                <div className="w-full space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="text-foreground">{user.email}</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="text-foreground">{profile.phone}</span>
                  </div>
                </div>

                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full mt-4"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair da Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Unauthenticated view
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </Link>
          <h1 className="font-display text-2xl text-primary">ENTRAR</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto bg-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-display text-foreground">
              {authMode === 'login' && 'Entrar na Conta'}
              {authMode === 'signup' && 'Criar Conta'}
              {authMode === 'forgot' && 'Recuperar Senha'}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {authMode === 'login' && 'Faça login para acessar seu perfil'}
              {authMode === 'signup' && 'Preencha os dados para criar sua conta'}
              {authMode === 'forgot' && 'Informe seu email para redefinir a senha'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Entrar'
                  )}
                </Button>

                <div className="flex flex-col gap-2 text-center text-sm">
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-primary hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                  <span className="text-muted-foreground">
                    Não tem conta?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className="text-primary hover:underline"
                    >
                      Criar conta
                    </button>
                  </span>
                </div>
              </form>
            )}

            {authMode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                {/* Avatar upload */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-full bg-secondary border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden"
                  >
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <Label className="text-sm text-muted-foreground">
                    Foto de perfil (obrigatório)
                  </Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Nome de Usuário</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="@usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullname">Nome Completo</Label>
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="Seu nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+5511999999999"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Criar Conta'
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Já tem conta?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-primary hover:underline"
                  >
                    Entrar
                  </button>
                </div>
              </form>
            )}

            {authMode === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Enviar Email de Recuperação'
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-primary hover:underline"
                  >
                    Voltar ao login
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
