document.getElementById('addEntry').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form submission

    // Get input values
    const week = document.getElementById('week').value;
    const date = document.getElementById('date').value;
    const subjectName = document.getElementById('subjectName').value;
    const facultyName = document.getElementById('facultyName').value;
    const module = document.getElementById('module').value;
    const partNo = document.getElementById('partNo').value;
    const hours = document.getElementById('hours').value;

    // Validate inputs
    if (!week || !date || !subjectName || !facultyName || !module || !hours) {
        alert('🐵...go fill out all fields.');
        return;
    }

    // Add row to the table
    const tableBody = document.querySelector('#entriesTable tbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${week}</td>
        <td>${date}</td>
        <td>${subjectName}</td>
        <td>${facultyName}</td>
        <td>${module}</td>
        <td>${partNo}</td>
        <td>${hours}</td>
        <td><button class="deleteEntry">Delete</button></td>
    `;

    tableBody.appendChild(newRow);

    // Clear the form
    document.getElementById('invoiceForm').reset();

    // Add event listener to the delete button
    newRow.querySelector('.deleteEntry').addEventListener('click', function () {
        tableBody.removeChild(newRow);
    });

    window.scrollTo(0, 0); // Scroll to the top of the page
});

document.getElementById('invoiceForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    // Calculate total hours and salary
    const rows = document.querySelectorAll('#entriesTable tbody tr');

    let totalHours = 0;
    let totalSalary = 0;
    const hourlyRate = 800; // Example: ₹800 per hour

    rows.forEach(row => {
        const hours = parseFloat(row.cells[6].textContent);
        totalHours += hours;
        totalSalary += hours * hourlyRate;
    });

    // Display total hours and salary
    document.getElementById('totalHours').textContent = totalHours.toFixed(2);
    document.getElementById('totalSalary').textContent = totalSalary.toFixed(2);

    // Show the invoice result section and PDF button
    document.getElementById('invoiceResult').classList.remove('hidden');
    document.getElementById('printPdf').classList.remove('hidden');
});






document.getElementById('printPdf').addEventListener('click', function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set colors
    const headerBackground = [255, 204, 0]; // Yellow
    const headerTextColor = [0, 0, 0]; // Black
    const textColor = [0, 0, 0]; // Black
    const borderColor = [200, 200, 200]; // Light gray

    // Add title
    doc.setFontSize(18);
    doc.setTextColor(...headerTextColor);
    doc.text("Salary Invoice", 10, 20);

    // Add total hours and salary
    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    let y = 30;
    doc.text(`Total Hours: ${document.getElementById('totalHours').textContent}`, 10, y);
    y += 10;
    doc.text(`Total Salary: Rs ${document.getElementById('totalSalary').textContent}`, 10, y);
    y += 20;

    // Table Headers
    const headers = ["Week", "Date", "Subject", "Faculty", "Module", "Part No", "Hours"];
    const colWidths = [20, 30, 45, 45, 35, 25, 20, 80]; // Adjusted widths
    const rowHeight = 12;
    let x = 10;

    // Draw table headers
    doc.setFillColor(...headerBackground);
    doc.setTextColor(...headerTextColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold"); // Bold text for headers

    headers.forEach((header, index) => {
        doc.rect(x, y, colWidths[7], rowHeight, "F"); // Draw yellow header background
        doc.text(header, x + colWidths[index] / 4, y + rowHeight / 2 + 2); // Centered text
        x += colWidths[index];
    });

    y += rowHeight;

    // Get table rows
    const rows = document.querySelectorAll('#entriesTable tbody tr');

    if (rows.length === 0) {
        doc.setTextColor(255, 0, 0);
        doc.text("No data available!", 10, y + 10);
    } else {
        // Draw table rows
        rows.forEach(row => {
            x = 10;
            const cells = row.querySelectorAll('td');

            cells.forEach((cell, index) => {
                if (index < headers.length) {
                    doc.setDrawColor(...borderColor);
                    doc.rect(x, y, colWidths[index], rowHeight); // Draw borders

                    // Add cell content
                    doc.setTextColor(...textColor);
                    doc.setFont("helvetica", "normal"); // Regular text
                    doc.text(cell.textContent.trim(), x + 2, y + rowHeight - 4);
                    x += colWidths[index];
                }
            });

            y += rowHeight;
        });
    }

    // Save the PDF
    doc.save("salary_invoice.pdf");
});
