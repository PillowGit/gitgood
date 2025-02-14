export function Button({ children, className, ...props }) {
    return <button className={`px-4 py-2 text-white rounded ${className}`} {...props}>{children}</button>;
  }