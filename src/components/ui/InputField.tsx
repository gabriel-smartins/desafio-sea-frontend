import type { ChangeEvent, InputHTMLAttributes, FocusEvent } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  register?: (name: any) => any;
  name?: string;
}

export function InputField({
  label,
  error,
  register,
  name,
  className = "",
  onChange,
  onBlur,
  onFocus,
  ...props
}: InputFieldProps) {
  const registration = register && name ? register(name) : {};

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    registration.onChange?.(event);
    onChange?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    registration.onBlur?.(event);
    onBlur?.(event);
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    registration.onFocus?.(event);
    onFocus?.(event);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        {...registration}
        {...props}
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={`mt-1 block w-full rounded-md border p-2 shadow-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
