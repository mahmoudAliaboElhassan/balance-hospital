export const FloatingLabelInput = ({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  rightIcon,
  onRightIconClick,
  error,
  dir,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isRTL = dir === "rtl";

  return (
    <div className="relative group">
      <div
        className={`absolute inset-y-0 ${
          isRTL ? "right-0 pr-3" : "left-0 pl-3"
        } flex items-center pointer-events-none text-muted-foreground transition-colors group-focus-within:text-foreground`}
      >
        {icon}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        dir={dir}
        className={`flex h-10 w-full rounded-md border ${
          error ? "border-red-500" : "border-input"
        } bg-background ${isRTL ? "pr-12 pl-3" : "pl-12 pr-3"} ${
          rightIcon ? (isRTL ? "pl-10" : "pr-10") : ""
        } py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 peer placeholder-transparent`}
        placeholder={placeholder}
        {...props}
      />
      <label
        htmlFor={id}
        className={`absolute ${
          isRTL ? "right-12" : "left-12"
        } transition-all duration-200 pointer-events-none text-sm font-medium ${
          isFocused || value
            ? "-top-2 text-xs bg-white dark:bg-black px-2 text-foreground rounded-sm"
            : "top-2.5 text-muted-foreground"
        }`}
      >
        {placeholder}
      </label>
      {rightIcon && (
        <button
          type="button"
          onClick={onRightIconClick}
          className={`absolute inset-y-0 ${
            isRTL ? "left-0 pl-3" : "right-0 pr-3"
          } flex items-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:text-foreground`}
        >
          {rightIcon}
        </button>
      )}
    </div>
  );
};
