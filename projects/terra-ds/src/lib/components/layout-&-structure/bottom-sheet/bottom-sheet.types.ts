import type { IconNameType } from '../icon/icon.component';

export type BottomSheetDragState = 'idle' | 'dragging' | 'closing';

export interface BottomSheetAction {
  label: string;
  icon?: IconNameType;
  disabled?: boolean;
  loading?: boolean;
  intent?: 'branding' | 'neutral';
  action?: () => void;
  closeOnClick?: boolean;
}
