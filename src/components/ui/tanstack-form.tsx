import { Slot } from "@radix-ui/react-slot";
import {
  createFormHook,
  createFormHookContexts,
  useStore,
} from "@tanstack/react-form";
import * as React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const {
  fieldContext,
  formContext,
  useFieldContext: _useFieldContext,
  useFormContext,
} = createFormHookContexts();

const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormItem,
  },
  formComponents: {},
});

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

const useFieldContext = () => {
  const itemContext = React.useContext(FormItemContext);
  const fieldContextValue = _useFieldContext();

  if (!fieldContextValue) {
    throw new Error("useFieldContext should be used within a form field");
  }

  if (!itemContext) {
    throw new Error("useFieldContext should be used within <FormItem>");
  }

  const { name, store, ...fieldContext } = fieldContextValue;
  const { id } = itemContext;

  const errors = useStore(store, (state) => state.meta.errors);
  const hasError = errors.length > 0;

  return {
    id,
    name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    errors,
    hasError,
    store,
    ...fieldContext,
  };
};

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  const { formItemId, hasError } = useFieldContext();

  return (
    <Label
      data-slot="form-label"
      data-error={hasError}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { hasError, formItemId, formDescriptionId, formMessageId } =
    useFieldContext();

  const getAriaDescribedBy = () => {
    const ids = [];
    if (formDescriptionId) ids.push(formDescriptionId);
    if (hasError) ids.push(formMessageId);
    return ids.length > 0 ? ids.join(" ") : undefined;
  };

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={getAriaDescribedBy()}
      aria-invalid={hasError}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFieldContext();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { errors, formMessageId } = useFieldContext();

  const body =
    errors.length > 0 ? String(errors[0]?.message ?? "") : props.children;

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      role="alert"
      {...props}
    >
      {body}
    </p>
  );
}

export {
  useAppForm,
  useFormContext,
  useFieldContext,
  withForm,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
};
