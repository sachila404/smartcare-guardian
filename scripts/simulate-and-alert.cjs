const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const app = initializeApp({
  credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
});
const db = getFirestore(app);
const CHILD_ID = process.env.CHILD_ID;
const MODEL_API_URL = process.env.MODEL_API_URL;

function randomWalk(prev, min, max, step) {
  return Math.min(max, Math.max(min, Number((prev + (Math.random() - 0.5) * step).toFixed(1))));
}
function maybeSpike(value, chance, amount) {
  return Math.random() < chance ? value + amount : value;
}

async function getModelPrediction(reading, ageMonths) {
  const res = await fetch(`${MODEL_API_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      heartRate: reading.heartRate,
      spO2: reading.spO2,
      temperature: reading.temperature,
      ageMonths: ageMonths || 24,
      activity: reading.activity.toLowerCase(),
      sleepHoursLast24: 9,
      movementIndex: Math.random(),
      hourOfDay: new Date().getHours(),
    }),
  });
  if (!res.ok) throw new Error(`Model API returned ${res.status}`);
  return res.json();
}

const ALERT_INFO = {
  fever: { title: 'Fever Alert', metricType: 'temperature', normalRange: '36.1–37.2°C', valueKey: 'temperature', unit: '°C' },
  tachycardia: { title: 'Abnormal Heartbeat (Tachycardia)', metricType: 'heart_rate', normalRange: '70–130 bpm', valueKey: 'heartRate', unit: ' bpm' },
  bradycardia: { title: 'Abnormal Heartbeat (Bradycardia)', metricType: 'heart_rate', normalRange: '70–130 bpm', valueKey: 'heartRate', unit: ' bpm' },
  hypoxia: { title: 'Breathing Problem Detected', metricType: 'spo2', normalRange: '95–100%', valueKey: 'spO2', unit: '%' },
  sleep_disturbance: { title: 'Sleep Disturbance Detected', metricType: 'sleep', normalRange: '7+ hours', valueKey: null, unit: '' },
};

async function run() {
  const liveRef = db.doc(`children/${CHILD_ID}/vitalsLive/current`);
  const prevSnap = await liveRef.get();
  const prev = prevSnap.exists ? prevSnap.data() : { heartRate: 90, spO2: 98, temperature: 36.8 };

  const heartRate = Math.round(maybeSpike(randomWalk(prev.heartRate, 70, 130, 6), 0.1, 40));
  const spO2 = Math.round(maybeSpike(randomWalk(prev.spO2, 94, 100, 1), 0.08, -8));
  const temperature = Number(maybeSpike(randomWalk(prev.temperature, 36.2, 37.5, 0.2), 0.08, 1.8).toFixed(1));
  const activity = ['Resting', 'Active', 'Sleeping', 'Fussy'][Math.floor(Math.random() * 4)];

  const reading = { heartRate, spO2, temperature, activity, lastUpdated: FieldValue.serverTimestamp() };

  await liveRef.set(reading, { merge: true });
  await db.collection(`children/${CHILD_ID}/vitalsHistory`).add(reading);
  console.log('Wrote reading:', reading);

  const childSnap = await db.doc(`children/${CHILD_ID}`).get();
  const childName = childSnap.data()?.preferredName ?? 'Child';
  const ageYears = childSnap.data()?.ageYears ?? 2;

  let modelResult;
  try {
    modelResult = await getModelPrediction(reading, ageYears * 12);
    console.log('Model prediction:', modelResult);
  } catch (err) {
    console.error('Model API call failed, skipping alert evaluation this run:', err.message);
    return;
  }

  for (const condition of modelResult.activeConditions) {
    const info = ALERT_INFO[condition];
    if (!info) continue;
    const confidence = modelResult.predictions[condition]?.confidence ?? 0;
    const currentValue = info.valueKey ? `${reading[info.valueKey]}${info.unit}` : `${reading.activity}`;

    await db.collection('alerts').add({
      childId: CHILD_ID,
      childName,
      title: info.title,
      description: `AI model flagged ${condition.replace('_', ' ')} with ${(confidence * 100).toFixed(1)}% confidence.`,
      severity: modelResult.severity,
      status: 'active',
      timestamp: FieldValue.serverTimestamp(),
      metricType: info.metricType,
      currentValue,
      normalRange: info.normalRange,
    });
    console.log('Created alert:', info.title);
  }
}

run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });