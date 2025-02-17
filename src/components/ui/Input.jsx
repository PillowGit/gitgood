
export function Input({ className, ...props }) {
  return <input className={`p-2 border rounded bg-gray-700 text-white ${className}`} {...props} />;
}