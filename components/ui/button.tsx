import * as React from "react";
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";

// Our custom props
interface ExtraProps {
  customVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  customSize?: "sm" | "default" | "lg" | "icon";
}

type ButtonProps = MuiButtonProps & ExtraProps;

const CustomButton = styled(MuiButton, {
  shouldForwardProp: (prop) =>
    !["customVariant", "customSize"].includes(prop as string),
})<ExtraProps>(({ theme, customVariant = "default", customSize = "default" }) => {
  const base = {
    textTransform: "none",
    fontWeight: 500,
    borderRadius: 6,
    transition: "all 0.2s",
    "& svg": {
      pointerEvents: "none",
      flexShrink: 0,
      width: 16,
      height: 16,
    },
    "&:disabled": {
      opacity: 0.5,
      pointerEvents: "none",
    },
  };

  const variants: Record<string, any> = {
    default: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      "&:hover": { backgroundColor: theme.palette.primary.dark },
    },
    destructive: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.common.white,
      "&:hover": { backgroundColor: theme.palette.error.dark },
    },
    outline: {
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
      },
    },
    secondary: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
      "&:hover": { backgroundColor: theme.palette.secondary.dark },
    },
    ghost: {
      backgroundColor: "transparent",
      color: theme.palette.text.primary,
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
      },
    },
    link: {
      backgroundColor: "transparent",
      color: theme.palette.primary.main,
      textDecoration: "underline",
      textUnderlineOffset: "4px",
      "&:hover": { textDecoration: "underline" },
    },
  };

  const sizes: Record<string, any> = {
    sm: { height: 32, padding: "0 12px", fontSize: "0.8125rem" },
    default: { height: 36, padding: "0 16px", fontSize: "0.875rem" },
    lg: { height: 40, padding: "0 24px", fontSize: "0.9375rem" },
    icon: { height: 36, width: 36, minWidth: 36, padding: 0 },
  };

  return {
    ...base,
    ...(variants[customVariant] || variants.default),
    ...(sizes[customSize] || sizes.default),
  };
});

function Button({ customVariant = "default", customSize = "default", ...props }: ButtonProps) {
  return <CustomButton customVariant={customVariant} customSize={customSize} {...props} />;
}

export { Button };
