"use server";
import { revalidateTag } from "next/cache";

const invalidCache = (key: string) => {
  revalidateTag(key);
};
export default invalidCache