"use client";
import { ApiResult } from "@/interface";
import { Filter } from "./filter";
import { Fragment, useEffect } from "react";
import { useAtom } from "jotai";
import { loading, snack } from "@/atom";
import { List } from "./list";

export const Report = ({ message, isSuccess, data }: ApiResult) => {
  const [_, setSnack] = useAtom(snack);
  const [__,setLoading] = useAtom(loading);
  useEffect(() => {
    setLoading(false)
    setSnack({
      show: true,
      text: message,
      type: isSuccess ? "success" : "error",
    });
  }, [data]);
  return (
    <Fragment>
      <Filter />
      <List data={data as any[]} />
    </Fragment>
  );
};
