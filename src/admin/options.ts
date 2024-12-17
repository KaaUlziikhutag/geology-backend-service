import { AdminJSOptions } from 'adminjs';
import { componentLoader, Dashboard } from './component.bundler.js';
import { translate } from './locale/translate.js';
import resources from './resources/index.js';

const options: AdminJSOptions = {
  dashboard: {
    component: Dashboard,
  },
  componentLoader: componentLoader,
  rootPath: '/admin',
  resources,
  branding: {
    companyName: 'Central Geological Laboratory',
    logo: '/images/horizontal-logo.png',
    favicon: '/images/logo.png',
    withMadeWithLove: false,
  },
  version: {
    admin: true,
    app: '1.0.0',
  },
  settings: {
    defaultPerPage: 15,
  },
  locale: translate,
};

export default options;
