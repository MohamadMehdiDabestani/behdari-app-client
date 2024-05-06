"use client";
import TextField from "@mui/material/TextField";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Typography, Button, Paper } from "@mui/material";
import useApi from "@/hooks/useApi";

export const Form = () => {
  const axios = useApi();
  const SignUpSchema = z.object({
    code: z.coerce
      .number({
        message: "کد پرسنلی را وارد کنید",
      })
      .positive({
        message: "کد پرسنلی معتبر وارد کنید",
      })
      .int(),
    password: z
      .string({
        message: "رمز عبور را وارد کنید",
      })
      .min(2, {
        message: "رمز عبور حداقل باید 8 حرفی باشد",
      }),
  });

  type SignUpSchemaType = z.infer<typeof SignUpSchema>;
  const { handleSubmit, control, formState } = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
  });
  const onSubmit: SubmitHandler<SignUpSchemaType> = async (data) => {
    try {
      const req = await axios.post("/account", {
        personalCode: z.coerce.string().parse(data.code),
        password: data.password,
      });
    } catch (error) {}
  };
  return (
    <Paper
      sx={{
        width: { xs: "90%", md: "40%" },
        mx: "auto",
        p: "25px",
      }}
      component='form'
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant='h5' fontWeight='bold' textAlign='center' mb='2rem'>
        ورود به سیستم بهداری معدن اردکان
      </Typography>
      <Controller
        name='code'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            type='number'
            label='شماره ی پرسنلی'
            error={!!formState.errors.code}
            helperText={formState.errors.code?.message}
            {...field}
            sx={{
              mb: "2rem",
            }}
          />
        )}
      />
      <Controller
        name='password'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            type='password'
            label='رمز عبور'
            error={!!formState.errors.password}
            helperText={formState.errors.password?.message}
            {...field}
            sx={{
              mb: "2rem",
            }}
          />
        )}
      />
      <Button type='submit'>ورود</Button>
    </Paper>
  );
};
