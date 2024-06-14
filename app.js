// app.js
document.getElementById('reportForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let report = {
        date: document.getElementById('date').value,
        client: document.getElementById('client').value,
        technician: document.getElementById('technician').value,
        recommendations: document.getElementById('recommendations').value
    };
    addReport(report);
    document.getElementById('reportForm').reset();
});

function displayReports() {
    let transaction = db.transaction(["reports"], "readonly");
    let objectStore = transaction.objectStore("reports");
    let request = objectStore.getAll();

    request.onsuccess = function(event) {
        let reports = event.target.result;
        let reportsDiv = document.getElementById('reports');
        reportsDiv.innerHTML = '';
        reports.forEach(report => {
            let reportElement = document.createElement('div');
            reportElement.innerHTML = `
                <h3>Reporte ${report.id}</h3>
                <p>Fecha: ${report.date}</p>
                <p>Cliente: ${report.client}</p>
                <p>Técnico: ${report.technician}</p>
                <p>Recomendaciones: ${report.recommendations}</p>
            `;
            reportsDiv.appendChild(reportElement);
        });
    };
}
