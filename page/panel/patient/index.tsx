"use client";
import { ApiResult } from "@/interface";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Item } from "./item";
import { Fragment, useState } from "react";
import Link from "next/link";
import { Button } from "@mui/material";

import dynamic from "next/dynamic";

import { usePathname, useRouter } from "next/navigation";
import useApi from "@/hooks/useApi";
const DialogFormWrapper = dynamic(() => import("./dialogFormWrapper"));
const DeleteDialog = dynamic(() => import("./deleteDialog"));

export const ListPatient = ({ data }: ApiResult) => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
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
      {data.isHse && (
        <Link href='/panel/patient/add'>
          <Button sx={{ mb: "1rem" }}>ثبت hsee</Button>
        </Link>
      )}
      {data.isDoctor && (
        <Button sx={{ mb: "1rem" }} onClick={onOpen}>
          ثبت بهداری
        </Button>
      )}
      {/* <Link href='/panel/patient/add'>
        <Button sx={{ mb: "1rem" }}>ثبت hsee</Button>
      </Link>
      <Button sx={{ mb: "1rem" }} onClick={onOpen}>
        ثبت بهداری
      </Button> */}
      {data.isDoctor && (<DialogFormWrapper open={open} setOpen={setOpen} />)}
      <DeleteDialog open={openDelete} setOpen={setOpenDelete} />
      <Grid
        sx={{
          overflowX: "hidden",
        }}
        container
        spacing={5}
      >
        {data.patientQueues.map((e: any, idx: number) => (
          <Grid key={idx} xs={6} md={4}>
            <Item setOpen={setOpen} setOpenDelete={setOpenDelete} isDoctor={data.isDoctor} {...e} />
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
};
