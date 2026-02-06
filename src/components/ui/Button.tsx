"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

type CommonProps = {
  variant?: ButtonVariant;
  loading?: boolean;
  asChild?: boolean;
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & CommonProps & { asChild?: false };
type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & CommonProps & { asChild: true };

type Props = ButtonProps | AnchorProps;

const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary: "bg-secondary text-white hover:bg-slate-600",
  outline: "border border-border text-foreground hover:bg-muted",
  ghost: "text-foreground hover:bg-muted"
};

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(
  ({ className, variant = "primary", loading, disabled, asChild, children, ...props }, ref) => {
    const classes = cn(baseStyles, variantStyles[variant], className, "px-4 py-2");

    if (asChild) {
      const linkProps = props as AnchorProps;
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          aria-disabled={disabled || loading}
          {...linkProps}
        >
          {loading ? <Spinner label="Loading" size="sm" /> : children}
        </Link>
      );
    }

    const buttonProps = props as ButtonProps;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        disabled={disabled || loading}
        {...buttonProps}
      >
        {loading ? <Spinner label="Loading" size="sm" /> : children}
      </button>
    );
  }
);

Button.displayName = "Button";
