"use client";
import { ApiResult } from "@/interface";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Item } from "./item";
import { Fragment } from "react";
import Link from "next/link";
import { Button } from "@mui/material";

import dynamic from "next/dynamic";
import { useAtom } from "jotai";
import { dialogForm } from "@/atom";

import { usePathname, useRouter } from "next/navigation";
const DialogFormWrapper = dynamic(() => import("./dialogFormWrapper"));

export const ListPatient = ({ data }: ApiResult) => {
  const [_o, setOpen] = useAtom(dialogForm);
  const { replace } = useRouter();
  const pathname = usePathname();
  const onOpen = () => {
    const params = new URLSearchParams();
    params.delete("id");
    params.set("extra", "true");
    replace(`${pathname}?${params.toString()}`);
    setOpen(true);
  };
  return (
    <Fragment>
      <Link href='/panel/patient/add'>
        <Button sx={{ mb: "1rem" }}>ثبت hsee</Button>
      </Link>
      <Button sx={{ mb: "1rem", ml: "1rem" }} onClick={onOpen}>
        ثبت بهداری
      </Button>
      <DialogFormWrapper />
      <Grid
        sx={{
          overflowX: "hidden",
        }}
        container
        spacing={5}
      >
        {data.patientQueues.map((e: any, idx: number) => (
          <Grid key={idx} xs={6} md={4}>
            <Item {...e} />
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
};
