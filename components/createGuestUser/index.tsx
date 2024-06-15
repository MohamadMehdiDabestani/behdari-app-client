"use client";
import { snack } from "@/atom";
import useApi from "@/hooks/useApi";
import { useAtom } from "jotai";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { ZodError, z } from "zod";
import { ApiResult } from "@/interface";
import { Button, TextField } from "@mui/material";
import { Fragment } from "react";
export const CreateGuestUser = () => {
  const rootForm = useFormContext<any>();
  const [_, setSnack] = useAtom(snack);
  const axios = useApi();
  const guestUser = z
    .object({
      name: z
        .string({
          message: "نام را وارد کنید",
        })
        .min(1, "نام را وارد کنید"),
      family: z
        .string({
          message: "نام خانوادگی را وارد کنید",
        })
        .min(1, "نام خانوادگی را وارد کنید"),
      nationalCode: z
        .string({
          message: "کد ملی را وارد کنید",
        })
        .min(1, "کد ملی را وارد کنید"),
      tel: z
        .string({
          message: "شماره ی تماس را وارد کنید",
        })
        .min(1, "شماره ی تماس را وارد کنید"),
    })
    .partial();
  const fixErrorSchema = z.object({
    d: z.string(),
    guestUser,
  });
  type GuestUserSchemaType = z.infer<typeof fixErrorSchema>;
  const { getValues, control, formState, setError } =
    useForm<GuestUserSchemaType>({
      resolver: zodResolver(guestUser),
    });

  const createGuestUser = async () => {
    try {
      const user = getValues("guestUser");

      guestUser.required().parse(user);
      const req = await axios.post<ApiResult>("/GuestUser", user);
      setSnack({
        show: true,
        text: req.data.message,
        type: "success",
      });
      if (req.data.isSuccess)
        rootForm.setValue("guestUserId", req.data.data.id);
    } catch (error: ZodError | any) {
      if (error?.issues)
        error?.issues.map((e: any) => {
          setError(
            `guestUser.${e.path[0]}` as keyof typeof formState.defaultValues,
            {
              message: e.message,
            }
          );
        });
    }
  };
  const deleteGuestUser = async () => {
    try {
      const req = await axios.delete(
        `/GuestUser/${rootForm.getValues("guestUserId")}`
      );
      if (req.data.isSuccess) {
        setSnack({
          show: true,
          text: req.data.message,
          type: "success",
        });
        rootForm.setValue("guestUserId", undefined);
      }
    } catch (error) {
      setSnack({
        show: false,
        text: "مشکلی وجود دارد",
        type: "error",
      });
    }
  };
  return (
    <Fragment>
      <Controller
        name='guestUser.name'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            label='نام'
            error={!!formState.errors.guestUser?.name}
            helperText={formState.errors.guestUser?.name?.message}
            {...field}
            sx={{
              mb: "2rem",
            }}
          />
        )}
      />
      <Controller
        name='guestUser.family'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            label='نام خانوادگی'
            error={!!formState.errors.guestUser?.family}
            helperText={formState.errors.guestUser?.family?.message}
            {...field}
            sx={{
              mb: "2rem",
            }}
          />
        )}
      />
      
      <Controller
        name='guestUser.nationalCode'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            label='کد ملی'
            error={!!formState.errors.guestUser?.nationalCode}
            helperText={formState.errors.guestUser?.nationalCode?.message}
            {...field}
            sx={{
              mb: "2rem",
            }}
          />
        )}
      />
            <Controller
        name='guestUser.tel'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            label='شماره ی تماس'
            error={!!formState.errors.guestUser?.tel}
            helperText={formState.errors.guestUser?.tel?.message}
            {...field}
            sx={{
              mb: "2rem",
            }}
          />
        )}
      />
      <Button onClick={createGuestUser}>ساخت کاربر مهمان</Button>
      {rootForm.getValues("guestUserId") && (
        <Button sx={{ ml: "1rem" }} color='error' onClick={deleteGuestUser}>
          حذف کاربر
        </Button>
      )}
    </Fragment>
  );
};
