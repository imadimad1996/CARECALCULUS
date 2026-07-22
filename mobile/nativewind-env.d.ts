/// <reference types="nativewind/types" />

declare module 'lucide-react-native' {
  import { ComponentType } from 'react';
  import { SvgProps } from 'react-native-svg';

  export interface LucideProps extends SvgProps {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    className?: string;
    fill?: string;
    style?: any;
  }

  export type Icon = ComponentType<LucideProps>;

  export const Home: Icon;
  export const Calculator: Icon;
  export const Users: Icon;
  export const Settings: Icon;
  export const Search: Icon;
  export const Filter: Icon;
  export const X: Icon;
  export const Star: Icon;
  export const AlertTriangle: Icon;
  export const ChevronRight: Icon;
  export const ChevronLeft: Icon;
  export const ShieldCheck: Icon;
  export const Stethoscope: Icon;
  export const RefreshCw: Icon;
  export const Zap: Icon;
  export const ShieldAlert: Icon;
  export const Sparkles: Icon;
  export const WifiOff: Icon;
  export const FileText: Icon;
  export const Trash2: Icon;
  export const Copy: Icon;
  export const PlusCircle: Icon;
  export const Clock: Icon;
  export const BedDouble: Icon;
  export const Smartphone: Icon;
  export const Database: Icon;
  export const Lock: Icon;
  export const Info: Icon;
  export const ExternalLink: Icon;
  export const Check: Icon;
  export const BookOpen: Icon;
  export const UserPlus: Icon;
  export const Share2: Icon;
}
