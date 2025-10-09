import React from "react";

const StatsCard = ({
  icon: Icon,
  iconColor = "bg-blue-100",
  iconTextColor = "text-blue-600",
  title,
  description,
  buttonText,
  buttonColor = "bg-blue-500 hover:bg-blue-600",
  onClick,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div
        className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center mb-4`}
      >
        <Icon className={`w-6 h-6 ${iconTextColor}`} />
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>

      <p className="text-gray-600 text-sm mb-4">{description}</p>

      <button
        onClick={onClick}
        className={`w-full text-white py-2 rounded-lg transition ${buttonColor}`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default StatsCard;
