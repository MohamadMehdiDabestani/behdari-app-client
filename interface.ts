import { ReactNode } from "react";

export interface Children {
    children: ReactNode;
  }

export interface ApiResult{ 
  message : string,
  statusCode : number,
  isSuccess : boolean,
  data : any
}