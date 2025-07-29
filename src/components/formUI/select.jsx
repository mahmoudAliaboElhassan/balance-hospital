export const FloatingLabelSelect = ({
  id,
  value,
  onChange,
  placeholder,
  icon,
  options,
  error,
  dir = "rtl", // Default is LTR
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group" dir={dir}>
      <select
        id={id}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`flex h-10 w-full rounded-md border ${
          error ? "border-red-500" : "border-input"
        } bg-background pl-10 pr-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${
          dir === "rtl" ? "text-right" : "text-left"
        }`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label
        htmlFor={id}
        className={`absolute ${
          dir === "rtl" ? "right-10" : "left-10"
        } transition-all duration-200 pointer-events-none text-sm font-medium ${
          isFocused || value
            ? "-top-2 text-xs bg-white dark:bg-black px-2 text-foreground rounded-sm"
            : "top-2.5 text-muted-foreground"
        }`}
      >
        {placeholder}
      </label>

      <div
        className={`absolute inset-y-0 ${
          dir === "rtl" ? "right-0 pr-3" : "left-0 pl-3"
        } flex items-center pointer-events-none text-muted-foreground transition-colors group-focus-within:text-foreground z-10`}
      >
        {icon}
      </div>
    </div>
  );
};
