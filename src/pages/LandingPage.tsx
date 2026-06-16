import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rabbit, Check, Users, TrendingUp, Activity, FileText, Cloud, HelpCircle, Star, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Plan Gratuit',
      price: 0,
      description: 'Pour débuter votre élevage familial',
      features: [
        'Jusqu\'à 5 reproducteurs actifs',
        '2 portées simultanées maximum',
        'Suivi de santé de base',
        'Rappels et alertes simples',
        'Données stockées localement'
      ],
      cta: 'Démarrer gratuitement',
      popular: false
    },
    {
      id: 'pro',
      name: 'Éleveur Pro',
      price: isAnnual ? 7.99 : 9.99,
      description: 'La solution complète pour les professionnels',
      features: [
        'Reproducteurs illimités',
        'Portées et saillies illimitées',
        'Génération de registre cunicole PDF',
        'Statistiques & finances avancées',
        'Synchronisation cloud automatique',
        'Support client sous 24h'
      ],
      cta: 'Essai gratuit 14 jours',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Ferme Élite',
      price: isAnnual ? 23.99 : 29.99,
      description: 'Pour la gestion collaborative d\'équipe',
      features: [
        'Toutes les fonctionnalités Pro',
        'Jusqu\'à 5 membres d\'équipe',
        'Rôles personnalisés (Gérant, Ouvrier)',
        'Suivi des actions par collaborateur',
        'Multi-cages et multi-bâtiments',
        'Support prioritaire dédié 24/7'
      ],
      cta: 'Essai gratuit Élite',
      popular: false
    }
  ];

  const handlePlanSelect = (planId: string) => {
    navigate(`/register?plan=${planId}`);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#0B0F19]/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/landing')}>
            <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/30 text-emerald-500">
              <Rabbit className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white font-display">Lapin Manager</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-400">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Fonctionnalités</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">Tarifs</a>
            <a href="#testimonials" className="hover:text-emerald-400 transition-colors">Témoignages</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <button
                onClick={() => navigate('/')}
                className="bg-emerald-500 hover:bg-emerald-600 text-gray-950 px-4 py-2 rounded-xl text-sm font-bold transition-all transform active:scale-95 shadow-lg shadow-emerald-500/15"
              >
                Tableau de bord
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-300 hover:text-white text-sm font-bold px-3 py-2 transition-colors"
                >
                  Se connecter
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-gray-950 px-4 py-2 rounded-xl text-sm font-bold transition-all transform active:scale-95 shadow-lg shadow-emerald-500/15"
                >
                  Essai Gratuit
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            La plateforme SaaS cunicole de référence
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white leading-[1.1]">
            Gérez votre élevage de lapins <br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              en équipe et en toute rigueur
            </span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Suivi du cheptel, planification des accouplements, rappels vétérinaires et comptabilité. Une solution moderne et synchronisée dans le Cloud pour les éleveurs exigeants.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-gray-950 px-8 py-4 rounded-xl text-base font-extrabold transition-all transform active:scale-95 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              Créer mon compte gratuitement <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#pricing"
              className="w-full sm:w-auto border border-gray-800 hover:border-gray-700 bg-gray-900/50 text-gray-300 hover:text-white px-8 py-4 rounded-xl text-base font-bold transition-all text-center"
            >
              Voir les tarifs
            </a>
          </div>

          {/* Quick Info bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 max-w-3xl mx-auto border-t border-gray-800/80 text-left">
            <div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-white">100%</p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Conçu en français</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-white">Hors-ligne</p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Fonctionne au hangar</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-white">Multi-membres</p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Collaboration en temps réel</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-white">Zéro Papier</p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Registre PDF conforme</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-gray-800 bg-[#161B26]/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Fonctionnalités Clés</h2>
            <p className="text-3xl sm:text-4xl font-display font-black text-white">Tout ce dont un éleveur a besoin</p>
            <p className="text-gray-400">Une suite d'outils professionnels pour numériser votre élevage et augmenter votre productivité.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#161B26] border border-gray-800 p-6 rounded-2xl space-y-4 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Rabbit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Suivi précis du Cheptel</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Fiche détaillée pour chaque reproducteur (race, cage, poids, historique médical). Identifiants uniques pour une traçabilité totale.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#161B26] border border-gray-800 p-6 rounded-2xl space-y-4 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Reproduction & Naissances</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Planification des saillies, alertes automatiques pour les contrôles de gestation, suivi des portées et des sevrages de lapereaux.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#161B26] border border-gray-800 p-6 rounded-2xl space-y-4 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Santé & Traitements</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Agenda de vaccination, rappels de vermifuges, planification des traitements vétérinaires curatifs ou préventifs.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#161B26] border border-gray-800 p-6 rounded-2xl space-y-4 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Finance & Rentabilité</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Enregistrement des dépenses d'alimentation ou pharmacie et des ventes de lapins de chair ou reproducteurs. Calcul automatique de vos marges.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#161B26] border border-gray-800 p-6 rounded-2xl space-y-4 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Collaboration d'Équipe</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Invitez vos associés ou ouvriers agricoles. Attribuez-leur des rôles spécifiques et suivez l'avancement des tâches en temps réel.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#161B26] border border-gray-800 p-6 rounded-2xl space-y-4 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Synchronisation Cloud</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Vos données sont sauvegardées en lieu sûr. Travaillez hors-ligne dans vos hangars et synchronisez vos données automatiquement dès que vous retrouvez du réseau.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Tarification Claire</h2>
            <p className="text-3xl sm:text-4xl font-display font-black text-white">Choisissez le plan adapté à votre taille</p>
            <p className="text-gray-400">Pas de coûts cachés. Annulez ou changez de forfait à tout moment.</p>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <span className={`text-sm ${!isAnnual ? 'text-white font-bold' : 'text-gray-400'}`}>Mensuel</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="w-12 h-6 rounded-full bg-gray-800 relative flex items-center px-1 transition-all"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-emerald-500 transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-sm flex items-center gap-1.5 ${isAnnual ? 'text-white font-bold' : 'text-gray-400'}`}>
                Annuel
                <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">
                  -20%
                </span>
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-[#161B26] border rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                  plan.popular
                    ? 'border-emerald-500 shadow-2xl shadow-emerald-500/10 scale-100 md:scale-[1.03]'
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-gray-950 font-extrabold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">
                    Recommandé
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-display font-black text-white">{plan.price} €</span>
                    <span className="text-xs text-gray-500 font-medium">/ mois</span>
                  </div>

                  {isAnnual && plan.price > 0 && (
                    <p className="text-[11px] text-emerald-400 font-semibold">Facturé {Math.round(plan.price * 12)} € / an</p>
                  )}

                  <hr className="border-gray-800" />

                  <ul className="space-y-3.5">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300 leading-relaxed">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`w-full py-4 rounded-xl font-extrabold text-sm transition-all transform active:scale-[0.98] ${
                      plan.popular
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-gray-950 shadow-lg shadow-emerald-500/15'
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 border-t border-gray-800 bg-[#161B26]/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Témoignages</h2>
            <p className="text-3xl sm:text-4xl font-display font-black text-white">Approuvé par les éleveurs</p>
            <p className="text-gray-400">Découvrez comment notre solution transforme le quotidien des cuniculteurs professionnels.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-[#161B26] border border-gray-800 p-8 rounded-2xl space-y-4">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed italic">
                "Lapin Manager a sauvé mon exploitation. La gestion papier était un calvaire avec plus de 80 lapines. Aujourd'hui, les alertes de sevrage et de palpation me rappellent quotidiennement quoi faire. Je ne rate plus aucune saillie."
              </p>
              <div>
                <p className="font-bold text-white text-sm">Gérard Dupont</p>
                <p className="text-xs text-gray-500 mt-0.5">Directeur, Élevage du Val de l'Eyre</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-[#161B26] border border-gray-800 p-8 rounded-2xl space-y-4">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed italic">
                "Nous utilisons le plan Ferme Élite à trois associés. La synchronisation fonctionne parfaitement même dans notre hangar éloigné. Le suivi comptable nous aide à voir instantanément si le coût de l'aliment nuit à notre marge globale."
              </p>
              <div>
                <p className="font-bold text-white text-sm">Amélie Laurent</p>
                <p className="text-xs text-gray-500 mt-0.5">Co-fondatrice, Les Garennes Bio</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">FAQ</h2>
            <p className="text-3xl sm:text-4xl font-display font-black text-white">Questions Fréquentes</p>
          </div>

          <div className="space-y-6">
            <div className="bg-[#161B26] border border-gray-800 p-6 rounded-xl space-y-2">
              <h3 className="font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                Puis-je utiliser l'application hors-ligne dans mes clapiers ?
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed pl-6">
                Oui. L'application est conçue pour fonctionner de manière autonome. Vous pouvez entrer vos saillies, soins et naissances sans connexion internet. Dès que votre téléphone capte du réseau, les données sont automatiquement synchronisées et sauvegardées dans le Cloud.
              </p>
            </div>

            <div className="bg-[#161B26] border border-gray-800 p-6 rounded-xl space-y-2">
              <h3 className="font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                Comment fonctionne la période d'essai de 14 jours ?
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed pl-6">
                Vous pouvez essayer le plan Pro gratuitement pendant 14 jours, sans carte de crédit requise. Si vous n'effectuez pas de mise à niveau à l'issue des 14 jours, votre compte sera automatiquement rebasculé sur le plan Gratuit (limité à 5 reproducteurs). Vos données ne seront pas supprimées.
              </p>
            </div>

            <div className="bg-[#161B26] border border-gray-800 p-6 rounded-xl space-y-2">
              <h3 className="font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                Le registre généré est-il conforme à la réglementation ?
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed pl-6">
                Oui, le document PDF généré par l'application respecte les normes réglementaires des registres d'élevage (entrées/sorties, dates de naissance, suivi sanitaire, causes de décès ou de réforme).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 text-center text-xs text-gray-500 bg-[#0B0F19]">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <p className="font-bold text-gray-400">© 2026 Lapin Manager SaaS • Fièrement développé pour l'agriculture moderne.</p>
          <p>
            Tous droits réservés. L'application utilise un stockage local hautement sécurisé couplé à des sauvegardes dans le cloud.
          </p>
        </div>
      </footer>
    </div>
  );
};
