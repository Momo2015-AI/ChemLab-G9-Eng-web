export const knowledgeSchema = {
  id: '',
  name: '',
  category: '',
  description: '',
  level: 'basic',
  experiments: [],
  questions: [],
  errors: []
};

export function createKnowledge(data = {}) {
  return {
    ...knowledgeSchema,
    ...data
  };
}
