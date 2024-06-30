"use client";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, Box, Button, MenuItem, TextField } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { reportType } from "@/common";
import { usePathname, useRouter } from "next/navigation";
import { loading } from "@/atom";
import { useAtom } from "jotai";
import { useState, useEffect } from "react";
import useApi from "@/hooks/useApi";
import { Children } from "@/interface";

export const Filter = (props : Children) => {
  const [users, setUsers] = useState<{ label: string; id: string }[]>([]);
  const { refresh, replace } = useRouter();
  const pathname = usePathname();
  const [__, setLoading] = useAtom(loading);
  const axios = useApi();
  const formSchema = z.object({
    selectedType: z.coerce.number({
      message: "نوع را انتخاب گنید",
    }),
    startDate: z.string({
      message: "تاریخ شروع را وارد کنید",
    }),
    endDate: z.string({
      message: "تاریخ پایان را وارد کنید",
    }),
    medicineName: z.string().optional(),
    packName: z.string().optional(),
    nationalCode: z.string().optional(),
  });
  type FormSchemaType = z.infer<typeof formSchema>;
  const { handleSubmit, control, formState } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedType: 0,
    },
  });
  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("type", data.selectedType.toString());
    params.set("startDate", data.startDate);
    params.set("endDate", data.endDate);
    if (data.packName) params.set("packName", data.packName);
    if (data.medicineName) params.set("medicineName", data.medicineName);
    if (data.nationalCode) params.set("nationalCode", data.nationalCode);
    replace(`${pathname}?${params.toString()}`);
  };
  useEffect(() => {
    (async () => {
      const req = await axios.get("/User");
      setUsers(
        req.data.data.map((e: any) => ({
          label: `${e.personalCode} - ${e.name + " " + e.family} - ${
            e.nationalCode
          }`,
          id: e.nationalCode,
        }))
      );
    })();
  }, []);

  return (
    <Grid2
      component="form"
      spacing={5}
      onSubmit={handleSubmit(onSubmit)}
      container
    >
      <Grid2 xs={12} md={4}>
        <Controller
          name="selectedType"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              label="نوع"
              error={!!formState.errors.selectedType}
              helperText={formState.errors.selectedType?.message}
              {...field}
              select
            >
              {Object.keys(reportType).map((option, idx: number) => (
                <MenuItem key={idx} value={option}>
                  {reportType[option as keyof typeof reportType]}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Grid2>
      <Grid2 xs={12} md={4}>
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              label="تاریخ شروع"
              error={!!formState.errors.startDate}
              helperText={formState.errors.startDate?.message}
              {...field}
            />
          )}
        />
      </Grid2>
      <Grid2 xs={12} md={4}>
        <Controller
          name="endDate"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              label="تاریخ پایان"
              error={!!formState.errors.endDate}
              helperText={formState.errors.endDate?.message}
              {...field}
            />
          )}
        />
      </Grid2>
      <Grid2 xs={12} md={4}>
        <Controller
          name="medicineName"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              label="نام دارو"
              error={!!formState.errors.medicineName}
              helperText={formState.errors.medicineName?.message}
              {...field}
            />
          )}
        />
      </Grid2>
      <Grid2 xs={12} md={4}>
        <Controller
          name="packName"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              label="نام پک"
              error={!!formState.errors.packName}
              helperText={formState.errors.packName?.message}
              {...field}
            />
          )}
        />
      </Grid2>
      <Grid2 xs={12} md={4}>
        <Controller
          name="nationalCode"
          control={control}
          render={({ field }) => (
            <Autocomplete
              disablePortal
              options={users}
              fullWidth
              value={users.find((e) => e.id == field.value)}
              onChange={(e, newValue: any) => {
                if (newValue) field.onChange(newValue.id);
                else field.onChange(undefined);
              }}
              renderInput={(params) => (
                <TextField
                  error={!!formState.errors.nationalCode}
                  helperText={formState.errors.nationalCode?.message}
                  {...params}
                  label="کد ملی"
                />
              )}
            />
          )}
        />
      </Grid2>
      <Grid2 xs={12}>
        <Button type="submit">واکشی داده</Button>
        {props.children}
      </Grid2>
    </Grid2>
  );
};
