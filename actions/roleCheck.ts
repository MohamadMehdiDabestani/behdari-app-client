"use server";

import { ApiResult } from "@/interface";
import getCookie from "./getCookie";

const roleCheck = async (roles: string[]): Promise<boolean> => {
  const token = getCookie("token");
  if (!token) return false;
  const accessToken = JSON.parse(token.value);
  const req = await fetch(
    `${process.env.API_END_POINT}/Authorize/CheckUserIsInRole`,
    {
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(roles),
    }
  );
  const json = (await req.json()) as ApiResult;
  console.log(json.isSuccess)
  return json.isSuccess;
};
export default roleCheck;
