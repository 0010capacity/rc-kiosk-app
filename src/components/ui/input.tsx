import { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
      {...props}
    />
  );
}