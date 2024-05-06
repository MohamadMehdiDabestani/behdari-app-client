"use client";
import { Fragment } from "react";
import TextField from "@mui/material/TextField";
import { z } from "zod";
import {
  Controller,
  SubmitHandler,
  useForm,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Paper } from "@mui/material";
const Form = () => {
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
      })
    ),
  });

  type formSchemaType = z.infer<typeof formSchema>;

  const { handleSubmit, control, formState , reset } = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      list: [
        {
          name: "",
        },
      ],
    },
  });
  const dynamicOptionFormPart = useFieldArray({
    name: "list",
    control: control,
  });
  const onSubmit: SubmitHandler<formSchemaType> = (data) => {
    console.log(data);
    reset({
        list: [
          {
            name: "",
          },
        ],
      })
  };
  return (
    <Paper
      sx={{
        mx: "auto",
        p: "25px",
      }}
      component='form'
      onSubmit={handleSubmit(onSubmit)}
    >
      {dynamicOptionFormPart.fields.map((e, idx) => (
        <Fragment key={idx}>
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
        </Fragment>
      ))}

      <Button
        onClick={() => {
          dynamicOptionFormPart.append({
            name: "",
          });
        }}
      >
        جدید
      </Button>

      <Button type='submit'>ارسال</Button>
    </Paper>
  );
};
export default Form