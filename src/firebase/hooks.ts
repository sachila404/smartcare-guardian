import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './config';
import type { ChildProfile, Alert, Medication, CareNote } from '../types';

export function useGuardianChildren(uid: string | undefined) {
  const [children, setChildren] = useState<ChildProfile[]>([]);
  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, 'children'), where('guardians', 'array-contains', uid));
    return onSnapshot(q, (snap) => setChildren(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChildProfile))));
  }, [uid]);
  return children;
}

export function useLiveVitals(childId: string | undefined) {
  const [vitals, setVitals] = useState<any>(null);
  useEffect(() => {
    if (!childId) return;
    return onSnapshot(doc(db, 'children', childId, 'vitalsLive', 'current'), (snap) => setVitals(snap.data()));
  }, [childId]);
  return vitals;
}

export function useAlerts(childIds: string[]) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  useEffect(() => {
    if (childIds.length === 0) return;
    const q = query(collection(db, 'alerts'), where('childId', 'in', childIds.slice(0, 10)));
    return onSnapshot(q, (snap) => setAlerts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Alert))));
  }, [childIds.join(',')]);
  return alerts;
}

export function useMedications(childIds: string[]) {
  const [medications, setMedications] = useState<Medication[]>([]);
  useEffect(() => {
    if (childIds.length === 0) return;
    const q = query(collection(db, 'medications'), where('childId', 'in', childIds.slice(0, 10)));
    return onSnapshot(q, (snap) => setMedications(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Medication))));
  }, [childIds.join(',')]);
  return medications;
}

export function useCareNotes(childIds: string[]) {
  const [careNotes, setCareNotes] = useState<CareNote[]>([]);
  useEffect(() => {
    if (childIds.length === 0) return;
    const q = query(collection(db, 'careNotes'), where('childId', 'in', childIds.slice(0, 10)));
    return onSnapshot(q, (snap) => setCareNotes(snap.docs.map((d) => ({ id: d.id, ...d.data() } as CareNote))));
  }, [childIds.join(',')]);
  return careNotes;
}