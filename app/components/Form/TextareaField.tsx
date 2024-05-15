interface TextareaFieldProps {
  name: string;
  label: string;
  rows?: number;
  type?: string;
  defaultValue?: string;
  placeholder: string;
  error?: string;
}

export function TextareaField({
  name,
  label,
  placeholder,
  error,
  rows = 4,
  defaultValue = '',
}: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-100"
      >
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        <textarea
          rows={rows}
          name={name}
          id={name}
          className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
          defaultValue={defaultValue}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={`${name}-error`}
        />
        {error && (
          <div className="pointer-events-none absolute right-0 top-1.5 flex items-center pr-3">
            <span
              className="material-symbols-outlined size-5 text-red-500"
              aria-hidden="true"
            >
              error
            </span>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
