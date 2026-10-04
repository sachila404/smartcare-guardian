import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  UserRole,
  ChildProfile,
  VitalsData,
  Alert,
  Medication,
  CareNote,
  AIRiskInsight,
  AdultAccess,
  AppSettings,
} from '../types';

import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

import { loginUser, registerUser, logoutUser, onAuthStateChanged, auth, getUserDoc } from '../firebase/auth';

import { useGuardianChildren, useAlerts, useMedications, useCareNotes, useLiveVitals } from '../firebase/hooks';
const DEFAULT_VITALS: VitalsData = {
  heartRate: 0,
  spO2: 0,
  temperature: 0,
  activity: 'Unknown',
  status: 'stable',
  statusMessage: 'Waiting for sensor data...',
  lastUpdated: 'No data yet',
  heartRateTrend: [],
  spO2Trend: [],
  tempTrend: [],
  sleepQualityHours: 0,
};

function withSafeDefaults(child: ChildProfile): ChildProfile {
  return {
    ...child,
    avatarUrl: child.avatarUrl || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150',
    primaryPhysician: child.primaryPhysician || 'Not set',
    activeDiagnoses: child.activeDiagnoses || [],
    allergies: child.allergies || [],
    specialInstructions: child.specialInstructions || 'None recorded',
    currentVitals: child.currentVitals || DEFAULT_VITALS,
    connectedDevicesCount: child.connectedDevicesCount ?? 0,
    deviceStatus: child.deviceStatus || 'No device data yet',
  };
}
interface AppContextType {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  switchUserRole: (role: UserRole) => void;

  // Children Management
  children: ChildProfile[];
  activeChildId: string;
  activeChild: ChildProfile | undefined;
  setActiveChildId: (id: string) => void;
  addChild: (newChild: Partial<ChildProfile>) => Promise<void>;
  updateChildProfile: (id: string, updates: Partial<ChildProfile>) => Promise<void>;

  // Live Vitals Stream
  isLiveStreaming: boolean;
  setIsLiveStreaming: (active: boolean) => void;
  triggerSimulatedAlert: () => Promise<void>;

  // Alerts
  alerts: Alert[];
  acknowledgeAlert: (alertId: string) => Promise<void>;
  resolveAlert: (alertId: string, note: string) => Promise<void>;

  // Medications
  medications: Medication[];
  markMedicationGiven: (medId: string) => Promise<void>;
  snoozeMedication: (medId: string) => Promise<void>;

  // Care Notes
  careNotes: CareNote[];
  addCareNote: (note: Omit<CareNote, 'id' | 'timestamp' | 'authorName' | 'authorRole'>) => Promise<void>;

  // AI Insights
  aiRiskInsight: AIRiskInsight;

  // Access Management
  linkedAdults: AdultAccess[];
  addCaregiverAccess: (adult: Omit<AdultAccess, 'id' | 'isCurrentUser'>) => void;
  removeCaregiverAccess: (id: string) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;

