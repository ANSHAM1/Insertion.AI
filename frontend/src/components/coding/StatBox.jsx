import React from "react";

export default function StatBox({ icon: Icon, value, label }) {
  return (
    <div className="card p-4 flex flex-col gap-2">
      <Icon size={16} className="text-orange-500" />
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
