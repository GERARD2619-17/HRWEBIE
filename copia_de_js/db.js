// db.js
let db;

window.onload = function() {
    let request = window.indexedDB.open("serviceReportsDB", 1);

    request.onerror = function(event) {
        console.log("Error opening DB", event);
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        console.log("DB opened");
        displayReports();
    };

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        let objectStore = db.createObjectStore("reports", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("date", "date", { unique: false });
        objectStore.createIndex("client", "client", { unique: false });
        console.log("DB setup complete");
    };
};

function addReport(report) {
    let transaction = db.transaction(["reports"], "readwrite");
    let objectStore = transaction.objectStore("reports");
    let request = objectStore.add(report);

    request.onsuccess = function(event) {
        console.log("Report added", event);
        displayReports();
    };

    request.onerror = function(event) {
        console.log("Error adding report", event);
    };
}
