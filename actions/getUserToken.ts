"use server";

import { cookies } from "next/headers";
import getCookie from "./getCookie";

const getUserToken  = async () : Promise<string> => {
  const cookie =  await getCookie("token")
  if(!cookie) return ""
  const value = JSON.parse(cookie.value)
  return value.token
};
export default getUserToken;