  // Navigation / Modal triggers
  activeTab: 'home' | 'live' | 'alerts' | 'insights' | 'profile';
  setActiveTab: (tab: 'home' | 'live' | 'alerts' | 'insights' | 'profile') => void;
  selectedDetailView: string | null;
  setSelectedDetailView: (view: string | null) => void;
  activeModal: 'switch_child' | 'add_note' | 'resolve_alert' | null;
  setActiveModal: (modal: 'switch_child' | 'add_note' | 'resolve_alert' | null) => void;
  selectedAlertForResolution: Alert | null;
  setSelectedAlertForResolution: (alert: Alert | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Mock Datasets matching Stitch Design Specifications
const initialUser: User = {
  id: 'u-1',
  fullName: 'Maya Perera',
  preferredName: 'Maya',
  email: 'guardian@smartcare.com',
  role: 'parent',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
};

const initialChildren: ChildProfile[] = [
  {
    id: 'child-1',
    legalName: 'Aarav Perera',
    preferredName: 'Aarav',
    dateOfBirth: '2021-05-12',
    ageYears: 3,
    gender: 'male',
    avatarUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'A+',
    weightKg: 22,
    heightCm: 115,
    primaryPhysician: 'Dr. S. Chen',
    activeDiagnoses: ['Asthma (Mild)', 'Eczema'],
    allergies: [
      { name: 'Peanuts', severity: 'severe' },
      { name: 'Dust Mites', severity: 'mild' },
    ],
    specialInstructions:
      'Aarav uses a low-dose inhaler (Albuterol) as needed before intense physical activity. Needs a quiet space for 10 minutes if feeling overstimulated in crowded areas.',
    connectedDevicesCount: 2,
    deviceStatus: 'Guardian Band & Camera Connected',
    currentVitals: {
      heartRate: 82,
      spO2: 98,
      temperature: 36.8,
      activity: 'Resting',
      status: 'stable',
      statusMessage: 'All readings are within normal range. Aarav is currently resting peacefully.',
      lastUpdated: 'Just now',
      heartRateTrend: [
        { time: '10:00', value: 78 },
        { time: '10:15', value: 88 },
        { time: '10:30', value: 82 },
        { time: '10:45', value: 85 },
        { time: 'Now', value: 82 },
      ],
      spO2Trend: [
        { time: '10:00', value: 98 },
        { time: '10:15', value: 97 },
        { time: '10:30', value: 98 },
        { time: '10:45', value: 99 },
        { time: 'Now', value: 98 },
      ],
      tempTrend: [
        { time: '10:00', value: 36.7 },
        { time: '10:15', value: 36.8 },
        { time: '10:30', value: 36.8 },
        { time: '10:45', value: 36.9 },
        { time: 'Now', value: 36.8 },
      ],
      sleepQualityHours: 8.25,
    },
  },
  {
    id: 'child-2',
    legalName: 'Diya Perera',
    preferredName: 'Diya',
    dateOfBirth: '2019-09-20',
    ageYears: 5,
    gender: 'female',
    avatarUrl: 'https://images.unsplash.com/photo-1595454038955-4dfe8de71be8?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'O+',
    weightKg: 18,
    heightCm: 108,
    primaryPhysician: 'Dr. S. Chen',
    activeDiagnoses: ['Seasonal Allergies'],
    allergies: [{ name: 'Pollen', severity: 'mild' }],
    specialInstructions: 'Give antihistamine before outdoor play during allergy season.',
    connectedDevicesCount: 1,
    deviceStatus: 'Smart Band Online',
    currentVitals: {
      heartRate: 76,
      spO2: 99,
      temperature: 36.6,
      activity: 'Sleeping',
      status: 'stable',
      statusMessage: 'Diya is sleeping peacefully.',
      lastUpdated: '2 min ago',
      heartRateTrend: [
        { time: '10:00', value: 74 },
        { time: '10:15', value: 76 },
        { time: '10:30', value: 75 },
        { time: '10:45', value: 77 },
        { time: 'Now', value: 76 },
      ],
      spO2Trend: [
        { time: '10:00', value: 99 },
        { time: '10:15', value: 99 },
        { time: '10:30', value: 98 },
        { time: '10:45', value: 99 },
        { time: 'Now', value: 99 },
      ],
      tempTrend: [
        { time: '10:00', value: 36.5 },
        { time: '10:15', value: 36.6 },
        { time: '10:30', value: 36.6 },
        { time: '10:45', value: 36.6 },
        { time: 'Now', value: 36.6 },
      ],
      sleepQualityHours: 9.0,
    },
  },
  {
    id: 'child-3',
    legalName: 'Leo Miller',
    preferredName: 'Leo',
    dateOfBirth: '2017-03-14',
    ageYears: 7,
    gender: 'male',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'B+',
    weightKg: 24,
    heightCm: 122,
    primaryPhysician: 'Dr. R. Sharma',
    activeDiagnoses: [],
    allergies: [],
    specialInstructions: 'Regular checkups normal.',
    connectedDevicesCount: 1,
    deviceStatus: 'Guardian Band Connected',
    currentVitals: {
      heartRate: 85,
      spO2: 98,
      temperature: 36.7,
      activity: 'Active',
      status: 'stable',
      statusMessage: 'All vitals normal.',
      lastUpdated: '1 min ago',
      heartRateTrend: [],
      spO2Trend: [],
      tempTrend: [],
      sleepQualityHours: 8.5,
    },
  },
  {
    id: 'child-4',
    legalName: 'Maya Singh',
    preferredName: 'Maya S.',
    dateOfBirth: '2019-11-05',
    ageYears: 5,
    gender: 'female',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'AB+',
    weightKg: 19,
    heightCm: 110,
    primaryPhysician: 'Dr. K. Patel',
    activeDiagnoses: ['Mild Fever'],
    allergies: [{ name: 'Penicillin', severity: 'severe' }],
    specialInstructions: 'Monitor temperature every 2 hours.',
    connectedDevicesCount: 1,
    deviceStatus: 'Syncing... (2 min ago)',
    currentVitals: {
      heartRate: 104,
      spO2: 96,
      temperature: 38.2,
      activity: 'Resting',
      status: 'warning',
      statusMessage: 'Elevated temperature detected (38.2°C). Monitoring advised.',
      lastUpdated: '2 min ago',
      heartRateTrend: [],
      spO2Trend: [],
      tempTrend: [],
      sleepQualityHours: 7.0,
    },
  },
];

const initialAlerts: Alert[] = [
  {
    id: 'alt-1',
    childId: 'child-1',
    childName: 'Aarav Perera',
    title: 'Elevated Heart Rate',
    description: 'Heart rate spiked to 145 bpm for over 3 minutes. Please check patient immediately.',
    severity: 'critical',
    status: 'active',
    timestamp: '2m ago',
    metricType: 'heart_rate',
    currentValue: '112 bpm',
    normalRange: '70-100 bpm',
  },
  {
    id: 'alt-2',
    childId: 'child-1',
    childName: 'Aarav Perera',
    title: 'Mild Fever Detected',
    description: 'Temperature reading is 38.2°C. Monitoring advised.',
    severity: 'warning',
    status: 'active',
    timestamp: '15m ago',
    metricType: 'temperature',
    currentValue: '38.2°C',
    normalRange: '36.5 - 37.5°C',
  },
  {
    id: 'alt-3',
    childId: 'child-1',
    childName: 'Aarav Perera',
    title: 'Sensor Battery Low',
    description: 'Battery level below 20%. Please recharge soon to ensure continuous monitoring.',
    severity: 'info',
    status: 'active',
    timestamp: '2h ago',
    metricType: 'battery',
    currentValue: '18%',
  },
];

const initialMedications: Medication[] = [
  {
    id: 'med-1',
    childId: 'child-1',
    name: 'Ibuprofen (Advil)',
    dosage: '5ml',
    form: 'Oral Suspension',
    scheduledTime: '10:30 AM',
    instructions: 'Give with food to prevent stomach upset.',
    status: 'pending',
  },
  {
    id: 'med-2',
    childId: 'child-1',
    name: 'Amoxicillin',
    dosage: '250mg',
    form: 'Capsule',
    scheduledTime: '8:15 AM',
    instructions: 'Take full course with glass of water.',
    status: 'given',
    givenAt: '8:15 AM',
  },
];

const initialCareNotes: CareNote[] = [
  {
    id: 'note-1',
    childId: 'child-1',
    authorName: 'Maya Perera',
    authorRole: 'parent',
    category: 'sleep',
    title: 'Sleep Started',
    content: 'Nap time started peacefully.',
    timestamp: '1:15 PM',
  },
  {
    id: 'note-2',
    childId: 'child-1',
    authorName: 'Maria Rossi',
    authorRole: 'caregiver',
    category: 'feeding',
    title: 'Meal Logged',
    content: 'Finished full lunch (rice and soft vegetables with apple juice).',
    timestamp: '12:30 PM',
  },
  {
    id: 'note-3',
    childId: 'child-1',
    authorName: 'Maya Perera',
    authorRole: 'parent',
    category: 'general',
    title: 'Alert Resolved',
    content: 'High Heart Rate resolved with note: "Child was excited during play".',
    timestamp: '10:45 AM',
  },
  {
    id: 'note-4',
    childId: 'child-1',
    authorName: 'Maya Perera',
    authorRole: 'parent',
    category: 'medication',
    title: 'Medication Administered',
    content: 'Ibuprofen 5ml given by Parent.',
    timestamp: '10:30 AM',
  },
];

const initialAIRiskInsight: AIRiskInsight = {
  id: 'air-1',
  childId: 'child-1',
  title: 'Seizure Risk Indicator',
  riskLevel: 'moderate',
  confidencePercentage: 84,
  summary: 'Elevated risk pattern detected based on continuous monitoring data over the last 4 hours.',
  generatedAt: '10:42 PM',
  contributingFactors: [
    { name: 'Elevated Temperature', detail: '+1.2°C over baseline (38.4°C)', impact: 'High Impact' },
    { name: 'Interrupted Sleep', detail: '3 micro-awakenings in past hour', impact: 'Med Impact' },
    { name: 'HRV Variance', detail: '15% drop from baseline', impact: 'Med Impact' },
  ],
  disclaimer:
    'This AI insight supports monitoring based on historical data patterns and does not replace professional medical assessment. Always prioritize clinical judgment and seek immediate medical attention if symptoms worsen.',
};

const initialLinkedAdults: AdultAccess[] = [
  {
    id: 'la-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@smartcare.com',
    roleDescription: 'Primary Parent',
    isCurrentUser: true,
    permission: 'full',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'la-2',
    name: 'David Jenkins',
    email: 'david.j@smartcare.com',
    roleDescription: 'Parent',
    isCurrentUser: false,
    permission: 'full',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'la-3',
    name: 'Maria Rossi',
    email: 'maria.rossi@nannycare.com',
    roleDescription: 'Caregiver',
    isCurrentUser: false,
    permission: 'view_only',
    scheduleRestriction: 'Mon-Fri, 8AM - 5PM',
    avatarUrl: '',
  },
];

const initialSettings: AppSettings = {
  theme: 'light',
  language: 'en',
  criticalAlerts: true,
  medicationReminders: true,
  deviceStatusWarnings: false,
  biometricUnlock: true,
  caregiverCameraAccess: false,
  textScaling: 'default',
  highContrast: false,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const childrenList = useGuardianChildren(user?.id);
  const [activeChildId, setActiveChildId] = useState<string>('');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);

  const childIds = useMemo(() => childrenList.map((c) => c.id), [childrenList]);
  const alerts = useAlerts(childIds);
  const medications = useMedications(childIds);
  const careNotes = useCareNotes(childIds);
  const [aiRiskInsight] = useState<AIRiskInsight>(initialAIRiskInsight);
  const [linkedAdults, setLinkedAdults] = useState<AdultAccess[]>(initialLinkedAdults);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getUserDoc(firebaseUser.uid);
        if (userDoc) {
          setUser(userDoc as User);
          setIsAuthenticated(true);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
    return unsubscribe;
  }, []);

