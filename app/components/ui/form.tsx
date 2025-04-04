'use client';

import * as React from "react";
import { 
  useForm as useHookForm, 
  UseFormProps, 
  SubmitHandler, 
  UseFormReturn, 
  FieldValues, 
  FieldPath, 
  FieldPathValue, 
  UseFormSetValue,
  UseFormWatch
} from "react-hook-form";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";
import { Label } from "./label";

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: {
  name: TName;
  children: React.ReactNode;
}) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      {props.children}
    </FormFieldContext.Provider>
  );
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

type FormContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
> = {
  register: UseFormReturn<TFieldValues, TContext>["register"];
  getValues: UseFormReturn<TFieldValues, TContext>["getValues"];
  setValue: UseFormSetValue<TFieldValues>;
  watch: UseFormWatch<TFieldValues>;
  handleSubmit: UseFormReturn<TFieldValues, TContext>["handleSubmit"];
  trigger: UseFormReturn<TFieldValues, TContext>["trigger"];
  formState: UseFormReturn<TFieldValues, TContext>["formState"];
  control: UseFormReturn<TFieldValues, TContext>["control"];
  reset: UseFormReturn<TFieldValues, TContext>["reset"];
  getFieldState: UseFormReturn<TFieldValues, TContext>["getFieldState"];
  clearErrors: UseFormReturn<TFieldValues, TContext>["clearErrors"];
  setError: UseFormReturn<TFieldValues, TContext>["setError"];
  setFocus: UseFormReturn<TFieldValues, TContext>["setFocus"];
  resetField: UseFormReturn<TFieldValues, TContext>["resetField"];
  unregister: UseFormReturn<TFieldValues, TContext>["unregister"];
};

const FormContext = React.createContext<FormContextValue>(
  {} as FormContextValue
);

const useFormContext = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
>() => {
  return React.useContext(
    FormContext as unknown as React.Context<
      FormContextValue<TFieldValues, TContext>
    >
  );
};

const Form = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
>({
  children,
  form,
}: {
  children: React.ReactNode;
  form: UseFormReturn<TFieldValues, TContext>;
}) => {
  return (
    <FormContext.Provider value={form}>
      <form
        onSubmit={form.handleSubmit(form.handleSubmit as any)}
        className="space-y-6"
      >
        {children}
      </form>
    </FormContext.Provider>
  );
};

const useForm = <TFieldValues extends FieldValues = FieldValues>(
  props?: UseFormProps<TFieldValues>
) => {
  return useHookForm<TFieldValues>({
    mode: "onSubmit",
    ...props,
  });
};

export {
  useForm,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  useFormField,
  useFormContext,
};