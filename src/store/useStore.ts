import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cheptelData, santeData, alertesData } from '../data/mockData';

export interface Animal {
  id: string;
  status: string;
  type: string;
  location: string;
  badgeColor: string;
  infoIcon?: string;
  infoText?: string;
  infoColor?: string;
  isWarning?: boolean;
  image?: string;
  name?: string;
  gender?: string;
  race?: string;
  age?: string;
  weight?: string;
  naissance?: string;
  origine?: string;
  cage?: string;
  robe?: string;
  observations?: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description: string;
}

export interface Saillie {
  id: number;
  female: string;
  male: string;
  status: string;
  statusBadgeColor: string;
  date: string;
  expectedDate?: string;
  hasControlToday?: boolean;
  type?: string;
}

export interface Portee {
  id: string;
  status: string;
  female: string;
  age?: string;
  effectif: string;
  sevrage?: string;
  badgeColor: string;
  dateMiseBas?: string;
  totalNes?: number;
  nesVivants?: number;
  mortsNes?: number;
  cage?: string;
  observations?: string;
}

export interface TeamMember {
  name: string;
  email: string;
  role: 'Propriétaire' | 'Gérant' | 'Ouvrier';
  status: 'Actif' | 'En attente';
}

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  farmName: string;
  plan: 'free' | 'pro' | 'enterprise';
  trialEnd: string;
  teamMembers?: TeamMember[];
}

interface UserSpecificData {
  animals: Animal[];
  soins: any[];
  alertes: any[];
  transactions: Transaction[];
  saillies: Saillie[];
  portees: Portee[];
  races: string[];
  expenseCategories: string[];
  incomeCategories: string[];
}

interface AppState {
  users: User[];
  currentUser: User | null;
  usersData: Record<string, UserSpecificData>;
  
  // Active user data
  animals: Animal[];
  santeStats: any;
  soins: any[];
  alertes: any[];
  transactions: Transaction[];
  saillies: Saillie[];
  portees: Portee[];
  theme: string;
  races: string[];
  expenseCategories: string[];
  incomeCategories: string[];
  hasOnboarded: boolean;

  // Authentication & Plan Actions
  registerUser: (user: Omit<User, 'id' | 'trialEnd'> & { password?: string }) => boolean;
  loginUser: (email: string, password?: string) => boolean;
  logoutUser: () => void;
  updateUserPlan: (plan: 'free' | 'pro' | 'enterprise') => void;
  addTeamMember: (member: Omit<TeamMember, 'status'>) => void;
  setOnboarded: (value: boolean) => void;
  
  // App Logic Actions
  addRace: (race: string) => void;
  addExpenseCategory: (category: string) => void;
  addIncomeCategory: (category: string) => void;
  addAnimal: (animal: Animal) => void;
  updateAnimal: (id: string, animal: Partial<Animal>) => void;
  removeAnimal: (id: string) => void;
  removeAlerte: (id: number) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;
  addSoin: (soin: any) => void;
  updateSoin: (id: number, soin: Partial<any>) => void;
  removeSoin: (id: number) => void;
  addSaillie: (saillie: Saillie) => void;
  updateSaillie: (id: number, saillie: Partial<Saillie>) => void;
  removeSaillie: (id: number) => void;
  addPortee: (portee: Portee) => void;
  updatePortee: (id: string, portee: Partial<Portee>) => void;
  removePortee: (id: string) => void;
  setTheme: (theme: string) => void;
  importData: (data: string) => boolean;
  exportData: () => string;
  resetData: () => void;
}

// Initial mock data setups for pre-configured users
const initialMockData: UserSpecificData = {
  animals: cheptelData.animals,
  soins: santeData.soins,
  alertes: alertesData,
  transactions: [
    { id: '1', date: new Date().toISOString().split('T')[0], type: 'EXPENSE', category: 'Alimentation', amount: 15000, description: 'Sacs de granulés' },
    { id: '2', date: new Date().toISOString().split('T')[0], type: 'INCOME', category: 'Vente', amount: 35000, description: 'Vente de 5 lapins de chair' }
  ],
  saillies: [
    { id: 1, female: 'F-012', male: 'M-004', status: 'Gestation confirmée', statusBadgeColor: 'primary', date: '16/05/2026', expectedDate: '16/06/2026' },
    { id: 2, female: 'F-008', male: 'M-002, M-006', status: 'En attente', statusBadgeColor: 'secondary', date: '18/05/2026', hasControlToday: true, type: 'Double passage' },
    { id: 3, female: 'F-021', male: 'M-003', status: 'Échec', statusBadgeColor: 'danger', date: '05/05/2026' }
  ],
  portees: [
    { id: 'P-014', status: 'En cours', female: 'F-012', age: '21 jours', effectif: '8 vivants', sevrage: '20/06/2026', badgeColor: 'secondary' },
    { id: 'P-009', status: 'À sevrer', female: 'F-008', effectif: '5 lapereaux vivants', badgeColor: 'warning' }
  ],
  races: ['Néo-Zélandais', 'Californien', 'Géant des Flandres', 'Race locale', 'Croisé'],
  expenseCategories: ['Alimentation (Granulés/Foin)', 'Pharmacie / Médicaments', 'Matériel / Équipement', 'Achat Animaux', 'Autre'],
  incomeCategories: ['Vente Lapins de Chair', 'Vente Reproducteurs', 'Vente Fumier', 'Autre'],
};

