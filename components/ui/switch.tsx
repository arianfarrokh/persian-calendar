"use client";

import * as React from "react";
import { Switch as MuiSwitch, SwitchProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledSwitch = styled(MuiSwitch)(({ theme }) => ({
  width: 32,  // معادل w-8
  height: 18, // معادل h-[1.15rem]
  padding: 0,
  display: "flex",
  "& .MuiSwitch-switchBase": {
    padding: 1,
    "&.Mui-checked": {
      transform: "translateX(14px)", // data-[state=checked]:translate-x
      color: theme.palette.common.white,
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
      },
    },
    "&.Mui-disabled": {
      opacity: 0.5,
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.background.paper,
    width: 16, // size-4
    height: 16,
    boxShadow: "0 0 0 0 transparent",
  },
  "& .MuiSwitch-track": {
    borderRadius: 18 / 2,
    backgroundColor: theme.palette.action.disabledBackground, // data-[state=unchecked]:bg-input
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 200,
    }),
  },
}));

export function Switch(props: SwitchProps) {
  return <StyledSwitch {...props} />;
}
