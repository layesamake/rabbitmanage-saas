import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Rabbit, Mail, Lock, User, Home, AlertTriangle, ArrowLeft, Check } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const registerUser = useStore((state) => state.registerUser);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [farmName, setFarmName] = useState('');
  const [plan, setPlan] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [error, setError] = useState<string | null>(null);

  // Pre-select plan from URL query param
  useEffect(() => {
    const urlPlan = searchParams.get('plan');
    if (urlPlan === 'free' || urlPlan === 'pro' || urlPlan === 'enterprise') {
      setPlan(urlPlan);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !farmName) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (password.length < 4) {
      setError('Le mot de passe doit contenir au moins 4 caractères.');
      return;
    }

    const success = registerUser({
      email,
      password,
      name,
      farmName,
      plan
    });

    if (success) {
      navigate('/');
    } else {
      setError('Cette adresse email est déjà enregistrée. Connectez-vous.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col justify-center items-center py-12 px-4 relative">
      {/* Back button */}
      <button 
        onClick={() => navigate('/landing')}
        className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-2 text-sm font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Retour au site
      </button>

      {/* Main card */}
      <div className="w-full max-w-xl bg-[#161B26] border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative circle glow */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/5 blur-3xl rounded-full" />

        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/30 text-emerald-500 mb-3">
            <Rabbit className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-display font-black text-white text-center">Créer mon compte</h1>
          <p className="text-gray-400 text-sm mt-1 text-center">Démarrez la gestion de votre élevage en quelques instants</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-start gap-3 text-xs leading-relaxed">
            <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nom & Prénom</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Jean Dupont"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 focus:border-emerald-500 rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none text-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nom de l'élevage</label>
              <div className="relative">
                <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Élevage de la Plaine"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 focus:border-emerald-500 rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none text-white transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="email"
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 focus:border-emerald-500 rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none text-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 focus:border-emerald-500 rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none text-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Plan Selection segment */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Choisissez votre formule</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Free plan */}
              <div
                onClick={() => setPlan('free')}
                className={`border rounded-2xl p-4 cursor-pointer relative transition-all ${
                  plan === 'free'
                    ? 'border-emerald-500 bg-emerald-500/5 shadow-md shadow-emerald-500/5'
                    : 'border-gray-800 bg-gray-950 hover:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white">Gratuit</span>
                  {plan === 'free' && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[10px] text-gray-500 leading-tight">Limité à 5 reproducteurs. Idéal pour débuter.</p>
                <p className="text-sm font-bold text-white mt-2">0 €</p>
              </div>

              {/* Pro plan */}
              <div
                onClick={() => setPlan('pro')}
                className={`border rounded-2xl p-4 cursor-pointer relative transition-all ${
                  plan === 'pro'
                    ? 'border-emerald-500 bg-emerald-500/5 shadow-md shadow-emerald-500/5'
                    : 'border-gray-800 bg-gray-950 hover:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white">Éleveur Pro</span>
                  {plan === 'pro' && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[10px] text-gray-500 leading-tight">Accès illimité, exports PDF conformes.</p>
                <p className="text-sm font-bold text-emerald-400 mt-2">9,99 € / mois</p>
              </div>

              {/* Enterprise plan */}
              <div
                onClick={() => setPlan('enterprise')}
                className={`border rounded-2xl p-4 cursor-pointer relative transition-all ${
                  plan === 'enterprise'
                    ? 'border-emerald-500 bg-emerald-500/5 shadow-md shadow-emerald-500/5'
                    : 'border-gray-800 bg-gray-950 hover:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white">Ferme Élite</span>
                  {plan === 'enterprise' && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[10px] text-gray-500 leading-tight">Jusqu'à 5 membres, rôles d'équipe.</p>
                <p className="text-sm font-bold text-white mt-2">29,99 € / mois</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-950 py-4 rounded-xl text-sm font-extrabold transform active:scale-95 transition-all shadow-lg shadow-emerald-500/15 pt-3"
          >
            Créer mon compte
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="text-emerald-400 font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};