const initialEnterpriseMockData: UserSpecificData = {
  animals: [
    ...cheptelData.animals,
    {
      id: 'F-030',
      name: 'Duchesse',
      gender: 'F',
      status: 'Actif',
      type: 'Femelle • Néo-Zélandais',
      location: 'Cage A4',
      badgeColor: 'brand-primary',
      robe: 'Blanc pur'
    }
  ],
  soins: santeData.soins,
  alertes: alertesData,
  transactions: [
    { id: '1', date: new Date().toISOString().split('T')[0], type: 'INCOME', category: 'Vente', amount: 125000, description: 'Vente cheptel reproducteurs' }
  ],
  saillies: [],
  portees: [],
  races: ['Néo-Zélandais', 'Californien', 'Géant des Flandres', 'Bélier Français', 'Race locale'],
  expenseCategories: ['Alimentation (Granulés/Foin)', 'Pharmacie / Médicaments', 'Matériel / Équipement', 'Achat Animaux', 'Autre'],
  incomeCategories: ['Vente Lapins de Chair', 'Vente Reproducteurs', 'Vente Fumier', 'Autre'],
};

const defaultUsers: User[] = [
  {
    id: 'user-free',
    email: 'eleveur@saas.com',
    password: 'admin',
    name: 'Jean Éleveur',
    farmName: 'La Garenne Moderne',
    plan: 'free',
    trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    teamMembers: []
  },
  {
    id: 'user-elite',
    email: 'elite@saas.com',
    password: 'admin',
    name: 'Sophie Directrice',
    farmName: 'Lapins Cunicoles Élite',
    plan: 'enterprise',
    trialEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    teamMembers: [
      { name: 'Pierre Ouvrier', email: 'pierre@saas.com', role: 'Ouvrier', status: 'Actif' },
      { name: 'Marc Gérant', email: 'marc@saas.com', role: 'Gérant', status: 'Actif' },
      { name: 'Julie Vétérinaire', email: 'julie@saas.com', role: 'Ouvrier', status: 'En attente' }
    ]
  }
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: defaultUsers,
      currentUser: null,
      usersData: {
        'user-free': initialMockData,
        'user-elite': initialEnterpriseMockData,
      },

      // Active state
      animals: [],
      santeStats: { tauxMortalite: 0, traitementsEnCours: 0, alertesSanitaires: 0 },
      soins: [],
      alertes: [],
      transactions: [],
      saillies: [],
      portees: [],
      theme: 'nature',
      hasOnboarded: false,
      races: [],
      expenseCategories: [],
      incomeCategories: [],

      setOnboarded: (value) => set({ hasOnboarded: value }),

      registerUser: (userData) => {
        const emailLower = userData.email.toLowerCase();
        const exists = get().users.some((u) => u.email.toLowerCase() === emailLower);
        if (exists) return false;

        const newId = `user-${Date.now()}`;
        const newUser: User = {
          id: newId,
          email: emailLower,
          password: userData.password || 'admin',
          name: userData.name,
          farmName: userData.farmName,
          plan: userData.plan,
          trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          teamMembers: []
        };

        const newUserSpecificData: UserSpecificData = {
          animals: [],
          soins: [],
          alertes: [],
          transactions: [],
          saillies: [],
          portees: [],
          races: ['Néo-Zélandais', 'Californien', 'Géant des Flandres', 'Race locale', 'Croisé'],
          expenseCategories: ['Alimentation (Granulés/Foin)', 'Pharmacie / Médicaments', 'Matériel / Équipement', 'Achat Animaux', 'Autre'],
          incomeCategories: ['Vente Lapins de Chair', 'Vente Reproducteurs', 'Vente Fumier', 'Autre'],
        };

        set((state) => ({
          users: [...state.users, newUser],
          usersData: {
            ...state.usersData,
            [newId]: newUserSpecificData
          }
        }));

        // Log in the newly registered user
        get().loginUser(userData.email, userData.password);
        return true;
      },

      loginUser: (email, password) => {
        const user = get().users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!user) return false;

        const userData = get().usersData[user.id] || {
          animals: [],
          soins: [],
          alertes: [],
          transactions: [],
          saillies: [],
          portees: [],
          races: ['Néo-Zélandais', 'Californien', 'Géant des Flandres', 'Race locale', 'Croisé'],
          expenseCategories: ['Alimentation (Granulés/Foin)', 'Pharmacie / Médicaments', 'Matériel / Équipement', 'Achat Animaux', 'Autre'],
          incomeCategories: ['Vente Lapins de Chair', 'Vente Reproducteurs', 'Vente Fumier', 'Autre'],
        };

        set({
          currentUser: user,
          animals: userData.animals,
          soins: userData.soins,
          alertes: userData.alertes,
          transactions: userData.transactions,
          saillies: userData.saillies,
          portees: userData.portees,
          races: userData.races,
          expenseCategories: userData.expenseCategories,
          incomeCategories: userData.incomeCategories,
          hasOnboarded: true
        });

        return true;
      },

      logoutUser: () => {
        set({
          currentUser: null,
          animals: [],
          soins: [],
          alertes: [],
          transactions: [],
          saillies: [],
          portees: [],
          races: [],
          expenseCategories: [],
          incomeCategories: [],
        });
      },

      updateUserPlan: (plan) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        const updatedUser = { ...currentUser, plan };
        set((state) => ({
          currentUser: updatedUser,
          users: state.users.map((u) => u.id === currentUser.id ? updatedUser : u)
        }));
      },

      addTeamMember: (member) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        const nextMembers = currentUser.teamMembers || [];
        const updatedMembers = [...nextMembers, { ...member, status: 'En attente' as const }];
        const updatedUser = { ...currentUser, teamMembers: updatedMembers };

        set((state) => ({
          currentUser: updatedUser,
          users: state.users.map((u) => (u.id === currentUser.id ? updatedUser : u))
        }));
      },

      addRace: (race) => set((state) => {
        const cleaned = race.trim();
        if (!cleaned) return {};
        const exists = state.races.some((r) => r.toLowerCase() === cleaned.toLowerCase());
        if (exists) return {};
        const nextRaces = [...state.races, cleaned];

        const nextUsersData = { ...state.usersData };
        if (state.currentUser) {
          nextUsersData[state.currentUser.id] = {
            ...nextUsersData[state.currentUser.id],
            races: nextRaces
          };
        }
        return { races: nextRaces, usersData: nextUsersData };
      }),

      addExpenseCategory: (category) => set((state) => {
        const cleaned = category.trim();
        if (!cleaned) return {};
        const exists = state.expenseCategories.some((c) => c.toLowerCase() === cleaned.toLowerCase());
        if (exists) return {};
        const nextCategories = [...state.expenseCategories, cleaned];

        const nextUsersData = { ...state.usersData };
        if (state.currentUser) {
          nextUsersData[state.currentUser.id] = {
            ...nextUsersData[state.currentUser.id],
            expenseCategories: nextCategories
          };
        }
        return { expenseCategories: nextCategories, usersData: nextUsersData };
      }),

      addIncomeCategory: (category) => set((state) => {
        const cleaned = category.trim();
        if (!cleaned) return {};
        const exists = state.incomeCategories.some((c) => c.toLowerCase() === cleaned.toLowerCase());
        if (exists) return {};
        const nextCategories = [...state.incomeCategories, cleaned];

        const nextUsersData = { ...state.usersData };
        if (state.currentUser) {
          nextUsersData[state.currentUser.id] = {
            ...nextUsersData[state.currentUser.id],
            incomeCategories: nextCategories
          };
        }
        return { incomeCategories: nextCategories, usersData: nextUsersData };
      }),

      addAnimal: (animal) => set((state) => {
        const nextAnimals = [...state.animals, animal];
        const nextUsersData = { ...state.usersData };
        if (state.currentUser) {
          nextUsersData[state.currentUser.id] = {
            ...nextUsersData[state.currentUser.id],
            animals: nextAnimals
          };
        }
        return { animals: nextAnimals, usersData: nextUsersData };
      }),
      
      updateAnimal: (id, updatedAnimal) => set((state) => {
        const nextAnimals = state.animals.map((a) => a.id === id ? { ...a, ...updatedAnimal } : a);
        const nextUsersData = { ...state.usersData };
        if (state.currentUser) {
          nextUsersData[state.currentUser.id] = {
            ...nextUsersData[state.currentUser.id],
            animals: nextAnimals
          };
        }
        return { animals: nextAnimals, usersData: nextUsersData };
      }),

      removeAnimal: (id) => set((state) => {
        const nextAnimals = state.animals.filter((a) => a.id !== id);
        const nextUsersData = { ...state.usersData };
        if (state.currentUser) {
          nextUsersData[state.currentUser.id] = {
            ...nextUsersData[state.currentUser.id],
            animals: nextAnimals
          };
        }
        return { animals: nextAnimals, usersData: nextUsersData };
      }),

      removeAlerte: (id) => set((state) => {
        const nextAlertes = state.alertes.filter((a) => a.id !== id);
        const nextUsersData = { ...state.usersData };
        if (state.currentUser) {
          nextUsersData[state.currentUser.id] = {
            ...nextUsersData[state.currentUser.id],
            alertes: nextAlertes
          };
        }
        return { alertes: nextAlertes, usersData: nextUsersData };
      }),

      addTransaction: (transaction) => set((state) => {
        const nextTransactions = [transaction, ...state.transactions];
        const nextUsersData = { ...state.usersData };
        if (state.currentUser) {
          nextUsersData[state.currentUser.id] = {
            ...nextUsersData[state.currentUser.id],
            transactions: nextTransactions
          };
        }
        return { transactions: nextTransactions, usersData: nextUsersData };
      }),

      updateTransaction: (id, updatedTransaction) => set((state) => {
        const nextTransactions = state.transactions.map((t) => t.id === id ? { ...t, ...updatedTransaction } : t);
        const nextUsersData = { ...state.usersData };
        if (state.currentUser) {
          nextUsersData[state.currentUser.id] = {
            ...nextUsersData[state.currentUser.id],
            transactions: nextTransactions
          };
        }
        return { transactions: nextTransactions, usersData: nextUsersData };
      }),

      removeTransaction: (id) => set((state) => {
        const nextTransactions = state.transactions.filter((t) => t.id !== id);
        const nextUsersData = { ...state.usersData };
        if (state.currentUser) {
          nextUsersData[state.currentUser.id] = {
            ...nextUsersData[state.currentUser.id],
            transactions: nextTransactions
          };
        }
        return { transactions: nextTransactions, usersData: nextUsersData };
      }),

      addSoin: (soin) => set((state) => {
        const nextSoins = [soin, ...state.soins];
        const nextUsersData = { ...state.usersData };
        if (state.currentUser) {
          nextUsersData[state.currentUser.id] = {
            ...nextUsersData[state.currentUser.id],
            soins: nextSoins
          };
        }
        return { soins: nextSoins, usersData: nextUsersData };
      }),

      updateSoin: (id, updatedSoin) => set((state) => {
        const nextSoins = state.soins.map((s) => s.id === id ? { ...s, ...updatedSoin } : s);
        const nextUsersData = { ...state.usersData };
        if (state.currentUser) {
          nextUsersData[state.currentUser.id] = {
            ...nextUsersData[state.currentUser.id],
            soins: nextSoins
          };
        }
        return { soins: nextSoins, usersData: nextUsersData };
      }),

      removeSoin: (id) => set((state) => {
        const nextSoins = state.soins.filter((s) => s.id !== id);
        const nextUsersData = { ...state.usersData };
        if (state.currentUser) {
          nextUsersData[state.currentUser.id] = {
            ...nextUsersData[state.currentUser.id],
            soins: nextSoins
          };
        }
        return { soins: nextSoins, usersData: nextUsersData };
      }),

      addSaillie: (saillie) => set((state) => {
        const nextSaillies = [...state.saillies, saillie];
        const nextUsersData = { ...state.usersData };
        if (state.currentUser) {
          nextUsersData[state.currentUser.id] = {
            ...nextUsersData[state.currentUser.id],
            saillies: nextSaillies
          };
        }
        return { saillies: nextSaillies, usersData: nextUsersData };
      }),

      updateSaillie: (id, updatedSaillie) => set((state) => {
        const nextSaillies = state.saillies.map((s) => s.id === id ? { ...s, ...updatedSaillie } : s);
        const nextUsersData = { ...state.usersData };
        if (state.currentUser) {
          nextUsersData[state.currentUser.id] = {
            ...nextUsersData[state.currentUser.id],
            saillies: nextSaillies
          };
        }
        return { saillies: nextSaillies, usersData: nextUsersData };
      }),

      removeSaillie: (id) => set((state) => {
        const nextSaillies = state.saillies.filter((s) => s.id !== id);
        const nextUsersData = { ...state.usersData };
        if (state.currentUser) {
          nextUsersData[state.currentUser.id] = {
            ...nextUsersData[state.currentUser.id],
            saillies: nextSaillies
          };
        }
        return { saillies: nextSaillies, usersData: nextUsersData };
      }),

      addPortee: (portee) => set((state) => {
        const nextPortees = [...state.portees, portee];
        const nextUsersData = { ...state.usersData };
        if (state.currentUser) {
          nextUsersData[state.currentUser.id] = {
            ...nextUsersData[state.currentUser.id],
            portees: nextPortees
          };
        }
        return { portees: nextPortees, usersData: nextUsersData };
      }),

      updatePortee: (id, updatedPortee) => set((state) => {
        const nextPortees = state.portees.map((p) => p.id === id ? { ...p, ...updatedPortee } : p);
        const nextUsersData = { ...state.usersData };
        if (state.currentUser) {
          nextUsersData[state.currentUser.id] = {
            ...nextUsersData[state.currentUser.id],
            portees: nextPortees
          };
        }
        return { portees: nextPortees, usersData: nextUsersData };
      }),

      removePortee: (id) => set((state) => {
        const nextPortees = state.portees.filter((p) => p.id !== id);
        const nextUsersData = { ...state.usersData };
        if (state.currentUser) {
          nextUsersData[state.currentUser.id] = {
            ...nextUsersData[state.currentUser.id],
            portees: nextPortees
          };
        }
        return { portees: nextPortees, usersData: nextUsersData };
      }),

      setTheme: (theme) => set({ theme }),

      importData: (jsonData) => {
        try {
          const parsed = JSON.parse(jsonData);
          if (parsed && parsed.state) {
            set(parsed.state);
            const currentUser = get().currentUser;
            if (currentUser && parsed.state.animals) {
              // Also sync user data entry
              set((state) => {
                const nextUsersData = { ...state.usersData };
                nextUsersData[currentUser.id] = {
                  animals: parsed.state.animals,
                  soins: parsed.state.soins || [],
                  alertes: parsed.state.alertes || [],
                  transactions: parsed.state.transactions || [],
                  saillies: parsed.state.saillies || [],
                  portees: parsed.state.portees || [],
                  races: parsed.state.races || [],
                  expenseCategories: parsed.state.expenseCategories || [],
                  incomeCategories: parsed.state.incomeCategories || [],
                };
                return { usersData: nextUsersData };
              });
            }
            return true;
          }
          return false;
        } catch (e) {
          console.error("Failed to parse imported data", e);
          return false;
        }
      },

      exportData: () => {
        const state = get();
        const exportObj = {
          state: {
            animals: state.animals,
            soins: state.soins,
            alertes: state.alertes,
            transactions: state.transactions,
            saillies: state.saillies,
            portees: state.portees,
            theme: state.theme,
            hasOnboarded: state.hasOnboarded,
            races: state.races,
            expenseCategories: state.expenseCategories,
            incomeCategories: state.incomeCategories,
          },
          version: 1,
          timestamp: new Date().toISOString()
        };
        return JSON.stringify(exportObj, null, 2);
      },

      resetData: () => {
        set({
          animals: [],
          santeStats: { tauxMortalite: 0, traitementsEnCours: 0, alertesSanitaires: 0 },
          soins: [],
          alertes: [],
          transactions: [],
          saillies: [],
          portees: [],
          races: ['Néo-Zélandais', 'Californien', 'Géant des Flandres', 'Race locale', 'Croisé'],
          expenseCategories: ['Alimentation (Granulés/Foin)', 'Pharmacie / Médicaments', 'Matériel / Équipement', 'Achat Animaux', 'Autre'],
          incomeCategories: ['Vente Lapins de Chair', 'Vente Reproducteurs', 'Vente Fumier', 'Autre'],
        });

        const currentUser = get().currentUser;
        if (currentUser) {
          set((state) => {
            const nextUsersData = { ...state.usersData };
            nextUsersData[currentUser.id] = {
              animals: [],
              soins: [],
              alertes: [],
              transactions: [],
              saillies: [],
              portees: [],
              races: ['Néo-Zélandais', 'Californien', 'Géant des Flandres', 'Race locale', 'Croisé'],
              expenseCategories: ['Alimentation (Granulés/Foin)', 'Pharmacie / Médicaments', 'Matériel / Équipement', 'Achat Animaux', 'Autre'],
              incomeCategories: ['Vente Lapins de Chair', 'Vente Reproducteurs', 'Vente Fumier', 'Autre'],
            };
            return { usersData: nextUsersData };
          });
        }
      },
    }),
    {
      name: 'gestion-lapins-saas-storage',
    }
  )
);
