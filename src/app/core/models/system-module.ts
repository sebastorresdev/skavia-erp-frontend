import { MenuItem } from 'primeng/api';

export interface SystemModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  gradient?: string;
  route: string;

  badge?: number;
  comingSoon?: boolean;

  requiredPermissions?: string[];
  requiredRoles?: string[];
  items: MenuItem[];
}
