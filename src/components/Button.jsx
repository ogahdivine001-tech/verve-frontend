const variants = {
  primary: "bg-ink text-paper hover:bg-ink-soft",
  accent: "bg-amber text-paper hover:bg-amber-dark",
  outline: "border border-ink text-ink hover:bg-ink hover:text-paper",
  ghost: "text-ink hover:bg-warm-grey",
  danger: "bg-error text-paper hover:opacity-90",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
      )}
      {children}
    </button>
  );
}
