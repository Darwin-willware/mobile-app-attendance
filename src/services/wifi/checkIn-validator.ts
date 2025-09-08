import { UserPresence } from "@/src/types/models";
import { isUserInOffice } from "./locationCheck";
import { isConnectedToOfficeWiFi } from "./wifi-check";

export const validateUserPresence = async (
  officeLat: number,
  officeLng: number,
  officeSSID: string
): Promise<UserPresence> => {
  const isInLocation = await isUserInOffice(officeLat, officeLng);
  const isOnWiFi = await isConnectedToOfficeWiFi(officeSSID);
  return  {isOnWiFi,isInLocation} ;
};

// Temporarily because we need ACCESS_FINE_LOCATION to fetch user SSID
// export const validateUserPresence = async (
//   officeLat: number,
//   officeLng: number,
//   officeSSID: string
// ): Promise<boolean> => {
//   const isOnWiFi = await isConnectedToOfficeWiFi(officeSSID);
//   return  isOnWiFi ;
// };