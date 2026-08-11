import { routes } from '../navigation/routes.js';

export class ChemLabApplication {
  constructor(root) {
    this.root = root;
    this.routes = routes;
  }

  start() {
    this.root.dataset.app = 'chemlab-portal';
  }
}
