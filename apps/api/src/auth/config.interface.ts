import { AppInfo } from 'supertokens-node/types';

export const ConfigInjectionToken = 'ConfigInjectionToken';

export type AuthModuleConfig = {
    appInfo: AppInfo;
    connectionURI: string;
    apiKey: string;
    githubClientId: string;
    githubClientSecret: string;
    DashboardApiKey: string;
};
