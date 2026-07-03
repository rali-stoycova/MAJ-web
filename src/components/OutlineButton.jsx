export default function OutlineButton({ children, className = "", href, ...props }) {
  const classes = `group relative inline-flex items-center justify-center border border-white px-5 py-3 font-display text-sm font-light uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-white hover:text-black md:px-6 md:py-4 md:text-base ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
