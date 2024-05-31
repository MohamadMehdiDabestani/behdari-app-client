"use client";
import { MenuItem, TextField, Paper, Button } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

import { z } from "zod";
import {
  Controller,
  SubmitHandler,
  useForm,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useApi from "@/hooks/useApi";
import invalidCache from "@/utils/invalidCache";
import { snack } from "@/atom";
import { useAtom } from "jotai";
import { ApiResult } from "@/interface";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { medicineType } from "@/common";
export const AddMedicine = () => {
  const axios = useApi();
  const [_, setSnack] = useAtom(snack);
  const router = useRouter();
  const formSchema = z.object({
    list: z.array(
      z.object({
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

        medicineCharge: z.object({
          count: z.coerce
            .number({
              message: "تعداد دارو را وارد کنید",
            })
            .positive({
              message: "تعداد دارو را وارد کنید",
            })
            .int(),
          entryDate: z.string({
            message: "تاریخ ورود را وارد کنید",
          }),
          expireDate: z.string({
            message: "تاریخ انقضا را وارد کنید",
          }),
        }),
      })
    ),
  });
  type FormSchemaType = z.infer<typeof formSchema>;

  const { handleSubmit, control, formState } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      list: [
        {
          name: "",
          countLimit: 0,
          timeLimit: 0,
          selectedType: "0",
          medicineCharge: {
            count: 0,
            expireDate: "0/0/0",
            entryDate: "0/0/0",
          },
        },
      ],
    },
  });
  const dynamicOptionFormPart = useFieldArray({
    name: "list",
    control: control,
  });
  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    const newArray = data.list.map((item) => {
      return {
        type: z.coerce.number().parse(item.selectedType),
        ...item
      };
    });
    const req = await axios.post<ApiResult>("/MedicineRange", newArray);
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
      {dynamicOptionFormPart.fields.map((e, idx) => (
        <Grid container key={idx} columnSpacing={5}>
          <Grid xs={6} md={3}>
            <Controller
              name={`list.${idx}.name`}
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label='نام دارو'
                  error={
                    formState.errors.list
                      ? !!formState.errors.list[idx]?.name
                      : false
                  }
                  helperText={
                    formState.errors.list
                      ? formState.errors.list[idx]?.name?.message
                      : undefined
                  }
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
              name={`list.${idx}.timeLimit`}
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  type='number'
                  label='محدودیت زمانی'
                  error={
                    formState.errors.list
                      ? !!formState.errors.list[idx]?.timeLimit
                      : false
                  }
                  helperText={
                    formState.errors.list
                      ? formState.errors.list[idx]?.timeLimit?.message
                      : undefined
                  }
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
              name={`list.${idx}.countLimit`}
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  type='number'
                  label='محدودیت تعداد'
                  error={
                    formState.errors.list
                      ? !!formState.errors.list[idx]?.countLimit
                      : false
                  }
                  helperText={
                    formState.errors.list
                      ? formState.errors.list[idx]?.countLimit?.message
                      : undefined
                  }
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
              name={`list.${idx}.selectedType`}
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label='نوع'
                  error={
                    formState.errors.list
                      ? !!formState.errors.list[idx]?.selectedType
                      : false
                  }
                  helperText={
                    formState.errors.list
                      ? formState.errors.list[idx]?.selectedType?.message
                      : undefined
                  }
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
          <Grid xs={6} md={3}>
            <Controller
              name={`list.${idx}.medicineCharge.count`}
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  type='number'
                  label='تعداد'
                  error={
                    formState.errors.list
                      ? !!formState.errors.list[idx]?.medicineCharge?.count
                      : false
                  }
                  helperText={
                    formState.errors.list
                      ? formState.errors.list[idx]?.medicineCharge?.count
                          ?.message
                      : undefined
                  }
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
              name={`list.${idx}.medicineCharge.expireDate`}
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label='تاریخ انقضا'
                  error={
                    formState.errors.list
                      ? !!formState.errors.list[idx]?.medicineCharge?.expireDate
                      : false
                  }
                  helperText={
                    formState.errors.list
                      ? formState.errors.list[idx]?.medicineCharge?.expireDate
                          ?.message
                      : undefined
                  }
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
              name={`list.${idx}.medicineCharge.entryDate`}
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label='تاریخ ورود'
                  error={
                    formState.errors.list
                      ? !!formState.errors.list[idx]?.medicineCharge
                          ?.entryDate
                      : false
                  }
                  helperText={
                    formState.errors.list
                      ? formState.errors.list[idx]?.medicineCharge
                          ?.entryDate?.message
                      : undefined
                  }
                  {...field}
                  sx={{
                    mb: "2rem",
                  }}
                />
              )}
            />
          </Grid>
          <Grid
            xs={6}
            md={1}
            sx={{
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            {idx != 0 && (
              <Button
                color='error'
                onClick={() => {
                  dynamicOptionFormPart.remove(idx);
                }}
              >
                حذف
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
      <Button
        onClick={() => {
          dynamicOptionFormPart.append({
            name: "",
            countLimit: 0,
            timeLimit: 0,
            selectedType: "0",
            medicineCharge: {
              count: 0,
              expireDate: "0/0/0",
              entryDate: "0/0/0",
            },
          });
        }}
        color='secondary'
      >
        جدید
      </Button>
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
