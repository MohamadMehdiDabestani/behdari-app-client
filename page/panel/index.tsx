
import dynamic from "next/dynamic";

const Form = dynamic(() => import('./form'))
export const Panel = () => {
  return (
    <Form />
  );
};
