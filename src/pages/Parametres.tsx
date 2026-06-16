import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudUpload, CloudDownload, Syringe, FileText, RotateCcw, AlertTriangle, HelpCircle, ChevronRight, Info, LogOut, CreditCard, Users, Plus, Download, Check, Lock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { generatePDFRegister } from '../utils/pdfGenerator';
import { ConfirmDialog } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';

export const Parametres: React.FC = () => {
  const navigate = useNavigate();
  const { 
    exportData, 
    importData, 
    theme, 
    setTheme, 
    resetData,
    currentUser,
    logoutUser,
    updateUserPlan,
    addTeamMember,
    animals,
    portees
  } = useStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  
  // State variables
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<'pro' | 'enterprise'>('pro');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Credit Card Form State
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Team Member Form State
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState<'Gérant' | 'Ouvrier'>('Ouvrier');

  // Quotas calculations
  const totalAnimals = animals.filter(a => a.status !== 'Mort').length;
  const totalPortees = portees.filter(p => p.status === 'En cours').length;

  const handleLogout = () => {
    logoutUser();
    showToast('Déconnexion réussie.', 'info');
    navigate('/landing');
  };

  const handleExport = () => {
    if (currentUser?.plan === 'free') {
      showToast("L'exportation de données est une fonctionnalité Premium.", 'warning');
      return;
    }

    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const fileName = `gestion-lapins-backup-${new Date().toISOString().split('T')[0]}.json`;

    if (navigator.share) {
      const file = new File([blob], fileName, { type: 'application/json' });
      navigator.share({
        title: 'Sauvegarde Gestion Lapins',
        files: [file]
      }).catch((err) => {
        console.error("Erreur de partage:", err);
        fallbackDownload(blob, fileName);
      });
    } else {
      fallbackDownload(blob, fileName);
    }
  };

  const fallbackDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          const success = importData(event.target.result);
          if (success) {
            showToast('Données restaurées avec succès !', 'success');
          } else {
            showToast('Erreur lors de la restauration du fichier.', 'error');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleOpenCheckout = (plan: 'pro' | 'enterprise') => {
    setCheckoutPlan(plan);
    setPaymentSuccess(false);
    setIsPaying(false);
    setShowCheckoutModal(true);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || cardNumber.length < 16 || !cardExpiry || cardCvc.length < 3) {
      showToast('Veuillez remplir les informations de carte correctement.', 'error');
      return;
    }

    setIsPaying(true);

    // Simulate Payment network request
    setTimeout(() => {
      setIsPaying(false);
      setPaymentSuccess(true);
      
      // Update plan in store
      setTimeout(() => {
        updateUserPlan(checkoutPlan);
        setShowCheckoutModal(false);
        showToast(`Paiement réussi ! Vous êtes maintenant abonné au plan ${checkoutPlan === 'pro' ? 'Pro' : 'Élite'}.`, 'success');
      }, 1000);
    }, 1500);
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName || !memberEmail) {
      showToast('Veuillez remplir le nom et l\'adresse email.', 'error');
      return;
    }

    addTeamMember({
      name: memberName,
      email: memberEmail.toLowerCase(),
      role: memberRole
    });

    showToast(`Invitation envoyée à ${memberEmail} !`, 'success');
    setMemberName('');
    setMemberEmail('');
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    showToast(`Téléchargement de la facture ${invoiceId} démarré...`, 'success');
  };

  // Mock invoice list
  const mockInvoices = [
    { id: 'FAC-2026-004', date: '15/06/2026', amount: currentUser?.plan === 'enterprise' ? '29.99 €' : '9.99 €', status: 'Payé' },
    { id: 'FAC-2026-003', date: '15/05/2026', amount: currentUser?.plan === 'enterprise' ? '29.99 €' : '9.99 €', status: 'Payé' }
  ];

  return (
    <div className="pb-24">
      <div className="space-y-6">
        
        {/* User Profile Card */}
        <div className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              {currentUser?.name ? currentUser.name.charAt(0) : 'E'}
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">{currentUser?.name}</h3>
              <p className="text-xs text-muted mt-0.5">{currentUser?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-all flex items-center gap-1.5 text-xs font-bold active:scale-95"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>

        {/* Subscription details */}
        <section className="bg-surface border border-border rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" /> Mon Abonnement
            </h2>
            <div className="flex items-center gap-1 capitalize">
              {currentUser?.plan === 'enterprise' && (
                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase">
                  Ferme Élite
                </span>
              )}
              {currentUser?.plan === 'pro' && (
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase">
                  Éleveur Pro
                </span>
              )}
              {currentUser?.plan === 'free' && (
                <span className="bg-gray-500/10 text-gray-400 border border-gray-500/20 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase">
                  Gratuit
                </span>
              )}
            </div>
          </div>

          {/* Quotas indicator (Only if Free plan) */}
          {currentUser?.plan === 'free' ? (
            <div className="space-y-3 p-3 bg-gray-950/35 border border-border/80 rounded-xl">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-400">Reproducteurs actifs</span>
                  <span className="font-mono text-foreground">{totalAnimals} / 5</span>
                </div>
                <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${totalAnimals >= 5 ? 'bg-danger' : 'bg-primary'}`} 
                    style={{ width: `${Math.min((totalAnimals / 5) * 100, 100)}%` }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-400">Portées simultanées</span>
                  <span className="font-mono text-foreground">{totalPortees} / 2</span>
                </div>
                <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${totalPortees >= 2 ? 'bg-danger' : 'bg-primary'}`} 
                    style={{ width: `${Math.min((totalPortees / 2) * 100, 100)}%` }} 
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-xs text-emerald-400 font-medium">
              Quota illimité de reproducteurs et portées. Merci de soutenir Lapin Manager !
            </div>
          )}

          {/* Action buttons to change plan */}
          <div className="grid grid-cols-2 gap-2">
            {currentUser?.plan === 'free' && (
              <>
                <button
                  onClick={() => handleOpenCheckout('pro')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-gray-950 py-2.5 rounded-xl text-xs font-extrabold transition-all text-center flex items-center justify-center gap-1.5 active:scale-95 shadow-md shadow-emerald-500/10"
                >
                  Passer au Plan Pro
                </button>
                <button
                  onClick={() => handleOpenCheckout('enterprise')}
                  className="bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-xl text-xs font-extrabold transition-all text-center flex items-center justify-center gap-1.5 active:scale-95"
                >
                  Passer au Plan Élite
                </button>
              </>
            )}

            {currentUser?.plan === 'pro' && (
              <>
                <button
                  onClick={() => handleOpenCheckout('enterprise')}
                  className="col-span-2 bg-emerald-500 hover:bg-emerald-600 text-gray-950 py-2.5 rounded-xl text-xs font-extrabold transition-all text-center flex items-center justify-center gap-1.5 active:scale-95 shadow-md shadow-emerald-500/10"
                >
                  Mettre à niveau vers le Plan Élite
                </button>
              </>
            )}

            {currentUser?.plan === 'enterprise' && (
              <button
                onClick={() => updateUserPlan('free')}
                className="col-span-2 bg-transparent hover:bg-danger/5 text-danger border border-danger/20 hover:border-danger/30 py-2.5 rounded-xl text-xs font-bold transition-all text-center"
              >
                Rétrograder vers le Plan Gratuit
              </button>
            )}
          </div>

          {/* Invoices List (Only visible to Pro/Elite) */}
          {currentUser?.plan !== 'free' && (
            <div className="pt-2">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Historique des factures</h3>
              <div className="space-y-2">
                {mockInvoices.map((inv) => (
                  <div key={inv.id} className="flex justify-between items-center text-xs p-2 bg-gray-950/20 border border-border/50 rounded-lg">
                    <div>
                      <p className="font-bold text-white">{inv.id}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{inv.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-foreground font-semibold">{inv.amount}</span>
                      <button 
                        onClick={() => handleDownloadInvoice(inv.id)}
                        className="p-1 rounded bg-border text-muted hover:text-foreground hover:bg-border/80 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Team Collaboration section */}
        <section className="relative overflow-hidden bg-surface border border-border rounded-xl p-4">
          {currentUser?.plan !== 'enterprise' && (
            /* Lock overlay for non-enterprise tiers */
            <div className="absolute inset-0 bg-gray-950/70 backdrop-blur-[2px] z-10 flex flex-col justify-center items-center text-center p-4">
              <div className="bg-purple-500/10 p-2.5 rounded-xl border border-purple-500/20 text-purple-400 mb-2">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white leading-none">Collaboration en équipe verrouillée</h3>
              <p className="text-[10px] text-gray-400 mt-1 max-w-[240px]">
                Invitez des collaborateurs, attribuez-leur des rôles et gérez votre ferme à plusieurs.
              </p>
              <button
                onClick={() => handleOpenCheckout('enterprise')}
                className="mt-3.5 bg-purple-500 hover:bg-purple-600 text-white px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-md shadow-purple-500/10"
              >
                Débloquer Ferme Élite
              </button>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> Membres de l'équipe
            </h2>

            {/* Invite Form */}
            <form onSubmit={handleInviteMember} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Nom"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="bg-gray-950/60 border border-border/80 rounded-xl px-3 py-2 text-xs font-semibold focus:border-primary outline-none"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="bg-gray-950/60 border border-border/80 rounded-xl px-3 py-2 text-xs font-semibold focus:border-primary outline-none"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value as any)}
                  className="bg-gray-950 border border-border/85 rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:border-primary outline-none flex-grow"
                >
                  <option value="Gérant">Gérant</option>
                  <option value="Ouvrier">Ouvrier</option>
                </select>
                <button
                  type="submit"
                  className="bg-primary text-background px-4 rounded-xl text-xs font-extrabold flex items-center gap-1 hover:bg-primary/95 transition-all"
                >
                  <Plus className="w-4 h-4" /> Inviter
                </button>
              </div>
            </form>

            {/* Active team members list */}
            <div className="space-y-2 pt-2">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Collaborateurs actifs ({currentUser?.teamMembers?.length || 0})</p>
              {currentUser?.teamMembers && currentUser.teamMembers.length > 0 ? (
                currentUser.teamMembers.map((member, i) => (
                  <div key={i} className="flex justify-between items-center text-xs p-2 bg-gray-950/25 border border-border/50 rounded-lg">
                    <div>
                      <p className="font-bold text-white">{member.name}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-border rounded-md text-muted uppercase">
                        {member.role}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        member.status === 'Actif' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                      }`}>
                        {member.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted italic">Aucun collaborateur invité pour le moment.</p>
              )}
            </div>
          </div>
        </section>

        {/* Apparence */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Apparence</h2>
          <div className="bg-surface border border-border p-2 rounded-xl grid grid-cols-4 gap-2">
            <button 
              onClick={() => setTheme('clair')}
              className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                theme === 'clair' ? 'bg-primary text-background shadow-md' : 'text-muted hover:bg-border/50'
              }`}
            >
              Clair
            </button>
            <button 
              onClick={() => setTheme('sombre')}
              className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                theme === 'sombre' ? 'bg-primary text-background shadow-md' : 'text-muted hover:bg-border/50'
              }`}
            >
              Sombre
            </button>
            <button 
              onClick={() => setTheme('nature')}
              className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                theme === 'nature' ? 'bg-primary text-background shadow-md' : 'text-muted hover:bg-border/50'
              }`}
            >
              Nature
            </button>
            <button 
              onClick={() => setTheme('ferme')}
              className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                theme === 'ferme' ? 'bg-primary text-background shadow-md' : 'text-muted hover:bg-border/50'
              }`}
            >
              Ferme
            </button>
          </div>
        </section>

        {/* Support & Aide */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Support & Aide</h2>
          <button 
            onClick={() => navigate('/aide')}
            className="w-full bg-surface border border-border p-4 rounded-xl flex items-center justify-between active:scale-[0.98] transition-all hover:border-primary/50"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm text-foreground">Centre d'Aide & FAQ</h3>
                <p className="text-xs text-muted mt-0.5">Guide d'utilisation et parcours de l'éleveur</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted" />
          </button>
          
          <button 
            onClick={() => navigate('/a-propos')}
            className="w-full bg-surface border border-border p-4 rounded-xl flex items-center justify-between active:scale-[0.98] transition-all hover:border-primary/50"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <Info className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm text-foreground">À Propos</h3>
                <p className="text-xs text-muted mt-0.5">Informations sur l'application et le concepteur</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted" />
          </button>
        </section>

        {/* Sauvegarde Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Sauvegarde</h2>
            <span className="font-mono text-[10px] text-muted">Dernière : 28/05/2026</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleExport}
              className="flex flex-col items-center justify-center p-4 bg-surface border border-border rounded-xl active:scale-[0.98] transition-all hover:bg-border/50"
            >
              <CloudUpload className="w-6 h-6 text-warning mb-2" />
              <span className="text-xs font-medium">Sauvegarder JSON</span>
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-4 bg-surface border border-border rounded-xl active:scale-[0.98] transition-all hover:bg-border/50"
            >
              <CloudDownload className="w-6 h-6 text-warning mb-2" />
              <span className="text-xs font-medium">Restaurer</span>
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                accept=".json" 
                onChange={handleImport} 
              />
            </button>
            <button 
              onClick={() => {
                if (currentUser?.plan === 'free') {
                  showToast("Le registre PDF est une fonctionnalité Premium. Passez au plan Pro.", 'warning');
                  return;
                }
                generatePDFRegister();
              }}
              className={`col-span-2 flex items-center justify-center gap-2 p-4 border rounded-xl active:scale-[0.98] transition-all
                ${currentUser?.plan === 'free' 
                  ? 'bg-gray-800/20 border-gray-800 text-gray-500 cursor-not-allowed' 
                  : 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20'}`}
            >
              <FileText className="w-6 h-6" />
              <span className="text-sm font-bold">Générer Registre PDF</span>
            </button>
          </div>
        </section>

        {/* Reproduction Parameters */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Paramètres Reproduction</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface border border-border p-4 rounded-xl">
              <label className="block text-[11px] font-medium text-muted mb-1">Contrôle de gestation</label>
              <div className="flex items-center justify-between">
                <input className="bg-transparent border-none p-0 text-2xl font-bold font-display text-secondary focus:ring-0 w-20 outline-none" type="number" defaultValue="14" min="1" />
                <span className="text-muted font-mono text-sm">jours</span>
              </div>
            </div>
            
            <div className="bg-surface border border-border p-4 rounded-xl">
              <label className="block text-[11px] font-medium text-muted mb-1">Préparation mise bas</label>
              <div className="flex items-center justify-between">
                <input className="bg-transparent border-none p-0 text-2xl font-bold font-display text-secondary focus:ring-0 w-20 outline-none" type="number" defaultValue="27" min="1" />
                <span className="text-muted font-mono text-sm">jours</span>
              </div>
            </div>

            <div className="bg-surface border border-border p-4 rounded-xl">
              <label className="block text-[11px] font-medium text-muted mb-1">Durée gestation</label>
              <div className="flex items-center justify-between">
                <input className="bg-transparent border-none p-0 text-2xl font-bold font-display text-secondary focus:ring-0 w-20 outline-none" type="number" defaultValue="31" min="1" />
                <span className="text-muted font-mono text-sm">jours</span>
              </div>
            </div>

            <div className="bg-surface border border-border p-4 rounded-xl">
              <label className="block text-[11px] font-medium text-muted mb-1">Âge sevrage</label>
              <div className="flex items-center justify-between">
                <input className="bg-transparent border-none p-0 text-2xl font-bold font-display text-secondary focus:ring-0 w-20 outline-none" type="number" defaultValue="35" min="1" />
                <span className="text-muted font-mono text-sm">jours</span>
              </div>
            </div>
          </div>
        </section>

        {/* Paramètres Sanitaires */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Paramètres Sanitaires</h2>
          <div className="bg-surface border border-border rounded-xl overflow-hidden divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Syringe className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Rappel auto traitements</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-secondary" />
                <span className="text-sm font-medium">Rappel auto sauvegarde</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Zone Dangereuse */}
        <section className="space-y-3 pt-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-danger">Zone Dangereuse</h2>
          <div className="bg-danger/10 border border-danger/30 rounded-xl p-4 flex flex-col items-center gap-3 text-center">
            <AlertTriangle className="w-8 h-8 text-danger" />
            <p className="text-xs text-muted">
              Supprimer toutes les données (animaux, saillies, transactions). Cette action est irréversible.
            </p>
            <button 
              onClick={() => setShowResetConfirm(true)}
              className="mt-2 px-4 py-3 bg-danger text-white rounded-xl text-sm font-bold active:scale-95 transition-transform"
            >
              Réinitialiser les données
            </button>
          </div>
        </section>
      </div>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={() => {
          resetData();
          showToast('Toutes les données ont été réinitialisées.', 'warning');
          navigate('/');
        }}
        title="Réinitialiser les données"
        message="Êtes-vous sûr de vouloir supprimer TOUTES vos données ? Cette action est définitive et irréversible."
        confirmText="Supprimer tout"
        cancelText="Annuler"
        variant="danger"
      />

      {/* Checkout Modal Simulation */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCheckoutModal(false)} />
          <div className="bg-[#161B26] border border-gray-800 rounded-3xl w-full max-w-sm p-6 relative z-10 shadow-2xl animate-slide-up text-left">
            <div className="flex flex-col items-center text-center mb-5">
              <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/30 text-emerald-500 mb-3">
                <CreditCard className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-display font-black text-white">Simulation de paiement</h3>
              <p className="text-xs text-gray-400 mt-1">
                Paiement pour le Plan <span className="text-emerald-400 font-bold capitalize">{checkoutPlan}</span> (9,99 € ou 29,99 €)
              </p>
            </div>

            {paymentSuccess ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-3 text-center">
                <div className="w-16 h-16 rounded-full bg-success/20 text-success border border-success/30 flex items-center justify-center animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-white text-sm">Paiement autorisé</h4>
                <p className="text-xs text-gray-500">Mise à jour de votre abonnement en cours...</p>
              </div>
            ) : (
              <form onSubmit={handlePay} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Titulaire de la carte</label>
                  <input
                    type="text"
                    required
                    placeholder="Jean Dupont"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 focus:border-emerald-500 rounded-xl py-2.5 px-3.5 text-xs font-semibold outline-none text-white transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Numéro de carte</label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    placeholder="4000 1234 5678 9010"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-gray-950 border border-gray-800 focus:border-emerald-500 rounded-xl py-2.5 px-3.5 text-xs font-mono font-semibold outline-none text-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Expiration (MM/AA)</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      placeholder="12/29"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 focus:border-emerald-500 rounded-xl py-2.5 px-3.5 text-xs font-semibold outline-none text-white transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">CVC</label>
                    <input
                      type="text"
                      required
                      maxLength={3}
                      placeholder="123"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-gray-950 border border-gray-800 focus:border-emerald-500 rounded-xl py-2.5 px-3.5 text-xs font-mono font-semibold outline-none text-white transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPaying}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 disabled:text-gray-600 text-gray-950 py-3.5 rounded-xl text-xs font-extrabold transition-all transform active:scale-95 shadow-md flex items-center justify-center gap-2 mt-4"
                >
                  {isPaying ? (
                    <span className="w-4.5 h-4.5 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Confirmer le paiement</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
