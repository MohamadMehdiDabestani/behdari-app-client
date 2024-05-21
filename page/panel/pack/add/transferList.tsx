"use client";
import { Fragment, useCallback, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { Box, Typography } from "@mui/material";

function not(a: any, b: any) {
  return a.filter((value: any) => b.indexOf(value) === -1);
}

function intersection(a: any, b: any) {
  return a.filter((value: any) => b.indexOf(value) !== -1);
}
interface Props {
  list: number[];
  labels: {
    label: string;
    id: number;
  }[];
  setSelected : (value: number[]) => void
}
export default function TransferList({setSelected, labels, list }: Props) {
  const [checked, setChecked] = useState<number[]>([]);
  const [left, setLeft] = useState<number[]>(list);
  const [right, setRight] = useState<number[]>([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);
  const handleToggle = (value: any) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  useEffect(() => {
    setSelected(right)
  }, [right]);
  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };
  const customList = (items: any) => (
    <Paper sx={{ width: 500, height: 350, overflow: "auto" }}>
      <List dense component='div' role='list'>
        {items.map((value: any, idx: number) => {
          const labelId = `transfer-list-item-${value}-label`;
          return (
            <ListItemButton
              key={value}
              role='listitem'
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={`${labels.find((e) => e.id == value)?.label}`}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );

  return (
    <Fragment>
      <Grid container spacing={2} justifyContent='center' alignItems='center'>
        <Grid item>
          {customList(left)}
          <Box sx={{ my: "0.7rem" }} component='p'></Box>
        </Grid>
        <Grid item>
          <Grid container direction='column' alignItems='center'>
            <Button
              sx={{ my: 0.5 }}
              variant='outlined'
              size='small'
              onClick={handleAllRight}
              disabled={left.length === 0}
              aria-label='move all right'
            >
              ≫
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant='outlined'
              size='small'
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label='move selected right'
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant='outlined'
              size='small'
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label='move selected left'
            >
              &lt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant='outlined'
              size='small'
              onClick={handleAllLeft}
              disabled={right.length === 0}
              aria-label='move all left'
            >
              ≪
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          {customList(right)}
          <Typography
            variant='caption'
            textAlign='center'
            sx={{ mt: "0.7rem" }}
            component='p'
          >
            انتخاب شده ها
          </Typography>
        </Grid>
      </Grid>
    </Fragment>
  );
}