  const [activeTab, setActiveTab] = useState<'home' | 'live' | 'alerts' | 'insights' | 'profile'>('home');
  const [selectedDetailView, setSelectedDetailView] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'switch_child' | 'add_note' | 'resolve_alert' | null>(null);
  const [selectedAlertForResolution, setSelectedAlertForResolution] = useState<Alert | null>(null);

   const safeChildrenList = useMemo(() => childrenList.map(withSafeDefaults), [childrenList]);
  const liveVitals = useLiveVitals(activeChildId);

  const activeChild = useMemo(() => {
    const base = safeChildrenList.find((c) => c.id === activeChildId) || safeChildrenList[0];
    if (!base) return undefined;
    if (!liveVitals) return base;
    return {
      ...base,
      currentVitals: {
        ...base.currentVitals,
        heartRate: liveVitals.heartRate ?? base.currentVitals.heartRate,
        spO2: liveVitals.spO2 ?? base.currentVitals.spO2,
        temperature: liveVitals.temperature ?? base.currentVitals.temperature,
        activity: liveVitals.activity ?? base.currentVitals.activity,
        statusMessage: 'Live data connected.',
        lastUpdated: 'Just now',
      },
    };
  }, [safeChildrenList, activeChildId, liveVitals]);

  // Auth Handlers
 const login = async (email: string, password: string) => {
    await loginUser(email, password);
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    await registerUser(name, email, password, role);
  };

