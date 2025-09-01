import { UserPresence } from "../../types/models";
import { isUserInOffice } from "./locationCheck";
import { isConnectedToOfficeWiFi } from "./wifi-check";

export const validateUserPresence = async (
  officeLat: number,
  officeLng: number,
  officeSSID: string
): Promise<UserPresence> => {
  const isInLocation = await isUserInOffice(officeLat, officeLng);
  const isOnWiFi = await isConnectedToOfficeWiFi(officeSSID);
  return { isInLocation, isOnWiFi };
};