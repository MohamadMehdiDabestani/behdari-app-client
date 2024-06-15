import roleCheck from "@/actions/roleCheck";
import { roles } from "@/common";
import { AddMedicine } from "@/page";
import { redirect } from "next/navigation";

export default async function  Page() {
  const check = await roleCheck([roles["admin"], roles["doctor"] , roles['nurse']]);
  if (!check) redirect("/");
  return <AddMedicine  />
}
