/**
 * ChemLab-G9 V1.6 Diagnosis Engine
 * Identifies weak knowledge areas and recommends review paths
 */

export class DiagnosisEngine {
  constructor(knowledgeGraph, assessment) {
    this.graph = knowledgeGraph;
    this.assessment = assessment;
  }

  diagnose(progress) {
    const nodes = this.graph.nodes || [];
    const mistakes = this.assessment.getMistakeSummary();

    const diagnosis = {
      weakPoints: [],
      recommendedReview: [],
      overallScore: 0,
      totalAttempts: 0,
      totalCorrect: 0,
    };

    for (const node of nodes) {
      const nodeId = node.id;
      const p = progress[nodeId];
      const score = p ? p.score : 0;
      const mistakesCount = mistakes[nodeId]?.count || 0;

      if (mistakesCount > 0 || score < 0.5) {
        diagnosis.weakPoints.push({
          id: nodeId,
          name: node.name,
          score,
          mistakes: mistakesCount,
          questions: mistakes[nodeId]?.questions || [],
        });
      }
    }

    diagnosis.weakPoints.sort((a, b) => a.score - b.score || b.mistakes - a.mistakes);
    diagnosis.recommendedReview = diagnosis.weakPoints.slice(0, 8);
    diagnosis.overallScore = nodes.length > 0
      ? Math.round(nodes.reduce((s, n) => s + (progress[n.id]?.score || 0), 0) / nodes.length * 100)
      : 0;

    return diagnosis;
  }

  getPrerequisiteChain(nodeId) {
    const node = this.graph.nodes?.find(n => n.id === nodeId);
    if (!node) return [];
    const chain = [nodeId];
    const visited = new Set([nodeId]);
    const prereqs = node.relations?.prerequisite || [];
    for (const req of prereqs) {
      if (!visited.has(req)) {
        visited.add(req);
        chain.push(req);
        const reqNode = this.graph.nodes?.find(n => n.id === req);
        if (reqNode) {
          for (const subReq of (reqNode.relations?.prerequisite || [])) {
            if (!visited.has(subReq)) {
              visited.add(subReq);
              chain.push(subReq);
            }
          }
        }
      }
    }
    return chain;
  }
}

export default DiagnosisEngine;
