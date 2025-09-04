import { isConnectedToOfficeWiFi } from "./wifi-check";

// export const validateUserPresence = async (
//   officeLat: number,
//   officeLng: number,
//   officeSSID: string
// ): Promise<UserPresence> => {
//   const isInLocation = await isUserInOffice(officeLat, officeLng);
//   const isOnWiFi = await isConnectedToOfficeWiFi(officeSSID);
//   return { isInLocation, isOnWiFi };
// };

export const validateUserPresence = async (
  officeLat: number,
  officeLng: number,
  officeSSID: string
): Promise<boolean> => {
  const isOnWiFi = await isConnectedToOfficeWiFi(officeSSID);
  return  isOnWiFi ;
};