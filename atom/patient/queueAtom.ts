import { atom } from "jotai";
interface SelectedUser {
  type: "locale" | "guest";
  id: number;
  fullName: string;
  isEmergency : boolean
  personalCode?: string
}
export const selectedUser = atom<SelectedUser>({
  type: "locale",
  id: 0,
  isEmergency : false,
  fullName: "",
  personalCode : ""
});
