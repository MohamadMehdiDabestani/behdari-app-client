"use client";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { reportType } from "@/common";
import { usePathname, useRouter } from "next/navigation";
import { loading } from "@/atom";
import { useAtom } from "jotai";
export const Filter = () => {
  const { refresh, replace } = useRouter();
  const pathname = usePathname();
  const [__,setLoading] = useAtom(loading);
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
  });
  type FormSchemaType = z.infer<typeof formSchema>;
  const { handleSubmit, control, formState } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedType: 0,
    },
  });
  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    setLoading(true)
    const params = new URLSearchParams();
    params.set("type", data.selectedType.toString());
    params.set("startDate", data.startDate);
    params.set("endDate", data.endDate);
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <Grid2
      component='form'
      spacing={5}
      onSubmit={handleSubmit(onSubmit)}
      container
    >
      <Grid2 xs={12} md={4}>
        <Controller
          name='selectedType'
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              label='نوع'
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
          name='startDate'
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              label='تاریخ شروع'
              error={!!formState.errors.startDate}
              helperText={formState.errors.startDate?.message}
              {...field}
            />
          )}
        />
      </Grid2>
      <Grid2 xs={12} md={4}>
        <Controller
          name='endDate'
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              label='تاریخ پایان'
              error={!!formState.errors.endDate}
              helperText={formState.errors.endDate?.message}
              {...field}
            />
          )}
        />
      </Grid2>
      <Grid2 xs={12}>
        <Button type='submit'>واکشی داده</Button>
      </Grid2>
    </Grid2>
  );
};
