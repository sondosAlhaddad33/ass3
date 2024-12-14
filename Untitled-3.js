// Function to fetch and display data in the table
async function fetchData() {
  const apiUrl =
    "https://data.gov.bh/api/explore/v2.1/catalog/datasets/01-statistics-of-students-nationalities_updated/records?where=colleges%20like%20%22IT%22%20AND%20the_programs%20like%20%22bachelor%22&limit=100";

  try {
    // Fetch data from the API
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    const records = data.results;

    // Sorting logic (by year, semester, and nationality)
    const semesterOrder = {
      "First Semester": 1,
      "Second Semester": 2,
      "Summer Semester": 3,
    };

    const nationalityOrder = {
      Bahraini: 1,
      "GCC National": 2,
      Other: 3,
    };

    records.sort((a, b) => {
      const yearA = parseInt(a.year.split("-")[0]);
      const yearB = parseInt(b.year.split("-")[0]);
      if (yearA !== yearB) return yearA - yearB;

      const semesterA = semesterOrder[a.semester] || 99;
      const semesterB = semesterOrder[b.semester] || 99;
      if (semesterA !== semesterB) return semesterA - semesterB;

      const nationalityA = nationalityOrder[a.nationality] || 99;
      const nationalityB = nationalityOrder[b.nationality] || 99;
      return nationalityA - nationalityB;
    });

    // Populate the table with data
    populateTable(records);
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Failed to fetch data. Please try again later.");
  }
}

// Function to populate the table with records
function populateTable(records) {
  const tableBody = document.getElementById("data-table");

  // Clear existing rows (if any)
  tableBody.innerHTML = "";

  // Add rows dynamically
  records.forEach((record) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${record.year || "N/A"}</td>
      <td>${record.semester || "N/A"}</td>
      <td>${record.the_programs || "N/A"}</td>
      <td>${record.nationality || "N/A"}</td>
      <td>${record.colleges || "N/A"}</td>
      <td>${record.number_of_students || "N/A"}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Call fetchData to load the table when the page loads
fetchData();
