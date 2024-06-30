import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Item } from "./item";
import { Alert } from "@mui/material";
import { useSearchParams } from "next/navigation";


export const List = ({ data ,visitDateMapKey}: { data: any[] , visitDateMapKey : object }) => {
  const params = useSearchParams();
  const type = Number(params.get("type") ?? 0);
  console.log(data);
  return (
    <Grid2 container spacing={5}>
      {data.length > 0 ? (
        data.map((e: any, idx: number) => (
          <Grid2 key={idx} xs={6} md={3}>
            <Item
              {...e}
              type={type}
              visitDate={
                e[
                  visitDateMapKey[
                    type as keyof typeof visitDateMapKey
                  ] as keyof typeof e
                ]
              }
            />
          </Grid2>
        ))
      ) : (
        <Alert sx={{ width: "100%", mt: "1rem" }} severity='warning'>
          موردی یافت نشد
        </Alert>
      )}
    </Grid2>
  );
};
