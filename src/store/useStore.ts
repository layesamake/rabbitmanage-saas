import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

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
  name: string;
  farmName: string;
  plan: 'free' | 'pro' | 'enterprise';
  trialEnd: string;
  teamMembers?: TeamMember[];
}

interface AppState {
  currentUser: User | null;
  isLoading: boolean;
  
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
  registerUser: (userData: { email: string; password?: string; name: string; farmName: string; plan: 'free' | 'pro' | 'enterprise' }) => Promise<boolean>;
  loginUser: (email: string, password?: string) => Promise<boolean>;
  logoutUser: () => Promise<void>;
  updateUserPlan: (plan: 'free' | 'pro' | 'enterprise') => Promise<void>;
  addTeamMember: (member: Omit<TeamMember, 'status'>) => Promise<void>;
  setOnboarded: (value: boolean) => void;
  loadUserData: (userId: string, email: string) => Promise<void>;
  initializeSession: () => Promise<void>;
  
  // App Logic Actions
  addRace: (race: string) => Promise<void>;
  addExpenseCategory: (category: string) => Promise<void>;
  addIncomeCategory: (category: string) => Promise<void>;
  addAnimal: (animal: Animal) => Promise<void>;
  updateAnimal: (id: string, animal: Partial<Animal>) => Promise<void>;
  removeAnimal: (id: string) => Promise<void>;
  removeAlerte: (id: number) => Promise<void>;
  addTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  addSoin: (soin: any) => Promise<void>;
  updateSoin: (id: number, soin: Partial<any>) => Promise<void>;
  removeSoin: (id: number) => Promise<void>;
  addSaillie: (saillie: Saillie) => Promise<void>;
  updateSaillie: (id: number, saillie: Partial<Saillie>) => Promise<void>;
  removeSaillie: (id: number) => Promise<void>;
  addPortee: (portee: Portee) => Promise<void>;
  updatePortee: (id: string, portee: Partial<Portee>) => Promise<void>;
  removePortee: (id: string) => Promise<void>;
  setTheme: (theme: string) => void;
  resetData: () => Promise<void>;
  importData: (data: string) => boolean;
  exportData: () => string;
}

