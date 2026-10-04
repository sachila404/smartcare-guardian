
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
});
const db = admin.firestore();
const CHILD_ID = process.env.CHILD_ID;

const THRESHOLDS = { heartRateHigh: 150, heartRateLow: 60, spO2Low: 92, temperatureFever: 38.0 };

function randomWalk(prev, min, max, step) {
  return Math.min(max, Math.max(min, Number((prev + (Math.random() - 0.5) * step).toFixed(1))));
}
function maybeSpike(value, chance, amount) {
  return Math.random() < chance ? value + amount : value;
}

async function run() {
  const liveRef = db.doc(`children/${CHILD_ID}/vitalsLive/current`);
  const prevSnap = await liveRef.get();
  const prev = prevSnap.exists ? prevSnap.data() : { heartRate: 90, spO2: 98, temperature: 36.8 };

  const heartRate = Math.round(maybeSpike(randomWalk(prev.heartRate, 70, 130, 6), 0.1, 40));
  const spO2 = Math.round(maybeSpike(randomWalk(prev.spO2, 94, 100, 1), 0.08, -8));
  const temperature = Number(maybeSpike(randomWalk(prev.temperature, 36.2, 37.5, 0.2), 0.08, 1.8).toFixed(1));
  const activity = ['Resting', 'Active', 'Sleeping', 'Fussy'][Math.floor(Math.random() * 4)];

  const reading = { heartRate, spO2, temperature, activity, lastUpdated: admin.firestore.FieldValue.serverTimestamp() };

  await liveRef.set(reading, { merge: true });
  await db.collection(`children/${CHILD_ID}/vitalsHistory`).add(reading);
  console.log('Wrote reading:', reading);

  const childSnap = await db.doc(`children/${CHILD_ID}`).get();
  const childName = childSnap.data()?.preferredName ?? 'Child';
  const alertsToCreate = [];

  if (temperature >= THRESHOLDS.temperatureFever) {
    alertsToCreate.push({ title: 'Fever Alert', description: `Temperature ${temperature}°C exceeds threshold.`, severity: 'critical', metricType: 'temperature', currentValue: `${temperature}°C`, normalRange: '36.1–37.2°C' });
  }
  if (heartRate >= THRESHOLDS.heartRateHigh || heartRate <= THRESHOLDS.heartRateLow) {
    alertsToCreate.push({ title: 'Abnormal Heartbeat', description: `Heart rate ${heartRate} bpm is out of range.`, severity: 'warning', metricType: 'heart_rate', currentValue: `${heartRate} bpm`, normalRange: '70–130 bpm' });
  }
  if (spO2 <= THRESHOLDS.spO2Low) {
    alertsToCreate.push({ title: 'Breathing Problem Detected', description: `Oxygen saturation dropped to ${spO2}%.`, severity: 'critical', metricType: 'spo2', currentValue: `${spO2}%`, normalRange: '95–100%' });
  }

  for (const alert of alertsToCreate) {
    await db.collection('alerts').add({ ...alert, childId: CHILD_ID, childName, status: 'active', timestamp: admin.firestore.FieldValue.serverTimestamp() });
    console.log('Created alert:', alert.title);
  }
}

run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });