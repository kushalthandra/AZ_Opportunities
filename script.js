async function renderSheet(sheetName, containerId) {
  try {
    const url = `https://docs.google.com/spreadsheets/d/1FlcMPeXZ6IfqqbrMqoNxcRqrRBmS_-31K_o618xQVDU/gviz/tq?tqx=out:json&sheet=${sheetName}`;
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows.map((r) => r.c.map((c) => c?.v ?? ""));

    const header = [
      "Date Updated",
      "Company",
      "Role",
      "Preferred Tech Skills",
      "Tier 1 / 2 / 3",
      "Criterias",
      "Status (Comment if Closed)",
      "Link"
    ];

    const statusIndex = header.indexOf("Status (Comment if Closed)");

    const openJobs = rows.filter((row) => {
      const status = row[statusIndex];
      return status && typeof status === "string" && status.toLowerCase() === "open";
    });

    const container = document.getElementById(containerId);
    container.innerHTML = "";

    openJobs.forEach((row) => {
      const company = row[1];
      const role = row[2];
      const techSkills = row[3];
      const applyLink = row[7];
      const dateUpdated = row[0];
      const criterias = row[5];

      const techList = techSkills ? techSkills.split(",").map((s) => s.trim()) : [];

      const card = document.createElement("div");
      card.className =
        "bg-white p-5 rounded-xl shadow hover:shadow-lg transition";

      const techHTML = techList
        .map(
          (skill) =>
            `<span class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">${skill}</span>`
        )
        .join(" ");

      card.innerHTML = `
        <h2 class="text-lg font-bold mb-1">${company} - ${role}</h2>
        <div class="mb-3 flex flex-wrap gap-2">${techHTML}</div>
        <p class="text-gray-600 mb-3 text-sm">
          <strong>Date Updated:</strong> ${dateUpdated}<br/>
          <strong>Criteria:</strong> ${criterias}
        </p>
        <a href="${applyLink}" target="_blank" class="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Apply
        </a>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    document.getElementById(containerId).innerHTML =
      "<p class='text-red-600'>Error loading data: " + err.message + "</p>";
  }
}
