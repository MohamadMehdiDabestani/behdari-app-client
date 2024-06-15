import { DialogProps } from "@/interface";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import useApi from "@/hooks/useApi";
import { useAtom } from "jotai";
import { snack } from "@/atom";

const DeleteDialog = ({open , setOpen}: DialogProps) => {
  const axios = useApi();
  const {refresh} = useRouter()
  const searchParams = useSearchParams();
  const [_, setSnack] = useAtom(snack);
  const formSchema = z.object({
    patientQueueId:  z.coerce.number().positive().int(),
    deleteDescription: z
      .string({
        message: "علت را وارد کنید",
      })
      .min(1, "علت را وارد کنید"),
  });
  type FormSchemaType = z.infer<typeof formSchema>;
  const { handleSubmit, control, formState, setValue } =
    useForm<FormSchemaType>({
      resolver: zodResolver(formSchema),
    });
  useEffect(() => {
    if (!searchParams.get("id")) return;
    setValue("patientQueueId", Number(searchParams.get("id")));
  }, [searchParams]);
  const onClose = () => setOpen(false)
  const onSubmit : SubmitHandler<FormSchemaType> = async (data) => {
    try {
      const req = await axios.delete("/PatientQueue", {
        data,
      });
      refresh()
      setSnack({
        show: true,
        text: req.data.message,
        type: "success",
      });
      onClose()
    } catch (error) {}
  };
  
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth='sm'
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit(onSubmit),
      }}
    >
      <DialogTitle>حذف</DialogTitle>
      <DialogContent>
        <Box>
          <Controller
            name='deleteDescription'
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label='علت'
                error={!!formState.errors.deleteDescription}
                helperText={formState.errors.deleteDescription?.message}
                {...field}
                sx={{
                  mb: "2rem",
                }}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button type='submit' color='error'>
          حذف
        </Button>
        <Button onClick={onClose}>لغو</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
