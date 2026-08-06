/**
 * SmartCare Guardian - Core TypeScript Types & Models
 * Defines all domain entities for children, vitals, alerts, care notes, medications, AI insights, access management, and settings.
 */

export type UserRole = 'parent' | 'caregiver';

export interface User {
  id: string;
  fullName: string;
  preferredName?: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export type VitalsStatus = 'stable' | 'warning' | 'critical';

export interface VitalHistoryPoint {
  time: string;
  value: number;
}

export interface VitalsData {
  heartRate: number; // bpm
  spO2: number; // %
  temperature: number; // °C
  activity: string; // 'Resting' | 'Active' | 'Sleeping' | 'Fussy'
  status: VitalsStatus;
  statusMessage: string;
  lastUpdated: string;
  heartRateTrend: VitalHistoryPoint[];
  spO2Trend: VitalHistoryPoint[];
  tempTrend: VitalHistoryPoint[];
  sleepQualityHours: number;
}

export interface ChildProfile {
  id: string;
  legalName: string;
  preferredName: string;
  dateOfBirth: string;
  ageYears: number;
  gender: 'male' | 'female' | 'other';
  avatarUrl?: string;
  bloodGroup: string;
  weightKg: number;
  heightCm: number;
  primaryPhysician: string;
  activeDiagnoses: string[];
  allergies: { name: string; severity: 'mild' | 'moderate' | 'severe' }[];
  specialInstructions: string;
  currentVitals: VitalsData;
  connectedDevicesCount: number;
  deviceStatus: string;
}

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface Alert {
  id: string;
  childId: string;
  childName: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  timestamp: string;
  metricType?: 'heart_rate' | 'spo2' | 'temperature' | 'battery' | 'camera';
  currentValue?: string;
  normalRange?: string;
  acknowledgedBy?: string;
  resolvedBy?: string;
  resolutionNote?: string;
}

export type DoseStatus = 'pending' | 'given' | 'snoozed';

export interface Medication {
  id: string;
  childId: string;
  name: string;
  brandName?: string;
  dosage: string;
  form: string; // e.g. 'Oral Suspension', 'Capsule'
  scheduledTime: string;
  instructions: string;
  status: DoseStatus;
  givenAt?: string;
}

export type NoteCategory = 'general' | 'medication' | 'sleep' | 'behaviour' | 'feeding' | 'symptom';

export interface CareNote {
  id: string;
  childId: string;
  authorName: string;
  authorRole: UserRole;
  category: NoteCategory;
  title: string;
  content: string;
  timestamp: string;
  photoUrl?: string;
}

export type RiskLevel = 'low' | 'moderate' | 'high';

export interface ContributingFactor {
  name: string;
  detail: string;
  impact: 'High Impact' | 'Med Impact' | 'Low Impact';
}

export interface AIRiskInsight {
  id: string;
  childId: string;
  title: string;
  riskLevel: RiskLevel;
  confidencePercentage: number;
  summary: string;
  generatedAt: string;
  contributingFactors: ContributingFactor[];
  disclaimer: string;
}

export type AccessPermission = 'full' | 'view_only' | 'restricted_hours';

export interface AdultAccess {
  id: string;
  name: string;
  email: string;
  roleDescription: string;
  isCurrentUser: boolean;
  permission: AccessPermission;
  scheduleRestriction?: string; // e.g. "Mon-Fri, 8AM - 5PM"
  avatarUrl?: string;
}

export type AppTheme = 'system' | 'light' | 'dark';
export type AppLanguage = 'en' | 'si' | 'ta';

export interface AppSettings {
  theme: AppTheme;
  language: AppLanguage;
  criticalAlerts: boolean;
  medicationReminders: boolean;
  deviceStatusWarnings: boolean;
  biometricUnlock: boolean;
  caregiverCameraAccess: boolean;
  textScaling: 'default' | 'large' | 'extra_large';
  highContrast: boolean;
}
