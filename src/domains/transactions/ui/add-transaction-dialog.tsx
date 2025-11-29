// components/transactions/AddTransactionDialog.tsx
import * as z from "zod";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import { Input } from "@/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { Button } from "@/components/button";
import {
  FieldSet,
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
  FieldContent,
  FieldDescription,
} from "@/components/field";

interface AddTransactionDialogProps<TFormValues> {
  trigger: React.ReactNode;
  schema: z.ZodType<TFormValues>;
  onSubmit: (data: TFormValues) => void;
}

export function AddTransactionDialog<TFormValues extends FieldValues>({
  trigger,
  schema,
  onSubmit,
}: AddTransactionDialogProps<TFormValues>) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date(),
    } as any,
  });

  const handleSubmit = (data: TFormValues) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-[80vw] overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-80">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new expense.
          </DialogDescription>
        </DialogHeader>

        {/* Form with submit handler */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldSet>
            <FieldGroup>
              <Controller
                name="amount"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="vertical"
                    aria-invalid={fieldState.invalid}
                  >
                    <FieldLabel id="amount-label" htmlFor="amount">
                      Amount
                      <span aria-hidden="true" className="text-red-500">
                        *
                      </span>
                    </FieldLabel>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      aria-disabled={isSubmitting}
                      aria-labelledby="amount-label"
                      id="amount"
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*"
                      step="0.01"
                      required={true}
                      aria-required="true"
                      placeholder="0.00"
                      aria-invalid={fieldState.invalid}
                      aria-describedby={
                        fieldState.error ? `${field.name}-error` : undefined
                      }
                      className="border border-neutral-800 dark:border-neutral-700 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    {fieldState.error && (
                      <FieldError id={`${field.name}-error`} role="alert">
                        {fieldState.error.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="currency"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="currency" id="currency-label">
                      Currency
                      <span aria-hidden="true" className="text-red-500">
                        *
                      </span>
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value ?? ""}
                      onValueChange={(v) => field.onChange(v || undefined)}
                    >
                      <SelectTrigger
                        aria-labelledby="currency-label"
                        className="border border-neutral-800 dark:border-neutral-700"
                        aria-invalid={fieldState.invalid}
                        aria-describedby={
                          fieldState.error ? `${field.name}-error` : undefined
                        }
                        disabled={isSubmitting}
                        aria-disabled={isSubmitting}
                      >
                        <SelectValue
                          id="currency-trigger"
                          placeholder="Choose currency"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {DEFAULT_CURRENCIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <FieldError id={`${field.name}-error`} role="alert">
                        {fieldState.error.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="category"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel id="category-label" htmlFor="category">
                      Category
                      <span aria-hidden="true" className="text-red-500">
                        *
                      </span>
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value ?? ""}
                      onValueChange={(v) => field.onChange(v || undefined)}
                    >
                      <SelectTrigger
                        className="border border-neutral-800 dark:border-neutral-700"
                        aria-labelledby="category-label"
                        aria-invalid={fieldState.invalid}
                        aria-describedby={
                          fieldState.error ? `${field.name}-error` : undefined
                        }
                        disabled={isSubmitting}
                        aria-disabled={isSubmitting}
                      >
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEFAULT_CATEGORIES.map((category) => (
                          <SelectItem key={category.key} value={category.key}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <FieldError id={`${field.name}-error`} role="alert">
                        {fieldState.error.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="accountId"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="accountId" id="accountId-label">
                      Origin account
                      <span aria-hidden="true" className="text-red-500">
                        *
                      </span>
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        aria-labelledby="accountId-label"
                        name={field.name}
                        aria-invalid={fieldState.invalid}
                        aria-describedby={
                          fieldState.error ? `${field.name}-error` : undefined
                        }
                        className="border border-neutral-800 dark:border-neutral-700"
                        disabled={isSubmitting}
                        aria-disabled={isSubmitting}
                      >
                        <SelectValue placeholder="Choose account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="account-1">Account 1</SelectItem>
                        <SelectItem value="account-2">Account 2</SelectItem>
                        <SelectItem value="account-3">Account 3</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <FieldError id={`${field.name}-error`} role="alert">
                        {fieldState.error.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="date"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel id="date-label" htmlFor="date">
                      Date
                      <span aria-hidden="true" className="text-red-500">
                        *
                      </span>
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger
                        asChild
                        aria-invalid={fieldState.invalid}
                        aria-describedby={
                          fieldState.error ? `${field.name}-error` : undefined
                        }
                        aria-labelledby="date-label"
                      >
                        <Button
                          variant="outline"
                          type="button"
                          aria-label="Pick a date"
                          className="w-full justify-start text-left font-normal"
                          disabled={isSubmitting}
                          aria-disabled={isSubmitting}
                          aria-haspopup="dialog"
                          aria-controls="expense-date-calendar"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="p-0">
                        <Calendar
                          id="expense-date-calendar"
                          mode="single"
                          autoFocus
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) field.onChange(date);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.error && (
                      <FieldError id={`${field.name}-error`} role="alert">
                        {fieldState.error.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldContent>
                      <FieldLabel htmlFor="description">Description</FieldLabel>
                      <FieldDescription id="description-help">
                        Optional description for this expense (max 100
                        characters).
                      </FieldDescription>
                    </FieldContent>
                    <Textarea
                      id="description"
                      placeholder="Coffee with the team..."
                      className="resize-none h-auto border border-neutral-800 dark:border-neutral-700"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      maxLength={100}
                      aria-describedby={
                        fieldState.error
                          ? `${field.name}-error`
                          : "description-help"
                      }
                      disabled={isSubmitting}
                      aria-disabled={isSubmitting}
                    />
                    {fieldState.error && (
                      <FieldError id={`${field.name}-error`} role="alert">
                        {fieldState.error.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                handleOpenChange(false);
              }}
              className="transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="transition-colors hover:bg-blue-600 disabled:hover:bg-blue-500"
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
