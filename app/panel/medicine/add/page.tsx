import roleCheck from "@/actions/roleCheck";
import { roles , unaccessPath } from "@/common";
import { AddMedicine } from "@/page";
import { redirect } from "next/navigation";

export default async function  Page() {
  const check = await roleCheck([roles["admin"], roles["doctor"] , roles['nurse']]);
  if (!check) redirect(unaccessPath);
  return <AddMedicine  />
}
