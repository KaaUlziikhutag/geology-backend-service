import { ComponentLoader, OverridableComponent } from 'adminjs';
import path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
export const componentLoader = new ComponentLoader();

export const add = (url: string, componentName: string): string =>
  componentLoader.add(componentName, path.join(__dirname, url));

export const override = (
  url: string,
  componentName: OverridableComponent,
): string => componentLoader.override(componentName, path.join(__dirname, url));

/**
 * Overridable components
 */
// override('components/top-bar', 'Version');
// override('components/login', 'Login');
// override('components/sidebar-resource-section', 'SidebarResourceSection');

/**
 * Common components
 */
// export const UPLOAD_FILE = add('components/upload-file', 'UploadFile');
// export const SHOW_FILE = add('components/show-file', 'ShowFile');
// export const JOB_BULK_CREATE = add(
//   'components/job-bulk-create',
//   'JobBulkCreate',
// );
// export const DONT_TOUCH_THIS_ACTION = add('components/dont-touch-this-action', 'CustomAction');
// export const DISTRICT_SELECT = add(
//   'components/DistrictSelect',
//   'DistrictSelect',
// );

/**
 * Pages
 */
export const Dashboard = add('pages/dashboard', 'Dashboard');
// export const DESIGN_SYSTEM_PAGE = add('pages/design-system-examples/index', 'DesignSystemPage');
