'use client'
import { Dispatch, SetStateAction } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Children } from "@/interface";
import { SxProps } from "@mui/material";
interface CustomTabPanelProps extends Children {
  value: number;
  index: number;
}
export const  CustomTabPanel = ({ children, value, index }: CustomTabPanelProps) => {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box sx={{py : "0.5rem"}}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
interface TabContainerProps extends Children {
  columns: string[];
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  sx? : SxProps
}
export const TabContainer = ({
  value,
  setValue,
  columns,
  children,
  sx
}: TabContainerProps)  => {
  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" , ...sx }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='basic tabs example'
        >
          {columns.map((e, idx) => (
            <Tab key={idx} label={e} {...a11yProps(idx)} />
          ))}
          
        </Tabs>
      </Box>
      {children}
      
    </Box>
  );
}
