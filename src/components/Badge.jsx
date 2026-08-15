const variants = {
  amber: "bg-amber text-paper",
  teal: "bg-teal-soft text-teal",
  ink: "bg-ink text-paper",
  error: "bg-error text-paper",
  outline: "border border-line text-ink-soft",
};

export default function Badge({ children, variant = "teal", className = "" }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium tracking-wide uppercase ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