  const logout = async () => {
    await logoutUser();
  };

  const switchUserRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  // Children Handlers
  const addChild = async (newChildData: Partial<ChildProfile>) => {
    if (!user) return;
    const docRef = await addDoc(collection(db, 'children'), {
      legalName: newChildData.legalName || 'New Child',
      preferredName: newChildData.preferredName || newChildData.legalName || 'Child',
      dateOfBirth: newChildData.dateOfBirth || '2022-01-01',
      ageYears: newChildData.ageYears || 2,
      gender: newChildData.gender || 'male',
      bloodGroup: newChildData.bloodGroup || 'O+',
      weightKg: newChildData.weightKg || 15,
      heightCm: newChildData.heightCm || 95,
      primaryPhysician: newChildData.primaryPhysician || 'Dr. Pediatrician',
      activeDiagnoses: newChildData.activeDiagnoses || [],
      allergies: newChildData.allergies || [],
      specialInstructions: newChildData.specialInstructions || 'None',
      guardians: [user.id],
    });
    setActiveChildId(docRef.id);
  };

  const updateChildProfile = async (id: string, updates: Partial<ChildProfile>) => {
    await updateDoc(doc(db, 'children', id), updates as any);
  };

  // Live Vitals Simulation Ticker
// Live Vitals Simulation Ticker — disabled, real vitals now stream from Firestore via the GitHub Actions simulator

