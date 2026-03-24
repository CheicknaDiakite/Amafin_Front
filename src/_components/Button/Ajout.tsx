import { Button } from "@mui/material";
import { ReactNode } from "react";

interface NavProps {
  children?: ReactNode;
}

export default function Ajout({children, functionopen}: NavProps | any) {

  return (
    <Button variant="outlined" className="rounded border animated-border" onClick={functionopen}>
        {children}
    </Button>
  )
}
