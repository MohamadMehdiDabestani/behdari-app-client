"use client";
import TextField from "@mui/material/TextField";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Typography, Button, Paper } from "@mui/material";
import useApi from "@/hooks/useApi";
import TransferList from "./transferList";
import { useState } from "react";
import { ApiResult } from "@/interface";
import { snack } from "@/atom";
import { useAtom } from "jotai";
import invalidCache from "@/utils/invalidCache";
import { useRouter } from "next/navigation";

export const AddPack = ({ data }: ApiResult) => {
  const [selected, setSelected] = useState<number[]>([]);
  const axios = useApi();
  const {push} = useRouter();
  const [_, setSnack] = useAtom(snack);
  const SignUpSchema = z.object({
    packName: z
      .string({
        message: "نام پک را وارد کنید",
      })
      .min(1, {
        message: "نام پک را وارد کنید",
      }),
  });
  type SignUpSchemaType = z.infer<typeof SignUpSchema>;

  const { handleSubmit, control, formState } = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
  });
  const onSubmit: SubmitHandler<SignUpSchemaType> = async (data) => {
    try {
      if (selected.length == 0) {
        alert("دارویی برای پک انتخاب کنید");
        return;
      }
      const req = await axios.post<ApiResult>("/Pack", [
        {
          ...data,
          selectedMedicines: selected,
        },
      ]);
      invalidCache("packsList");
      setSnack({
        show: true,
        text: req.data.message,
        type: "success",
      });
      push("/panel/pack")
    } catch (error) {}
  };

  return (
    <Paper
      sx={{
        p: "1rem",
      }}
      component='form'
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name='packName'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            label='نام پک'
            error={!!formState.errors.packName}
            helperText={formState.errors.packName?.message}
            {...field}
            sx={{
              mb: "2rem",
            }}
          />
        )}
      />
      <TransferList
        setSelected={setSelected}
        labels={data.medicines.map((e: any) => {
          return {
            label: e.name,
            id: e.id,
          };
        })}
        list={data.medicines.map((e: any) => e.id) as number[]}
      />
      <Button type='submit'>ثبت</Button>
    </Paper>
  );
};
