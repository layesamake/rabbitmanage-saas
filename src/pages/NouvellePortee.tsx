import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CloudOff, CalendarClock, Link as LinkIcon, ChevronDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useToast } from '../components/ui/Toast';
import { Wizard } from '../components/ui/Wizard';
import type { WizardStep } from '../components/ui/Wizard';
import { PaywallModal } from '../components/ui/PaywallModal';

export const NouvellePortee: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { animals, portees, addPortee, updatePortee, currentUser } = useStore();
  const { showToast } = useToast();
  const [showPaywall, setShowPaywall] = useState(false);

  const existingPortee = isEditMode ? portees.find((p) => p.id === id) : null;
  const femelles = animals.filter(a => a.gender === 'F' || a?.type?.startsWith('Femelle'));

  const [formData, setFormData] = useState({
    female: existingPortee?.female || '',
    dateMiseBas: existingPortee?.dateMiseBas || new Date().toISOString().split('T')[0],
    totalNes: existingPortee?.totalNes ?? 9,
    nesVivants: existingPortee?.nesVivants ?? 8,
    mortsNes: existingPortee?.mortsNes ?? 1,
    cage: existingPortee?.cage || 'Cage A3',
    observations: existingPortee?.observations || ''
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNesVivantsChange = (val: number) => {
    handleChange('nesVivants', val);
    handleChange('totalNes', val + formData.mortsNes);
  };

  const handleMortsNesChange = (val: number) => {
    handleChange('mortsNes', val);
    handleChange('totalNes', formData.nesVivants + val);
  };

  const handleComplete = () => {
    // Intercept with Paywall if quota exceeded
    if (currentUser?.plan === 'free' && !isEditMode && portees.filter(p => p.status === 'En cours').length >= 2) {
      setShowPaywall(true);
      return;
    }

    const birthDate = new Date(formData.dateMiseBas);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    birthDate.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - birthDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const ageStr = diffDays < 0 ? "Non née" : diffDays === 0 ? "0 jour" : `${diffDays} jours`;

    const sevrageDate = new Date(birthDate);
    sevrageDate.setDate(birthDate.getDate() + 35);
    const sevrageStr = sevrageDate.toLocaleDateString('fr-FR');

    const porteeData = {
      female: formData.female,
      effectif: `${formData.nesVivants} vivant${formData.nesVivants > 1 ? 's' : ''}`,
      age: ageStr,
      sevrage: sevrageStr,
      status: existingPortee?.status || 'En cours',
      badgeColor: existingPortee?.badgeColor || 'secondary',
      dateMiseBas: formData.dateMiseBas,
      totalNes: formData.totalNes,
      nesVivants: formData.nesVivants,
      mortsNes: formData.mortsNes,
      cage: formData.cage,
      observations: formData.observations
    };

    if (isEditMode && id) {
      updatePortee(id, porteeData);
      showToast('Portée modifiée ✓', 'success');
      navigate(`/reproduction/portee/${id}`);
    } else {
      const newId = `P-${String(portees.length + 15).padStart(3, '0')}`;
      addPortee({
        id: newId,
        ...porteeData
      });
      showToast('Portée ajoutée ✓', 'success');
      navigate('/reproduction');
    }
  };

  const step1Content = (
    <div className="space-y-6">
      <div className="bg-surface/50 border border-border rounded-lg px-3 py-2 flex items-center justify-center gap-2 mb-4">
        <CloudOff className="w-4 h-4 text-muted" />
        <span className="text-[12px] font-medium text-muted">Données sauvegardées localement</span>
      </div>

      <div className="space-y-1.5">
        <label className="block text-[13px] font-medium text-muted ml-1">Sélection de la femelle *</label>
        <div className="relative group">
          <select 
            className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground focus:ring-1 focus:ring-primary focus:border-primary appearance-none font-mono outline-none"
            value={formData.female}
            onChange={(e) => handleChange('female', e.target.value)}
          >
            <option value="" disabled>Sélectionner une femelle</option>
            {femelles.map(f => (
              <option key={f.id} value={f.id}>{f.id}{f.name ? ` - ${f.name}` : ''}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none w-5 h-5" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-[13px] font-medium text-muted ml-1">Saillie liée (Optionnel)</label>
        <div className="relative group">
          <select className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground focus:ring-1 focus:ring-secondary focus:border-secondary appearance-none font-mono outline-none" defaultValue="s1">
            <option value="none">Aucune saillie</option>
            <option value="s1">Saillie du 16/05/2026</option>
            <option value="s2">Saillie du 10/05/2026</option>
          </select>
          <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none w-4 h-4" />
        </div>
      </div>
    </div>
  );

  const step2Content = (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <label className="block text-[13px] font-medium text-muted ml-1">Date de la mise bas *</label>
        <div className="relative">
          <input 
            className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground focus:ring-1 focus:ring-primary focus:border-primary font-mono outline-none [color-scheme:light]" 
            type="date" 
            value={formData.dateMiseBas}
            onChange={(e) => handleChange('dateMiseBas', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-muted text-center uppercase tracking-wider">Total nés</label>
          <input 
            className="w-full bg-surface border border-border rounded-lg py-3 text-center text-xl font-bold text-foreground focus:border-foreground outline-none transition-colors" 
            type="number" 
            value={formData.totalNes}
            onChange={(e) => handleChange('totalNes', parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-primary text-center uppercase tracking-wider">Nés vivants</label>
          <input 
            className="w-full bg-surface border-2 border-primary/30 rounded-lg py-3 text-center text-xl font-bold text-primary focus:border-primary outline-none transition-colors" 
            type="number" 
            value={formData.nesVivants}
            onChange={(e) => handleNesVivantsChange(parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-danger text-center uppercase tracking-wider">Morts-nés</label>
          <input 
            className="w-full bg-surface border-2 border-danger/30 rounded-lg py-3 text-center text-xl font-bold text-danger focus:border-danger outline-none transition-colors" 
            type="number" 
            value={formData.mortsNes}
            onChange={(e) => handleMortsNesChange(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
    </div>
  );

  const step3Content = (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <label className="block text-[13px] font-medium text-muted ml-1">Emplacement / Cage</label>
        <input 
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground focus:ring-1 focus:ring-primary focus:border-primary font-mono outline-none" 
          placeholder="ex: Cage A3" 
          type="text" 
          value={formData.cage}
          onChange={(e) => handleChange('cage', e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-[13px] font-medium text-muted ml-1">Observations</label>
        <textarea 
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none" 
          rows={3}
          value={formData.observations}
          onChange={(e) => handleChange('observations', e.target.value)}
        ></textarea>
      </div>

      <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <h3 className="text-muted font-bold text-xs uppercase tracking-widest flex items-center gap-2">
          <CalendarClock className="w-4 h-4" />
          Suivi Prévu
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-foreground text-sm">Âge actuel de la portée</span>
            <span className="text-secondary font-bold">
              {(() => {
                const birthDate = new Date(formData.dateMiseBas);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                birthDate.setHours(0, 0, 0, 0);
                const diffTime = today.getTime() - birthDate.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays < 0) return "Non née";
                return diffDays === 0 ? "0 jour" : `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
              })()}
            </span>
          </div>
          <div className="h-px bg-border"></div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-foreground text-sm">Sevrage prévu le</span>
              <span className="font-mono text-warning font-bold">
                {(() => {
                  const birthDate = new Date(formData.dateMiseBas);
                  birthDate.setDate(birthDate.getDate() + 35);
                  return birthDate.toLocaleDateString('fr-FR');
                })()}
              </span>
            </div>
            <span className="text-muted text-[12px] text-right italic font-sans">
              {(() => {
                const birthDate = new Date(formData.dateMiseBas);
                const sevrageDate = new Date(birthDate);
                sevrageDate.setDate(birthDate.getDate() + 35);
                const today = new Date();
                today.setHours(0,0,0,0);
                sevrageDate.setHours(0,0,0,0);
                const diffTime = sevrageDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays < 0) return `(dépassé de ${Math.abs(diffDays)} jours)`;
                return `(dans ${diffDays} jours)`;
              })()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const steps: WizardStep[] = [
    { title: 'Origine', content: step1Content, isValid: formData.female.length > 0 },
    { title: 'Bilan', content: step2Content, isValid: formData.dateMiseBas.length > 0 },
    { title: 'Détails', content: step3Content }
  ];

  return (
    <div className="h-full">
      <Wizard 
        steps={steps} 
        onComplete={handleComplete} 
        onCancel={() => navigate(-1)} 
        completeText={isEditMode ? "Mettre à jour" : "Créer la portée"}
      />
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        title="Limite de portées atteinte"
        message="Le plan Gratuit est limité à 2 portées actives simultanément. Passez au plan Pro pour ajouter de nouvelles portées sans limite !"
        featureName="Ajout de portées"
      />
    </div>
  );
};
