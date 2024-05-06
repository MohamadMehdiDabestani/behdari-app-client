import { Box } from "@mui/material";
import { Form } from "./form";
export const Home = async () => {
  
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundImage: "url(/image/home/index.jpg)",
        backgroundPosition: " center",
        backgroundSize: " cover",
        backgroundRepeat: " no-repeat",
      }}
    >
      <Form />
    </Box>
  );
};
