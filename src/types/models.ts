import { ColorValue, PressableProps } from "react-native";

export type UserPresence = { isInLocation: boolean; isOnWiFi: boolean };

export type GoogleUser = {
  name: string|null;
  email: string;
  photo: string|null;
  idToken: string;
};

export type CustomButtonProps = {
  text: string;
  gradientColors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
} & PressableProps;

export type GetUserDetailsParams = {
  email?: string;
  userId?: string;
};

export type CheckInResult = { check_in_time: string } | { error: string };

export type CheckOutResult = { check_out_time: string; total_hours: string } | { error: string };

export type Status = 'idle' | 'checkedin' | 'checkedout';

export type BottomModalSheetProps = {
  visible: boolean;
  onClose: () => void;
  userId: string;
};

export type RequestType = 'leave' | 'wfh';

export type ApplyResult = 
  | { success: true } 
  | { success: false; message: string } 
  | { conflict: RequestType };