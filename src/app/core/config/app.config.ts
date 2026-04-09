import { environment } from '../../../environments/environment';

export const AppConfig = {
  url: environment.url,
} as const;