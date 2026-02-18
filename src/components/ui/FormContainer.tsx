import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface FormContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FormContainer = React.forwardRef<HTMLDivElement, FormContainerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col",
          "w-full max-w-sm sm:max-w-md",
          "bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-white/40",
          "p-5 sm:p-6 md:p-8",
          "gap-3",
        )}
        {...props}
      />
    );
  }
);

FormContainer.displayName = "FormContainer";
export default FormContainer;