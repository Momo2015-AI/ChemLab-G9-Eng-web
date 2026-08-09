// V1.6 Phase 10.5
// Local learning record model

const STORAGE_KEY = 'chemlab_learning_records';

export function saveLearningRecord(record) {
  const records = loadLearningRecords();
  records.push({
    ...record,
    timestamp: new Date().toISOString()
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function loadLearningRecords() {
  return JSON.parse(
    localStorage.getItem(STORAGE_KEY) || '[]'
  );
}

export function getExperimentRecords(experimentId) {
  return loadLearningRecords().filter(
    item => item.experiment === experimentId
  );
}