  // Alert Trigger Simulator
  const triggerSimulatedAlert = async () => {
    if (!activeChild) return;
    await addDoc(collection(db, 'alerts'), {
      childId: activeChild.id,
      childName: activeChild.preferredName,
      title: 'SpO2 Drop Detected',
      description: 'Oxygen saturation dropped to 91% for 45 seconds. Immediate inspection advised.',
      severity: 'critical',
      status: 'active',
      timestamp: serverTimestamp(),
      metricType: 'spo2',
      currentValue: '91%',
      normalRange: '95 - 100%',
    });
  };

  const acknowledgeAlert = async (alertId: string) => {
    await updateDoc(doc(db, 'alerts', alertId), {
      status: 'acknowledged',
      acknowledgedBy: user?.fullName,
    });
  };

  const resolveAlert = async (alertId: string, note: string) => {
    await updateDoc(doc(db, 'alerts', alertId), {
      status: 'resolved',
      resolvedBy: user?.fullName,
      resolutionNote: note,
    });

    const alertObj = alerts.find((a) => a.id === alertId);
    if (alertObj) {
      addCareNote({
        childId: alertObj.childId,
        category: 'general',
        title: 'Alert Resolved',
        content: `${alertObj.title} resolved with note: "${note}"`,
      });
    }
  };

   
  // Medication Handlers
  const markMedicationGiven = async (medId: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    await updateDoc(doc(db, 'medications', medId), { status: 'given', givenAt: timeNow });

    const medObj = medications.find((m) => m.id === medId);
    if (medObj) {
      addCareNote({
        childId: medObj.childId,
        category: 'medication',
        title: 'Medication Administered',
        content: `${medObj.name} ${medObj.dosage} given by ${user?.role === 'parent' ? 'Parent' : 'Caregiver'}.`,
      });
    }
  };

  const snoozeMedication = async (medId: string) => {
    await updateDoc(doc(db, 'medications', medId), { status: 'snoozed' });
  };

  // Care Note Handlers
  const addCareNote = async (noteData: Omit<CareNote, 'id' | 'timestamp' | 'authorName' | 'authorRole'>) => {
    await addDoc(collection(db, 'careNotes'), {
      ...noteData,
      timestamp: serverTimestamp(),
      authorName: user?.fullName || 'Caregiver',
      authorRole: user?.role || 'parent',
    });
  };

  // Access Management
  const addCaregiverAccess = (adultData: Omit<AdultAccess, 'id' | 'isCurrentUser'>) => {
    const newAdult: AdultAccess = {
      ...adultData,
      id: 'la-' + Date.now(),
      isCurrentUser: false,
    };
    setLinkedAdults((prev) => [...prev, newAdult]);
  };

  const removeCaregiverAccess = (id: string) => {
    setLinkedAdults((prev) => prev.filter((a) => a.id !== id));
  };

  // Settings
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        switchUserRole,

        children: safeChildrenList,
        activeChildId,
        activeChild,
        setActiveChildId,
        addChild,
        updateChildProfile,

        isLiveStreaming,
        setIsLiveStreaming,
        triggerSimulatedAlert,

        alerts,
        acknowledgeAlert,
        resolveAlert,

        medications,
        markMedicationGiven,
        snoozeMedication,

        careNotes,
        addCareNote,

        aiRiskInsight,

        linkedAdults,
        addCaregiverAccess,
        removeCaregiverAccess,

        settings,
        updateSettings,

        activeTab,
        setActiveTab,
        selectedDetailView,
        setSelectedDetailView,
        activeModal,
        setActiveModal,
        selectedAlertForResolution,
        setSelectedAlertForResolution,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
