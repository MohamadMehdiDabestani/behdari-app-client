import { Fragment } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {
  Checkbox,
  Box,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ErrorMessage } from "@hookform/error-message";

interface Props {
  index: number;
  list: { id: number; name: string }[];
}
export const NestedItems = ({ index, list }: Props) => {
  const { control, formState } = useFormContext(); // retrieve those props
  const dynamicOptionFormPart = useFieldArray({
    name: `list.${index}.medicineInfo`,
    control: control,
  });
  return (
    <Fragment>
      <Grid xs={12}>
        <Divider
          sx={{
            display: "flex",
          }}
        >
          لیست دارویی
          <AddIcon
            fontSize='small'
            color='primary'
            sx={{
              cursor: "pointer",
            }}
            onClick={() => {
              console.log("onClick");
              dynamicOptionFormPart.append({
                cost: 0,
                medicineId: 0,
              });
            }}
          />
        </Divider>
      </Grid>
      {dynamicOptionFormPart.fields.map((e, idx) => (
        <Fragment key={e.id}>
          <Grid xs={6} sx={{mb : "1rem" }} >
            <Controller
              name={`list.${index}.medicineInfo.${idx}.medicineId`}
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id='medicineLabel'>دارو ها</InputLabel>
                  <Select
                    labelId='medicineLabel'
                    {...field}
                    variant='filled'
                    fullWidth
                    renderValue={(selected: number) =>
                      list.find((e) => selected == e.id)?.name
                    }
                  >
                    {list.map((e, idx: number) => (
                      <MenuItem key={idx} value={e.id}>
                        <Checkbox checked={field.value == e.id} />
                        <ListItemText primary={e.name} />
                      </MenuItem>
                    ))}
                  </Select>
                  <ErrorMessage
                    errors={formState.errors}
                    name={`list.${index}.medicineInfo.${idx}.medicineId`}
                    render={({ message }) => (
                      <FormHelperText error={true}>{message}</FormHelperText>
                    )}
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid xs={6} sx={{mb : "1rem" }}>
            <Controller
              name={`list.${index}.medicineInfo.${idx}.cost`}
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <TextField fullWidth label='هزینه' {...field} />
                  <ErrorMessage
                    errors={formState.errors}
                    name={`list.${index}.medicineInfo.${idx}.cost`}
                    render={({ message }) => (
                      <FormHelperText error={true}>{message}</FormHelperText>
                    )}
                  />
                </FormControl>
              )}
            />
          </Grid>
        </Fragment>
      ))}
    </Fragment>
  );
};
