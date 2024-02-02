import React from "react";

function TopButtons({ setQuery }) {
  const cities = [
    {
      id: 1,
      title: "New Delhi",
    },
    {
      id: 2,
      title: "Mumbai",
    },
    {
      id: 3,
      title: "Bangalore",
    },
    {
      id: 4,
      title: "Kerala",
    },
    {
      id: 5,
      title: "Chennai",
    },
  ];

  return (
    <div className="flex items-center justify-around my-6">
      {cities.map((city) => (
        <button
          key={city.id}
          className="text-white text-lg font-medium hover:scale-125 hover:text-black"
          onClick={() => setQuery({ q: city.title })}
        >
          {city.title}
        </button>
      ))}
    </div>
  );
}

export default TopButtons;