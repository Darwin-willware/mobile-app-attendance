import NetInfo from '@react-native-community/netinfo';

export const isConnectedToOfficeWiFi = async (officeSSID: string): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.type === 'wifi' && state.details?.ssid === officeSSID;
};