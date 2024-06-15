"use server";

import { cookies } from "next/headers";

const getCookie = (name: string) => {
  return cookies().get(name);
};
export default getCookie;
