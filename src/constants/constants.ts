import { ColorValue } from "react-native";

export const Lat = 11.53769;
export const Long = 79.3296565;
export const SSID = 'JioFiber-JeENX_5G';
export const HOME_SSID = 'Sathriyan-2.4G';

export const supabaseUrl='https://ztackpyyiusmsppwjsse.supabase.co';
export const supabseAnonKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0YWNrcHl5aXVzbXNwcHdqc3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDkyMjMsImV4cCI6MjA2OTk4NTIyM30.2QiXy684Y4EsyJfIe8clhRO86_nxVzYuXKGKrXg_qHI';

export const oAuthWebClientId ='996503523872-h89tpt84rgkvob14p2vb03eih3ao228k.apps.googleusercontent.com';

// constants/gradients.ts
 const fallBackButtonGradient: readonly [ColorValue, ColorValue] = ['#4353FD', '#7A5CFA'];
 const MoreButtonGradient: readonly [ColorValue, ColorValue] = ['#00F5FF', '#0088FF'];
 const SignOutButtonGradient: readonly [ColorValue, ColorValue] = ['#FF4E50', '#F9D423'];
 const SignInButtonGradient: readonly [ColorValue, ColorValue] = ['#8E2DE2', '#4A00E0'];
 const CheckInGradient: readonly [ColorValue, ColorValue] = ['#a8e063', '#56ab2f'] ; 
const checkOutGradient: readonly [ColorValue, ColorValue] = ['#ff6e7f', '#3b5998']; 
const defaultCardGradient: readonly [ColorValue, ColorValue] = ['#43cea2', '#0f2027'];
 const BgGradient:readonly [ColorValue, ColorValue,ColorValue]= ['#0f0c29', '#302b63', '#24243e'];

export const Gradients={
    btn:fallBackButtonGradient,
    more:MoreButtonGradient,
    signOut:SignOutButtonGradient,
    signIn:SignInButtonGradient,
    checkIn:CheckInGradient,
    checkOut:checkOutGradient,
    defaultCard:defaultCardGradient,
    bg:BgGradient
}