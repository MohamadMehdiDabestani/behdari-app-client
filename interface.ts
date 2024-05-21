import { ReactNode } from "react";

export interface Children {
  children: ReactNode;
}

export interface ApiResult {
  message: string;
  statusCode: number;
  isSuccess: boolean;
  data: {
    pageId?: number;
    pageCount?: number;
    allEntitiesCount?: number;
    startPage?: number;
    endPage?: number;
    takeEntity?: number;
    skipEntity?: number;
    howManyShowPageAfterAndBefore?: number;
    [key:string] : any
  } 
}
