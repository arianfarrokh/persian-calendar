"use client";

import * as React from "react";
import { FormLabel, FormLabelProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledLabel = styled(FormLabel)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem", // gap-2
  fontSize: "0.875rem", // text-sm
  lineHeight: 1,
  fontWeight: 500, // font-medium
  userSelect: "none",
  "&.Mui-disabled": {
    pointerEvents: "none",
    opacity: 0.5,
  },
}));

export function Label(props: FormLabelProps) {
  return <StyledLabel {...props} />;
}
