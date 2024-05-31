"use client";
import { MenuItem, TextField, Paper, Button } from "@mui/material";
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
import { medicineType } from "@/common";
export const EditMedicine = ({ data }: ApiResult) => {
  console.log(data);
  const axios = useApi();
  const [_, setSnack] = useAtom(snack);
  const router = useRouter();
  const formSchema = z.object({
    medicineId: z.number().positive().int(),
    name: z
      .string({
        message: "نام دارو را وارد کنید",
      })
      .min(1, {
        message: "نام دارو را وارد کنید",
      }),
    selectedType: z.string({
      message: "نوع دارو را وارد کنید",
    }),
    countLimit: z.coerce
      .number({
        message: "محدودیت تعداد دارو را وارد کنید",
      })
      .positive({
        message: "محدودیت تعداد دارو را وارد کنید",
      })
      .int(),
    timeLimit: z.coerce
      .number({
        message: "محدودیت زمانی دارو را وارد کنید",
      })
      .positive({
        message: "محدودیت زمانی دارو را وارد کنید",
      })
      .int(),
  });
  type FormSchemaType = z.infer<typeof formSchema>;

  const { handleSubmit, control, formState } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      countLimit: data.countLimit,
      name: data.name,
      selectedType: data.type,
      timeLimit: data.timeLimit,
      medicineId: data.id,
    },
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (formData) => {
    const req = await axios.put<ApiResult>("/Medicine", {
      ...formData,
      type: z.coerce.number().parse(formData.selectedType),
    });

    invalidCache("medicinesList");
    setSnack({
      show: true,
      text: req.data.message,
      type: "success",
    });
    router.push("/panel/medicine");
  };

  return (
    <Paper
      sx={{
        p: "1rem",
      }}
      component='form'
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid container columnSpacing={5}>
        <Grid xs={6} md={3}>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label='نام'
                error={!!formState.errors.name}
                helperText={formState.errors.name?.message}
                {...field}
                sx={{
                  mb: "2rem",
                }}
              />
            )}
          />
        </Grid>
        <Grid xs={6} md={3}>
          <Controller
            name='countLimit'
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label='محدودیت تعداد'
                error={!!formState.errors.countLimit}
                helperText={formState.errors.countLimit?.message}
                {...field}
                sx={{
                  mb: "2rem",
                }}
              />
            )}
          />
        </Grid>
        <Grid xs={6} md={3}>
          <Controller
            name='timeLimit'
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label='محدودیت زمانی'
                error={!!formState.errors.timeLimit}
                helperText={formState.errors.timeLimit?.message}
                {...field}
                sx={{
                  mb: "2rem",
                }}
              />
            )}
          />
        </Grid>
        <Grid xs={6} md={3}>
          <Controller
            name={`selectedType`}
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label='نوع'
                error={!!formState.errors.selectedType}
                helperText={formState.errors.selectedType?.message}
                {...field}
                select
                sx={{
                  mb: "2rem",
                }}
              >
                {Object.keys(medicineType).map((option: any, idx: number) => (
                  <MenuItem key={idx} value={option}>
                    {medicineType[option as keyof typeof medicineType]}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
      </Grid>
      <Button
        sx={{
          ml: "2rem",
        }}
        type='submit'
      >
        ارسال
      </Button>
    </Paper>
  );
};
