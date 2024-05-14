"use client";
import {
  FormControl,
  Checkbox,
  ListItemText,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
  FormHelperText,
  Button,
} from "@mui/material";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useApi from "@/hooks/useApi";
import invalidCache from "@/utils/invalidCache";
import { snack } from "@/atom";
import { useAtom } from "jotai";
import { ApiResult } from "@/interface";
import { useRouter } from "next/navigation";
export const AddAccount = ({ data }: { data: any }) => {
  const axios = useApi();
  const [_, setSnack] = useAtom(snack);
  const router = useRouter();
  const formSchema = z.object({
    name: z
      .string({
        message: "نام را وارد کنید",
      })
      .min(1, {
        message: "نام را وارد کنید",
      }),
    family: z
      .string({
        message: "نام خانوادگی را وارد کنید",
      })
      .min(1, {
        message: "نام خانوادگی را وارد کنید",
      }),
    personalCode: z.coerce
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
      .min(8, {
        message: "رمز عبور حداقل باید 8 حرفی باشد",
      }),
    phoneNumber: z
      .string({
        message: "شماره ی همراه را وارد کنید",
      })
      .min(1, {
        message: "شماره ی همراه را وارد کنید",
      }),
    roleName: z
      .string({
        message: "نقش  را انتخاب کنید",
      })
      .min(1, "نقش  را انتخاب کنید"),
    userSelectedPermissions: z
      .string({
        message: "صطح دسترسی را انتخاب کنید",
      })
      .array()
      .min(1, "صطح دسترسی را انتخاب کنید"),
  });
  type FormSchemaType = z.infer<typeof formSchema>;
  const { handleSubmit, control, formState } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userSelectedPermissions: [],
    },
  });
  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    try {
      const req = await axios.post<ApiResult>("/User", {
        ...data,
        personalCode: z.coerce.string().parse(data.personalCode),
      });
      invalidCache("usersList");
      setSnack({
        show: true,
        text: req.data.message,
        type: "success",
      });
      router.push("/panel/accounts");
    } catch (error) {
      console.log(error);
    }
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
      <Controller
        name='family'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            label='نام خانوادگی'
            error={!!formState.errors.family}
            helperText={formState.errors.family?.message}
            {...field}
            sx={{
              mb: "2rem",
            }}
          />
        )}
      />
      <Controller
        name='personalCode'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            type='number'
            label='شماره ی پرسنلی'
            error={!!formState.errors.personalCode}
            helperText={formState.errors.personalCode?.message}
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
      <Controller
        name='phoneNumber'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            label='شماره ی همراه'
            error={!!formState.errors.phoneNumber}
            helperText={formState.errors.phoneNumber?.message}
            {...field}
            sx={{
              mb: "2rem",
            }}
          />
        )}
      />
      <Controller
        name='roleName'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            label='نقش'
            error={!!formState.errors.roleName}
            helperText={formState.errors.roleName?.message}
            {...field}
            select
            sx={{
              mb: "2rem",
            }}
          >
            {data.role.map((option: any, idx: number) => (
              <MenuItem key={idx} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <Controller
        name='userSelectedPermissions'
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel
              id='permissionLabel'
              error={!!formState.errors.userSelectedPermissions}
            >
              دسترسی ها
            </InputLabel>
            <Select
              labelId='permissionLabel'
              multiple
              {...field}
              variant='filled'
              renderValue={(selected: string[]) => selected.join(", ")}
              fullWidth
              error={!!formState.errors.userSelectedPermissions}
            >
              {data.permisions.map((e: any, idx: number) => (
                <MenuItem key={idx} value={e.name}>
                  <Checkbox checked={field.value.indexOf(e.name) > -1} />
                  <ListItemText primary={e.name} />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText error={!!formState.errors.userSelectedPermissions}>
              {formState.errors.userSelectedPermissions?.message}
            </FormHelperText>
          </FormControl>
        )}
      />
      <Button
        sx={{
          mt: "2rem",
        }}
        type='submit'
      >
        ارسال
      </Button>
    </Paper>
  );
};
