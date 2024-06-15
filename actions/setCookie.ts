"use server";

import { cookies } from "next/headers";

const setCookie = (name: string, value: string) => {
  cookies().set({
    name,
    value: value,
    httpOnly: true,
    secure: true,
  });
};
export default setCookie;
