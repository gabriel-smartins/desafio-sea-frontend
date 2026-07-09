import type { SelectHTMLAttributes } from "react";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  register?: (name: any) => any;
  name?: string;
  options: Array<{ value: string; label: string }>;
}

export function SelectField({
  label,
  error,
  register,
  name,
  options,
  className = "",
  ...props
}: SelectFieldProps) {
  const registration = register && name ? register(name) : {};

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        {...registration}
        {...props}
        name={name}
        className={`mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
