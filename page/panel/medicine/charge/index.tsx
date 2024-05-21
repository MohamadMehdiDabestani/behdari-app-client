"use client";
import { TextField, Paper, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useApi from "@/hooks/useApi";
import invalidCache from "@/utils/invalidCache";
import { snack } from "@/atom";
import { useAtom } from "jotai";
import { ApiResult } from "@/interface";
import { useRouter } from "next/navigation";
export const ChargeMedicine = ({ data }: ApiResult) => {
  console.log();
  const axios = useApi();
  const [_, setSnack] = useAtom(snack);
  const { push } = useRouter();
  const formSchema = z.object({
    count: z.coerce
      .number({
        message: "تعداد دارو را وارد کنید",
      })
      .positive({
        message: "تعداد دارو را وارد کنید",
      })
      .int(),
    manufactureDate: z.string({
      message: "تاریخ ساخت را وارد کنید",
    }),
    expireDate: z.string({
      message: "تاریخ انقضا را وارد کنید",
    }),
  });
  type FormSchemaType = z.infer<typeof formSchema>;

  const { handleSubmit, control, formState } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expireDate: "0/0/0",
      manufactureDate: "0/0/0",
    },
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (formData) => {
    try {
      const req = await axios.post<ApiResult>("/MedicineCharge", {
        ...formData,
        medicineId: data.id,
      });
      invalidCache("medicinesList");
      setSnack({
        show: true,
        text: req.data.message,
        type: "success",
      });
      push("/panel/medicine");
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
      <Typography variant='h6' sx={{ mb: "2rem" }}>
        شارژ {data.name}
      </Typography>
      <Grid container columnSpacing={5}>
        <Grid xs={12} md={4}>
          <Controller
            name='count'
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                type='number'
                label='تعداد'
                error={!!formState.errors.count}
                helperText={formState.errors.count?.message}
                {...field}
                sx={{
                  mb: "2rem",
                }}
              />
            )}
          />
        </Grid>
        <Grid xs={6} md={4}>
          <Controller
            name='expireDate'
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label='تاریخ انقضا'
                error={!!formState.errors.expireDate}
                helperText={formState.errors.expireDate?.message}
                {...field}
                sx={{
                  mb: "2rem",
                }}
              />
            )}
          />
        </Grid>
        <Grid xs={6} md={4}>
          <Controller
            name='manufactureDate'
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label='تاریخ تولید'
                error={!!formState.errors.manufactureDate}
                helperText={formState.errors.manufactureDate?.message}
                {...field}
                sx={{
                  mb: "2rem",
                }}
              />
            )}
          />
        </Grid>
      </Grid>

      <Button type='submit'>ارسال</Button>
    </Paper>
  );
};
