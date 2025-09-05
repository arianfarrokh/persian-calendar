import * as React from "react";
import { styled } from "@mui/material/styles";
import { Box, BoxProps } from "@mui/material";

interface BadgeProps extends BoxProps {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const StyledBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== "variant",
})<BadgeProps>(({ theme, variant = "default" }) => {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.shape.borderRadius,
    padding: "2px 8px",
    fontSize: "0.75rem",
    fontWeight: 500,
    lineHeight: 1.5,
    whiteSpace: "nowrap",
    width: "fit-content",
    gap: "4px",
    overflow: "hidden",
    border: "1px solid",
    transition: "color 0.2s, box-shadow 0.2s",
    "& svg": {
      width: 12,
      height: 12,
      flexShrink: 0,
      pointerEvents: "none",
    },
  };

  const variants: Record<string, any> = {
    default: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderColor: "transparent",
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    secondary: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
      borderColor: "transparent",
      "&:hover": {
        backgroundColor: theme.palette.secondary.dark,
      },
    },
    destructive: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.common.white,
      borderColor: "transparent",
      "&:hover": {
        backgroundColor: theme.palette.error.dark,
      },
    },
    outline: {
      backgroundColor: "transparent",
      color: theme.palette.text.primary,
      borderColor: theme.palette.divider,
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  };

  return {
    ...base,
    ...(variants[variant] || variants.default),
  };
});

function Badge({ variant = "default", ...props }: BadgeProps) {
  return <StyledBadge variant={variant} component="span" {...props} />;
}

export { Badge };
