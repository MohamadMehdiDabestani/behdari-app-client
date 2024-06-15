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
export const EditAccount = ({ data }: { data: any }) => {
  console.log(data);
  const axios = useApi();
  const [_, setSnack] = useAtom(snack);
  const router = useRouter();
  const formSchema = z.object({
    userId: z.coerce.number().positive().int(),
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
    fatherName: z
      .string({
        message: "نام پدر را وارد کنید",
      })
      .min(1, {
        message: "نام پدر را وارد کنید",
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
      .min(11, {
        message: "شماره ی همراه را معتبر کنید",
      }),
    address: z
      .string({
        message: "آدرس را وارد کنید",
      })
      .min(1, {
        message: "آدرس را وارد کنید",
      }),
    telephone: z
      .string({
        message: "تلفن خانه را وارد کنید",
      })
      .min(1, {
        message: "تلفن خانه را وارد کنید",
      }),
    insuranceNumber: z
      .string({
        message: "شماره ی بیمه را وارد کنید",
      })
      .min(1, {
        message: "شماره ی بیمه را وارد کنید",
      }),
    jobTitle: z // عنوان شغل
      .string({
        message: "عنوان شغل را وارد کنید",
      })
      .min(1, {
        message: "عنوان شغل را وارد کنید",
      }),
    positionTitle: z // عنوان پست
      .string({
        message: "عنوان پست را وارد کنید",
      })
      .min(1, {
        message: "عنوان پست را وارد کنید",
      }),
    organizationalUnit: z
      .string({
        message: "واحد سازمانی را وارد کنید",
      })
      .min(1, {
        message: "واحد سازمانی را وارد کنید",
      }),
    major: z
      .string({
        message: "رشته تحصیلی را وارد کنید",
      })
      .min(1, {
        message: "رشته تحصیلی را وارد کنید",
      }),
    grade: z
      .string({
        message: "مقطع تحصیلی را وارد کنید",
      })
      .min(1, {
        message: "مقطع تحصیلی را وارد کنید",
      }),
    placeOfIssue: z
      .string({
        message: "محل صدور شناسنامه را وارد کنید",
      })
      .min(1, {
        message: "محل صدور شناسنامه را وارد کنید",
      }),
    identityId: z
      .string({
        message: "شماره ی شناسنامه را وارد کنید",
      })
      .min(1, {
        message: "شماره ی شناسنامه را وارد کنید",
      }),
    nationalCode: z
      .string({
        message: "کد ملی را وارد کنید",
      })
      .min(1, {
        message: "کد ملی را وارد کنید",
      }),
    birthDate: z
      .string({
        message: "تاریخ تولد را وارد کنید",
      })
      .min(1, {
        message: "تاریخ تولد را وارد کنید",
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
      .optional()
  });
  type FormSchemaType = z.infer<typeof formSchema>;
  const { handleSubmit, control, formState } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userSelectedPermissions: [],
      family: data.user.family,
      name: data.user.name,
      userId: data.user.userId,
      personalCode: data.user.personalCode,
      roleName: data.user.userRoles[0].roleName,
      ...data.user,
    },
  });
  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    try {
      const req = await axios.put<ApiResult>("/User", {
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
        name='fatherName'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            label='نام پدر'
            error={!!formState.errors.fatherName}
            helperText={formState.errors.fatherName?.message}
            {...field}
            sx={{
              mb: "2rem",
            }}
          />
        )}
      />
      <Controller
        name='birthDate'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            label='تاریخ تولد'
            error={!!formState.errors.birthDate}
            helperText={formState.errors.birthDate?.message}
            {...field}
            sx={{
              mb: "2rem",
            }}
          />
        )}
      />
      <Controller
        name='identityId'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            label='شماره ی شناسنامه'
            error={!!formState.errors.identityId}
            helperText={formState.errors.identityId?.message}
            {...field}
            sx={{
              mb: "2rem",
            }}
          />
        )}
      />
      <Controller
        name='placeOfIssue'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            label='محل صدور'
            error={!!formState.errors.placeOfIssue}
            helperText={formState.errors.placeOfIssue?.message}
            {...field}
            sx={{
              mb: "2rem",
            }}
          />
        )}
      />
      <Controller
        name='nationalCode'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            label='کد ملی'
            error={!!formState.errors.nationalCode}
            helperText={formState.errors.nationalCode?.message}
            {...field}
            sx={{
              mb: "2rem",
            }}
          />
        )}
      />
      <Controller
        name='grade'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            label='مقطع تحصیلی'
            error={!!formState.errors.grade}
            helperText={formState.errors.grade?.message}
            {...field}
            sx={{
              mb: "2rem",
            }}
          />
        )}
      />
      <Controller
        name='major'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            label='رشته ی تحصیلی'
            error={!!formState.errors.major}
            helperText={formState.errors.major?.message}
            {...field}
            sx={{
              mb: "2rem",
            }}
          />
        )}
      />
      <Controller
        name='organizationalUnit'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            label='واحد سازمانی'
            error={!!formState.errors.organizationalUnit}
            helperText={formState.errors.organizationalUnit?.message}
            {...field}
            sx={{
              mb: "2rem",
            }}
          />
        )}
      />
      <Controller
        name='jobTitle'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            label='عنوان  شغلی'
            error={!!formState.errors.jobTitle}
            helperText={formState.errors.jobTitle?.message}
            {...field}
            sx={{
              mb: "2rem",
            }}
          />
        )}
      />
      <Controller
        name='positionTitle'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            label='عنوان  پست'
            error={!!formState.errors.positionTitle}
            helperText={formState.errors.positionTitle?.message}
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
        name='insuranceNumber'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            label='شماره ی بیمه'
            error={!!formState.errors.insuranceNumber}
            helperText={formState.errors.insuranceNumber?.message}
            {...field}
            sx={{
              mb: "2rem",
            }}
          />
        )}
      />
      <Controller
        name='telephone'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            label='شماره ی خانه'
            error={!!formState.errors.telephone}
            helperText={formState.errors.telephone?.message}
            {...field}
            sx={{
              mb: "2rem",
            }}
          />
        )}
      />
      <Controller
        name='address'
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            label='آدرس'
            error={!!formState.errors.address}
            helperText={formState.errors.address?.message}
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
                  <Checkbox checked={field.value ? field.value.indexOf(e.name) > -1 : false} />
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
