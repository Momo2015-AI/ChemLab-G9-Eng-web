// Error Type Model
// V1.7 Phase 6 foundation

export const ERROR_TYPES = {
  KNOWLEDGE_GAP: 'knowledge-gap',
  CONCEPT_CONFUSION: 'concept-confusion',
  OPERATION_ERROR: 'operation-error',
  CALCULATION_ERROR: 'calculation-error',
  EXPERIMENT_ERROR: 'experiment-error'
};

export function createErrorRecord({type, description, knowledge=[]}) {
  return {
    type,
    description,
    knowledge,
    createdAt: new Date().toISOString()
  };
}
