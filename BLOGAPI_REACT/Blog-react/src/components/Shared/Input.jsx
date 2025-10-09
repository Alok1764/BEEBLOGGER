import React from "react";

const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = false,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full py-3 px-4 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                     outline-none transition
                     ${Icon ? "pl-10" : "pl-4"}`}
        />
      </div>
    </div>
  );
};

export default Input;
