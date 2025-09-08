import NetInfo from '@react-native-community/netinfo';

export const isConnectedToOfficeWiFi = async (officeSSID: string): Promise<boolean> => {
  const state = await NetInfo.fetch();
  console.log("STATE",state,'CHECKING',(state.type === 'wifi' && state.details?.ssid === officeSSID))
  return state.type === 'wifi' && state.details?.ssid === officeSSID;
};