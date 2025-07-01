"use client";

import { useEffect, useState } from "react";

interface Advocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: string;
  createdAt?: string;
}

export default function Home() {
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMorePages, setHasMorePages] = useState<boolean>(true);

  useEffect(() => {
    fetchAdvocates(1);
  }, []);

  const fetchAdvocates = async (page = 1) => {
    console.log("fetching advocates on page: ", page);
    setLoading(true);
    setSearchTerm("");  // Clear search when changing pages
    try {
      const response = await fetch(`/api/advocates?page=${page}`);
      const data = await response.json();
      setFilteredAdvocates(data.data);
      setCurrentPage(page);

      // Fewer than 10 results means no more pages
      setHasMorePages(data.data.length === 10);
    } catch (error) {
      console.error("Error fetching advocates:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value.toLowerCase();
    setSearchTerm(e.target.value);  // Display original case
    console.log("filtering advocates on: ", newSearchTerm);

    // Filter only the current page results
    const filtered = filteredAdvocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(newSearchTerm) ||
        advocate.lastName.toLowerCase().includes(newSearchTerm) ||
        advocate.city.toLowerCase().includes(newSearchTerm) ||
        advocate.degree.toLowerCase().includes(newSearchTerm) ||
        advocate.yearsOfExperience.toString().includes(newSearchTerm)
      );
    });
    
    setFilteredAdvocates(filtered);
  };

  const handleReset = () => {
    console.log("resetting search");
    setSearchTerm("");
    fetchAdvocates(1);  // Reset to first page
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
            <span className="text-xs text-gray-500"> (current page only)</span>
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
      <div className="mt-4 flex gap-2 justify-center">
        <button
          className="px-3 py-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => fetchAdvocates(currentPage - 1)}
          disabled={loading || currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-600">Page {currentPage}</span>
        <button
          className="px-3 py-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => fetchAdvocates(currentPage + 1)}
          disabled={loading || !hasMorePages}
        >
          Next
        </button>
      </div>
    </main>
  );
}
