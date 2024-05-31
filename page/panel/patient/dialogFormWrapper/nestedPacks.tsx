import { Box, Button, MenuItem, TextField } from "@mui/material";
import { Fragment, useEffect } from "react";
import {
  Controller,
  SubmitHandler,
  useForm,
  useFieldArray,
  useWatch,
  useFormContext,
} from "react-hook-form";
import Grid from "@mui/material/Unstable_Grid2";
import { NestedPacksItems } from "./nestedPacksItems";

export const NestedPacks = ({
  control,
  index,
  field,
  listPacks,
  onDelete,
}: any) => {
  const { formState, setValue } = useFormContext<any>();
  const packId = useWatch({
    name: `packs.${index}.packId`,
    control,
  });
  //   useEffect(() => {
  //     if (value > 0) {
  //       setValue(`medicinesList.${index}.chargeId`, 0);
  //     }
  //   }, [value]);
  console.log("selected pack", packId);
  return (
    <Fragment>
      <Grid xs={11}>
        <Controller
          name={`packs.${index}.packId`}
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              type='number'
              select
              label='پک'
              error={
                formState.errors.packs
                  ? !!(
                      formState.errors.packs[
                        index as keyof typeof formState.errors.packs
                      ] as any
                    )?.packId
                  : false
              }
              helperText={
                formState.errors.packs
                  ? (
                      formState.errors.packs[
                        index as keyof typeof formState.errors.packs
                      ] as any
                    )?.packId?.message
                  : undefined
              }
              {...field}
              sx={{
                mb: "2rem",
              }}
            >
              {listPacks.map((option: any, idx: number) => (
                <MenuItem key={idx} value={option.id}>
                  {option.packName}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Grid>
      <Grid xs={1}>
        <Button onClick={onDelete} color='error'>
          حذف
        </Button>
      </Grid>
      <Grid xs={12}>
          <Grid container>
            <NestedPacksItems
              medicines={
                listPacks.find((p: any) => p.id == packId)?.medicinePacks
              }
              index={index}
            />
          </Grid>
      </Grid>
    </Fragment>
  );
};
