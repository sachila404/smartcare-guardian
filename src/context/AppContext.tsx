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

interface AppContextType {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => void;
  register: (name: string, email: string, role: UserRole) => void;
  logout: () => void;
  switchUserRole: (role: UserRole) => void;

  // Children Management
  children: ChildProfile[];
  activeChildId: string;
  activeChild: ChildProfile | undefined;
  setActiveChildId: (id: string) => void;
  addChild: (newChild: Partial<ChildProfile>) => void;
  updateChildProfile: (id: string, updates: Partial<ChildProfile>) => void;

  // Live Vitals Stream
  isLiveStreaming: boolean;
  setIsLiveStreaming: (active: boolean) => void;
  triggerSimulatedAlert: () => void;

  // Alerts
  alerts: Alert[];
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string, note: string) => void;

  // Medications
  medications: Medication[];
  markMedicationGiven: (medId: string) => void;
  snoozeMedication: (medId: string) => void;

  // Care Notes
  careNotes: CareNote[];
  addCareNote: (note: Omit<CareNote, 'id' | 'timestamp' | 'authorName' | 'authorRole'>) => void;

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
  selectedDetailView: string | null; // e.g. 'heart_rate', 'seizure_risk', 'critical_alert', 'report_builder', 'access_mgmt', 'add_child', 'settings'
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
  const [user, setUser] = useState<User | null>(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [childrenList, setChildrenList] = useState<ChildProfile[]>(initialChildren);
  const [activeChildId, setActiveChildId] = useState<string>('child-1');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);

  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [careNotes, setCareNotes] = useState<CareNote[]>(initialCareNotes);
  const [aiRiskInsight] = useState<AIRiskInsight>(initialAIRiskInsight);
  const [linkedAdults, setLinkedAdults] = useState<AdultAccess[]>(initialLinkedAdults);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);

  const [activeTab, setActiveTab] = useState<'home' | 'live' | 'alerts' | 'insights' | 'profile'>('home');
  const [selectedDetailView, setSelectedDetailView] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'switch_child' | 'add_note' | 'resolve_alert' | null>(null);
  const [selectedAlertForResolution, setSelectedAlertForResolution] = useState<Alert | null>(null);

  const activeChild = useMemo(() => {
    return childrenList.find((c) => c.id === activeChildId) || childrenList[0];
  }, [childrenList, activeChildId]);

  // Auth Handlers
  const login = (email: string, role: UserRole = 'parent') => {
    setUser({
      id: 'u-' + Date.now(),
      fullName: email.split('@')[0].replace('.', ' ') || 'Guardian User',
      email,
      role,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    });
    setIsAuthenticated(true);
  };

  const register = (name: string, email: string, role: UserRole) => {
    setUser({
      id: 'u-' + Date.now(),
      fullName: name,
      email,
      role,
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const switchUserRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  // Children Handlers
  const addChild = (newChildData: Partial<ChildProfile>) => {
    const newChild: ChildProfile = {
      id: 'child-' + Date.now(),
      legalName: newChildData.legalName || 'New Child',
      preferredName: newChildData.preferredName || newChildData.legalName || 'Child',
      dateOfBirth: newChildData.dateOfBirth || '2022-01-01',
      ageYears: newChildData.ageYears || 2,
      gender: newChildData.gender || 'male',
      avatarUrl: newChildData.avatarUrl || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
      bloodGroup: newChildData.bloodGroup || 'O+',
      weightKg: newChildData.weightKg || 15,
      heightCm: newChildData.heightCm || 95,
      primaryPhysician: newChildData.primaryPhysician || 'Dr. Pediatrician',
      activeDiagnoses: newChildData.activeDiagnoses || [],
      allergies: newChildData.allergies || [],
      specialInstructions: newChildData.specialInstructions || 'None',
      connectedDevicesCount: 1,
      deviceStatus: 'Smart Band Paired',
      currentVitals: {
        heartRate: 80,
        spO2: 98,
        temperature: 36.7,
        activity: 'Resting',
        status: 'stable',
        statusMessage: 'All readings normal.',
        lastUpdated: 'Just now',
        heartRateTrend: [],
        spO2Trend: [],
        tempTrend: [],
        sleepQualityHours: 8.0,
      },
    };

    setChildrenList((prev) => [...prev, newChild]);
    setActiveChildId(newChild.id);
  };

  const updateChildProfile = (id: string, updates: Partial<ChildProfile>) => {
    setChildrenList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  // Live Vitals Simulation Ticker
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setChildrenList((prev) =>
        prev.map((child) => {
          if (child.id !== activeChildId) return child;

          // Small subtle fluctuations
          const hrDelta = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
          const spO2Delta = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          const tempDelta = Number(((Math.random() * 0.1) - 0.05).toFixed(1));

          const newHR = Math.min(140, Math.max(65, child.currentVitals.heartRate + hrDelta));
          const newSpO2 = Math.min(100, Math.max(92, child.currentVitals.spO2 + spO2Delta));
          const newTemp = Number(Math.min(39.5, Math.max(36.0, child.currentVitals.temperature + tempDelta)).toFixed(1));

          const nowStr = 'Just now';

          const newHRTrend = [
            ...child.currentVitals.heartRateTrend.slice(-6),
            { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), value: newHR },
          ];

          return {
            ...child,
            currentVitals: {
              ...child.currentVitals,
              heartRate: newHR,
              spO2: newSpO2,
              temperature: newTemp,
              lastUpdated: nowStr,
              heartRateTrend: newHRTrend,
            },
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveStreaming, activeChildId]);

  // Alert Trigger Simulator
  const triggerSimulatedAlert = () => {
    const newAlert: Alert = {
      id: 'alt-' + Date.now(),
      childId: activeChild.id,
      childName: activeChild.preferredName,
      title: 'SpO2 Drop Detected',
      description: 'Oxygen saturation dropped to 91% for 45 seconds. Immediate inspection advised.',
      severity: 'critical',
      status: 'active',
      timestamp: 'Just now',
      metricType: 'spo2',
      currentValue: '91%',
      normalRange: '95 - 100%',
    };

    setAlerts((prev) => [newAlert, ...prev]);
  };

  // Alert Handlers
  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'acknowledged', acknowledgedBy: user?.fullName } : a))
    );
  };

  const resolveAlert = (alertId: string, note: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, status: 'resolved', resolvedBy: user?.fullName, resolutionNote: note }
          : a
      )
    );

    // Auto add a care note
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
  const markMedicationGiven = (medId: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMedications((prev) =>
      prev.map((m) =>
        m.id === medId ? { ...m, status: 'given', givenAt: timeNow } : m
      )
    );

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

  const snoozeMedication = (medId: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === medId ? { ...m, status: 'snoozed' } : m))
    );
  };

  // Care Note Handlers
  const addCareNote = (noteData: Omit<CareNote, 'id' | 'timestamp' | 'authorName' | 'authorRole'>) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newNote: CareNote = {
      ...noteData,
      id: 'note-' + Date.now(),
      timestamp: timeNow,
      authorName: user?.fullName || 'Caregiver',
      authorRole: user?.role || 'parent',
    };
    setCareNotes((prev) => [newNote, ...prev]);
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

        children: childrenList,
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
