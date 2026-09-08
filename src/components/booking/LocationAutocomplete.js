"use client";

import React, { useState, useRef } from "react";

export default function LocationAutocomplete({ value, onChange, placeholder, icon: Icon }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);

  const handleInput = (e) => {
    const val = e.target.value;
    onChange({ name: val, url: "" });

    if (val.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&countrycodes=id&limit=5`);
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Geocoding failed", err);
      }
    }, 500);
  };

  const handleSelect = (place) => {
    const locationName = place.display_name;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`;
    onChange({ name: locationName, url });
    setShowSuggestions(false);
  };

  return (
    <div className="relative flex flex-col w-full">
      <div className="relative flex items-center">
        {Icon && <Icon className="absolute left-4 text-gray-400" size={18} z-10 />}
        <input 
          required 
          type="text" 
          value={value} 
          onChange={handleInput} 
          onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder} 
          className="w-full bg-[#F4F4F6] rounded-2xl py-3.5 pl-12 pr-4 text-[15px] font-medium text-primary outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400" 
        />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 max-h-48 overflow-y-auto z-[60]">
          {suggestions.map((s, i) => (
            <li 
              key={i} 
              onClick={() => handleSelect(s)} 
              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 text-sm font-medium text-primary truncate"
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
