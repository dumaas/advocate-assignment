"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [advocates, setAdvocates] = useState([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const handleSearch = (e) => {
    const newSearchTerm = e.target.value.toLowerCase();
    setSearchTerm(e.target.value);  // Display original case

    console.log("filtering advocates on: ", newSearchTerm);
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(newSearchTerm) ||
        advocate.lastName.toLowerCase().includes(newSearchTerm) ||
        advocate.city.toLowerCase().includes(newSearchTerm) ||
        advocate.degree.toLowerCase().includes(newSearchTerm) ||
        advocate.specialties.some((s) =>
          s.toLowerCase().includes(newSearchTerm)
        ) ||
        advocate.yearsOfExperience.toString().includes(newSearchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const handleReset = () => {
    console.log("resetting search");
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div className="mb-4 p-3 bg-gray-100 border rounded">
        <h3 className="mb-2 font-bold">Find Advocates</h3>
        <div className="flex gap-2">
          <input
            className="flex-1 p-2 border rounded"
            placeholder="Search by name, city, degree, etc."
            onChange={handleSearch}
            value={searchTerm}
          />
          <button
            className="px-3 py-2 bg-gray-300 rounded"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-600">
            Searching for: <span className="font-bold">{searchTerm}</span>
          </p>
        )}
      </div>
      <br />
      <br />
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">First Name</th>
            <th className="p-2 text-left">Last Name</th>
            <th className="p-2 text-left">City</th>
            <th className="p-2 text-left">Degree</th>
            <th className="p-2 text-left">Specialties</th>
            <th className="p-2 text-left">Years of Experience</th>
            <th className="p-2 text-left">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            return (
              <tr key={advocate.id} className="border-b">
                <td className="p-2">{advocate.firstName}</td>
                <td className="p-2">{advocate.lastName}</td>
                <td className="p-2">{advocate.city}</td>
                <td className="p-2">{advocate.degree}</td>
                <td className="p-2">
                  {advocate.specialties.map((s) => (
                    <div key={s}>{s}</div>
                  ))}
                </td>
                <td className="p-2">{advocate.yearsOfExperience}</td>
                <td className="p-2">{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