// Data Mappers (snake_case from Supabase <=> camelCase for UI)
const mappers = {
  animal: {
    fromDB: (db: any): Animal => ({
      id: db.id,
      status: db.status,
      type: db.type,
      location: db.location,
      badgeColor: db.badge_color,
      image: db.image,
      name: db.name,
      gender: db.gender,
      race: db.race,
      age: db.age,
      weight: db.weight,
      naissance: db.naissance,
      origine: db.origine,
      cage: db.cage,
      robe: db.robe,
      observations: db.observations
    }),
    toDB: (animal: Animal, userId: string) => ({
      id: animal.id,
      user_id: userId,
      status: animal.status,
      type: animal.type,
      location: animal.location,
      badge_color: animal.badgeColor,
      image: animal.image,
      name: animal.name,
      gender: animal.gender,
      race: animal.race,
      age: animal.age,
      weight: animal.weight,
      naissance: animal.naissance,
      origine: animal.origine,
      cage: animal.cage,
      robe: animal.robe,
      observations: animal.observations
    })
  },
  saillie: {
    fromDB: (db: any): Saillie => ({
      id: db.id,
      female: db.female,
      male: db.male,
      status: db.status,
      statusBadgeColor: db.status_badge_color,
      date: db.date,
      expectedDate: db.expected_date,
      hasControlToday: db.has_control_today,
      type: db.type
    }),
    toDB: (s: Saillie, userId: string) => ({
      user_id: userId,
      female: s.female,
      male: s.male,
      status: s.status,
      status_badge_color: s.statusBadgeColor,
      date: s.date,
      expected_date: s.expectedDate,
      has_control_today: s.hasControlToday,
      type: s.type
    })
  },
  portee: {
    fromDB: (db: any): Portee => ({
      id: db.id,
      status: db.status,
      female: db.female,
      age: db.age,
      effectif: db.effectif,
      sevrage: db.sevrage,
      badgeColor: db.badge_color,
      dateMiseBas: db.date_mise_bas,
      totalNes: db.total_nes,
      nesVivants: db.nes_vivants,
      mortsNes: db.morts_nes,
      cage: db.cage,
      observations: db.observations
    }),
    toDB: (p: Portee, userId: string) => ({
      id: p.id,
      user_id: userId,
      status: p.status,
      female: p.female,
      age: p.age,
      effectif: p.effectif,
      sevrage: p.sevrage,
      badge_color: p.badgeColor,
      date_mise_bas: p.dateMiseBas,
      total_nes: p.totalNes,
      nes_vivants: p.nesVivants,
      morts_nes: p.mortsNes,
      cage: p.cage,
      observations: p.observations
    })
  },
  soin: {
    fromDB: (db: any) => ({
      id: db.id,
      animalId: db.animal_id,
      type: db.type,
      category: db.category,
      status: db.status,
      statusColor: db.status_color,
      date: db.date,
      isToday: db.is_today,
      isLate: db.is_late
    }),
    toDB: (s: any, userId: string) => ({
      user_id: userId,
      animal_id: s.animalId,
      type: s.type,
      category: s.category,
      status: s.status,
      status_color: s.statusColor,
      date: s.date,
      is_today: s.isToday,
      is_late: s.isLate
    })
  },
  alerte: {
    fromDB: (db: any) => ({
      id: db.id,
      type: db.type,
      typeColor: db.type_color,
      subject: db.subject,
      title: db.title,
      subtitle: db.subtitle,
      icon: db.icon,
      time: db.time,
      primaryAction: db.primary_action,
      secondaryAction: db.secondary_action,
      primaryColor: db.primary_color,
      description: db.description
    }),
    toDB: (a: any, userId: string) => ({
      user_id: userId,
      type: a.type,
      type_color: a.typeColor,
      subject: a.subject,
      title: a.title,
      subtitle: a.subtitle,
      icon: a.icon,
      time: a.time,
      primary_action: a.primaryAction,
      secondary_action: a.secondaryAction,
      primary_color: a.primaryColor,
      description: a.description
    })
  },
  transaction: {
    fromDB: (db: any): Transaction => ({
      id: db.id,
      date: db.date,
      type: db.type,
      category: db.category,
      amount: Number(db.amount),
      description: db.description
    }),
    toDB: (t: Transaction, userId: string) => ({
      id: t.id,
      user_id: userId,
      date: t.date,
      type: t.type,
      category: t.category,
      amount: t.amount,
      description: t.description
    })
  }
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isLoading: false,

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

      registerUser: async (userData) => {
        try {
          set({ isLoading: true });
          const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password || 'admin123',
            options: {
              data: {
                name: userData.name,
                farmName: userData.farmName,
                plan: userData.plan
              }
            }
          });

          if (error || !data.user) {
            console.error('Error signing up:', error);
            set({ isLoading: false });
            return false;
          }

          // Trigger handle_new_user executes on DB.
          // Wait a brief moment for trigger, then log in.
          await get().loginUser(userData.email, userData.password || 'admin123');
          set({ isLoading: false });
          return true;
        } catch (e) {
          console.error(e);
          set({ isLoading: false });
          return false;
        }
      },

      loginUser: async (email, password) => {
        try {
          set({ isLoading: true });
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: password || 'admin123'
          });

          if (error || !data.user) {
            console.error('Error signing in:', error);
            set({ isLoading: false });
            return false;
          }

          await get().loadUserData(data.user.id, data.user.email || email);
          set({ isLoading: false });
          return true;
        } catch (e) {
          console.error(e);
          set({ isLoading: false });
          return false;
        }
      },

      logoutUser: async () => {
        set({ isLoading: true });
        await supabase.auth.signOut();
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
          isLoading: false
        });
      },

      loadUserData: async (userId, email) => {
        try {
          // Fetch Profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

          // Fetch Cheptel
          const { data: animals } = await supabase.from('animals').select('*').eq('user_id', userId);
          // Fetch Saillies
          const { data: saillies } = await supabase.from('saillies').select('*').eq('user_id', userId);
          // Fetch Portees
          const { data: portees } = await supabase.from('portees').select('*').eq('user_id', userId);
          // Fetch Soins
          const { data: soins } = await supabase.from('soins').select('*').eq('user_id', userId);
          // Fetch Transactions
          const { data: transactions } = await supabase.from('transactions').select('*').eq('user_id', userId);
          // Fetch Alertes
          const { data: alertes } = await supabase.from('alertes').select('*').eq('user_id', userId);
          // Fetch races, categories
          const { data: dbRaces } = await supabase.from('races').select('name').eq('user_id', userId);
          const { data: dbExpenseCats } = await supabase.from('expense_categories').select('name').eq('user_id', userId);
          const { data: dbIncomeCats } = await supabase.from('income_categories').select('name').eq('user_id', userId);
          // Fetch team members
          const { data: teamMembers } = await supabase.from('team_members').select('*').eq('user_id', userId);

          const mappedAnimals = (animals || []).map(mappers.animal.fromDB);
          const mappedSaillies = (saillies || []).map(mappers.saillie.fromDB);
          const mappedPortees = (portees || []).map(mappers.portee.fromDB);
          const mappedSoins = (soins || []).map(mappers.soin.fromDB);
          const mappedTransactions = (transactions || []).map(mappers.transaction.fromDB);
          const mappedAlertes = (alertes || []).map(mappers.alerte.fromDB);

          const defaultRaces = ['Néo-Zélandais', 'Californien', 'Géant des Flandres', 'Race locale', 'Croisé'];
          const defaultExpenseCats = ['Alimentation (Granulés/Foin)', 'Pharmacie / Médicaments', 'Matériel / Équipement', 'Achat Animaux', 'Autre'];
          const defaultIncomeCats = ['Vente Lapins de Chair', 'Vente Reproducteurs', 'Vente Fumier', 'Autre'];

          set({
            currentUser: {
              id: userId,
              email: email,
              name: profile?.name || 'Éleveur',
              farmName: profile?.farm_name || 'Mon Élevage',
              plan: profile?.plan || 'free',
              trialEnd: profile?.trial_end || new Date().toISOString(),
              teamMembers: (teamMembers || []).map(tm => ({
                name: tm.name,
                email: tm.email,
                role: tm.role,
                status: tm.status
              }))
            },
            animals: mappedAnimals,
            saillies: mappedSaillies,
            portees: mappedPortees,
            soins: mappedSoins,
            transactions: mappedTransactions,
            alertes: mappedAlertes,
            races: dbRaces && dbRaces.length > 0 ? dbRaces.map(r => r.name) : defaultRaces,
            expenseCategories: dbExpenseCats && dbExpenseCats.length > 0 ? dbExpenseCats.map(r => r.name) : defaultExpenseCats,
            incomeCategories: dbIncomeCats && dbIncomeCats.length > 0 ? dbIncomeCats.map(r => r.name) : defaultIncomeCats,
            hasOnboarded: true
          });
        } catch (e) {
          console.error('Failed to load user data from Supabase:', e);
        }
      },

      initializeSession: async () => {
        try {
          set({ isLoading: true });
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await get().loadUserData(session.user.id, session.user.email || '');
          }
          set({ isLoading: false });
        } catch (e) {
          console.error('Failed to initialize session:', e);
          set({ isLoading: false });
        }
      },

      updateUserPlan: async (plan) => {
        const user = get().currentUser;
        if (!user) return;

        const { error } = await supabase
          .from('profiles')
          .update({ plan })
          .eq('id', user.id);

        if (!error) {
          const updatedUser = { ...user, plan };
          set({ currentUser: updatedUser });
        } else {
          console.error('Error updating plan:', error);
        }
      },

      addTeamMember: async (member) => {
        const user = get().currentUser;
        if (!user) return;

        const { error } = await supabase
          .from('team_members')
          .insert({
            user_id: user.id,
            name: member.name,
            email: member.email,
            role: member.role,
            status: 'En attente'
          });

        if (!error) {
          const updatedMembers: TeamMember[] = [
            ...(user.teamMembers || []),
            { ...member, status: 'En attente' }
          ];
          set({
            currentUser: {
              ...user,
              teamMembers: updatedMembers
            }
          });
        } else {
          console.error('Error adding team member:', error);
        }
      },

      addRace: async (race) => {
        const user = get().currentUser;
        if (!user) return;

        const cleaned = race.trim();
        if (!cleaned) return;
        const exists = get().races.some((r) => r.toLowerCase() === cleaned.toLowerCase());
        if (exists) return;

        const { error } = await supabase
          .from('races')
          .insert({ user_id: user.id, name: cleaned });

        if (!error) {
          set((state) => ({ races: [...state.races, cleaned] }));
        }
      },

      addExpenseCategory: async (category) => {
        const user = get().currentUser;
        if (!user) return;

        const cleaned = category.trim();
        if (!cleaned) return;
        const exists = get().expenseCategories.some((c) => c.toLowerCase() === cleaned.toLowerCase());
        if (exists) return;

        const { error } = await supabase
          .from('expense_categories')
          .insert({ user_id: user.id, name: cleaned });

        if (!error) {
          set((state) => ({ expenseCategories: [...state.expenseCategories, cleaned] }));
        }
      },

      addIncomeCategory: async (category) => {
        const user = get().currentUser;
        if (!user) return;

        const cleaned = category.trim();
        if (!cleaned) return;
        const exists = get().incomeCategories.some((c) => c.toLowerCase() === cleaned.toLowerCase());
        if (exists) return;

        const { error } = await supabase
          .from('income_categories')
          .insert({ user_id: user.id, name: cleaned });

        if (!error) {
          set((state) => ({ incomeCategories: [...state.incomeCategories, cleaned] }));
        }
      },

      addAnimal: async (animal) => {
        const user = get().currentUser;
        if (!user) return;

        const dbData = mappers.animal.toDB(animal, user.id);
        const { error } = await supabase
          .from('animals')
          .insert(dbData);

        if (!error) {
          set((state) => ({ animals: [...state.animals, animal] }));
        } else {
          console.error('Error adding animal:', error);
        }
      },

      updateAnimal: async (id, updatedAnimal) => {
        const user = get().currentUser;
        if (!user) return;

        const animal = get().animals.find(a => a.id === id);
        if (!animal) return;

        const mergedAnimal = { ...animal, ...updatedAnimal };
        const dbData = mappers.animal.toDB(mergedAnimal, user.id);

        const { error } = await supabase
          .from('animals')
          .update(dbData)
          .eq('id', id);

        if (!error) {
          set((state) => ({
            animals: state.animals.map(a => a.id === id ? mergedAnimal : a)
          }));
        } else {
          console.error('Error updating animal:', error);
        }
      },

      removeAnimal: async (id) => {
        const { error } = await supabase
          .from('animals')
          .delete()
          .eq('id', id);

        if (!error) {
          set((state) => ({
            animals: state.animals.filter(a => a.id !== id)
          }));
        }
      },

      removeAlerte: async (id) => {
        const { error } = await supabase
          .from('alertes')
          .delete()
          .eq('id', id);

        if (!error) {
          set((state) => ({
            alertes: state.alertes.filter(a => a.id !== id)
          }));
        }
      },

      addTransaction: async (transaction) => {
        const user = get().currentUser;
        if (!user) return;

        const dbData = mappers.transaction.toDB(transaction, user.id);
        const { error } = await supabase
          .from('transactions')
          .insert(dbData);

        if (!error) {
          set((state) => ({
            transactions: [transaction, ...state.transactions]
          }));
        }
      },

      updateTransaction: async (id, updatedTransaction) => {
        const user = get().currentUser;
        if (!user) return;

        const tx = get().transactions.find(t => t.id === id);
        if (!tx) return;

        const mergedTx = { ...tx, ...updatedTransaction };
        const dbData = mappers.transaction.toDB(mergedTx, user.id);

        const { error } = await supabase
          .from('transactions')
          .update(dbData)
          .eq('id', id);

        if (!error) {
          set((state) => ({
            transactions: state.transactions.map(t => t.id === id ? mergedTx : t)
          }));
        }
      },

      removeTransaction: async (id) => {
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', id);

        if (!error) {
          set((state) => ({
            transactions: state.transactions.filter(t => t.id !== id)
          }));
        }
      },

      addSoin: async (soin) => {
        const user = get().currentUser;
        if (!user) return;

        const dbData = mappers.soin.toDB(soin, user.id);
        const { data, error } = await supabase
          .from('soins')
          .insert(dbData)
          .select()
          .single();

        if (!error && data) {
          set((state) => ({
            soins: [mappers.soin.fromDB(data), ...state.soins]
          }));
        }
      },

      updateSoin: async (id, updatedSoin) => {
        const user = get().currentUser;
        if (!user) return;

        const soin = get().soins.find(s => s.id === id);
        if (!soin) return;

        const mergedSoin = { ...soin, ...updatedSoin };
        const dbData = mappers.soin.toDB(mergedSoin, user.id);

        const { error } = await supabase
          .from('soins')
          .update(dbData)
          .eq('id', id);

        if (!error) {
          set((state) => ({
            soins: state.soins.map(s => s.id === id ? mergedSoin : s)
          }));
        }
      },

      removeSoin: async (id) => {
        const { error } = await supabase
          .from('soins')
          .delete()
          .eq('id', id);

        if (!error) {
          set((state) => ({
            soins: state.soins.filter(s => s.id !== id)
          }));
        }
      },

      addSaillie: async (saillie) => {
        const user = get().currentUser;
        if (!user) return;

        const dbData = mappers.saillie.toDB(saillie, user.id);
        const { data, error } = await supabase
          .from('saillies')
          .insert(dbData)
          .select()
          .single();

        if (!error && data) {
          set((state) => ({
            saillies: [...state.saillies, mappers.saillie.fromDB(data)]
          }));
        }
      },

      updateSaillie: async (id, updatedSaillie) => {
        const user = get().currentUser;
        if (!user) return;

        const saillie = get().saillies.find(s => s.id === id);
        if (!saillie) return;

        const mergedSaillie = { ...saillie, ...updatedSaillie };
        const dbData = mappers.saillie.toDB(mergedSaillie, user.id);

        const { error } = await supabase
          .from('saillies')
          .update(dbData)
          .eq('id', id);

        if (!error) {
          set((state) => ({
            saillies: state.saillies.map(s => s.id === id ? mergedSaillie : s)
          }));
        }
      },

      removeSaillie: async (id) => {
        const { error } = await supabase
          .from('saillies')
          .delete()
          .eq('id', id);

        if (!error) {
          set((state) => ({
            saillies: state.saillies.filter(s => s.id !== id)
          }));
        }
      },

      addPortee: async (portee) => {
        const user = get().currentUser;
        if (!user) return;

        const dbData = mappers.portee.toDB(portee, user.id);
        const { error } = await supabase
          .from('portees')
          .insert(dbData);

        if (!error) {
          set((state) => ({
            portees: [...state.portees, portee]
          }));
        }
      },

      updatePortee: async (id, updatedPortee) => {
        const user = get().currentUser;
        if (!user) return;

        const portee = get().portees.find(p => p.id === id);
        if (!portee) return;

        const mergedPortee = { ...portee, ...updatedPortee };
        const dbData = mappers.portee.toDB(mergedPortee, user.id);

        const { error } = await supabase
          .from('portees')
          .update(dbData)
          .eq('id', id);

        if (!error) {
          set((state) => ({
            portees: state.portees.map(p => p.id === id ? mergedPortee : p)
          }));
        }
      },

      removePortee: async (id) => {
        const { error } = await supabase
          .from('portees')
          .delete()
          .eq('id', id);

        if (!error) {
          set((state) => ({
            portees: state.portees.filter(p => p.id !== id)
          }));
        }
      },

      setTheme: (theme) => set({ theme }),

      resetData: async () => {
        const user = get().currentUser;
        if (!user) return;

        set({ isLoading: true });
        await supabase.from('animals').delete().eq('user_id', user.id);
        await supabase.from('portees').delete().eq('user_id', user.id);
        await supabase.from('saillies').delete().eq('user_id', user.id);
        await supabase.from('soins').delete().eq('user_id', user.id);
        await supabase.from('transactions').delete().eq('user_id', user.id);
        await supabase.from('alertes').delete().eq('user_id', user.id);

        set({
          animals: [],
          santeStats: { tauxMortalite: 0, traitementsEnCours: 0, alertesSanitaires: 0 },
          soins: [],
          alertes: [],
          transactions: [],
          saillies: [],
          portees: [],
          isLoading: false
        });
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
            races: state.races,
            expenseCategories: state.expenseCategories,
            incomeCategories: state.incomeCategories,
          },
          version: 2,
          timestamp: new Date().toISOString()
        };
        return JSON.stringify(exportObj, null, 2);
      },

      importData: (jsonData) => {
        try {
          const parsed = JSON.parse(jsonData);
          if (parsed && parsed.state) {
            set(parsed.state);
            return true;
          }
          return false;
        } catch (e) {
          console.error("Échec du parsing des données importées", e);
          return false;
        }
      },
    }),
    {
      name: 'gestion-lapins-saas-supabase-theme',
      partialize: (state) => ({ theme: state.theme, hasOnboarded: state.hasOnboarded }),
    }
  )
);
