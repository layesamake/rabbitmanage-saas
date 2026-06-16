import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './store/useStore';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Cheptel } from './pages/Cheptel';
import { Reproduction } from './pages/Reproduction';
import { Sante } from './pages/Sante';
import { Alertes } from './pages/Alertes';
import { Parametres } from './pages/Parametres';
import { FicheReproducteur } from './pages/FicheReproducteur';
import { AjouterReproducteur } from './pages/AjouterReproducteur';
import { AjouterRace } from './pages/AjouterRace';
import { NouvelleSaillie } from './pages/NouvelleSaillie';
import { FicheSaillie } from './pages/FicheSaillie';
import { NouvellePortee } from './pages/NouvellePortee';
import { FichePortee } from './pages/FichePortee';
import { ProgrammerTraitement } from './pages/ProgrammerTraitement';
import { EnregistrerSoin } from './pages/EnregistrerSoin';
import { FicheTraitement } from './pages/FicheTraitement';
import { Finance } from './pages/Finance';
import { NouvelleTransaction } from './pages/NouvelleTransaction';
import { Onboarding } from './pages/Onboarding';
import { Aide } from './pages/Aide';
import { Apropos } from './pages/Apropos';

// SaaS Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

function App() {
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="cheptel" element={<Cheptel />} />
          <Route path="cheptel/nouveau" element={<AjouterReproducteur />} />
          <Route path="cheptel/modifier/:id" element={<AjouterReproducteur />} />
          <Route path="cheptel/race/nouvelle" element={<AjouterRace />} />
          <Route path="cheptel/:id" element={<FicheReproducteur />} />
          <Route path="reproduction" element={<Reproduction />} />
          <Route path="reproduction/saillie/nouvelle" element={<NouvelleSaillie />} />
          <Route path="reproduction/saillie/:id" element={<FicheSaillie />} />
          <Route path="reproduction/portee/nouvelle" element={<NouvellePortee />} />
          <Route path="reproduction/portee/modifier/:id" element={<NouvellePortee />} />
          <Route path="reproduction/portee/:id" element={<FichePortee />} />
          <Route path="sante" element={<Sante />} />
          <Route path="sante/traitement/nouveau" element={<ProgrammerTraitement />} />
          <Route path="sante/traitement/modifier/:id" element={<ProgrammerTraitement />} />
          <Route path="sante/soin/nouveau" element={<EnregistrerSoin />} />
          <Route path="sante/traitement/:id" element={<FicheTraitement />} />
          <Route path="alertes" element={<Alertes />} />
          <Route path="aide" element={<Aide />} />
          <Route path="a-propos" element={<Apropos />} />
          <Route path="parametres" element={<Parametres />} />
          <Route path="finance" element={<Finance />} />
          <Route path="finance/nouvelle" element={<NouvelleTransaction />} />
          <Route path="finance/modifier/:id" element={<NouvelleTransaction />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
