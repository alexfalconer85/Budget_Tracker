const request = window.indexedDB.open("pending", 1);
let db;
request.onupgradeneeded = ({
    target
}) => {
    let db = target.result;
    db.createObjectStore("pending", {
        autoIncrement: true
    });
    // objectStore.createIndex("name", "name");
    // objectStore.createIndex("value", "value");
    // objectStore.createIndex("date", "date");

};

request.onsuccess = ({
    target
}) => {
    console.log(request.result);
    db = target.result
    if (navigator.onLine) {
        checkDatabase();
    }
};

// Add a item to database (function to be called whenever you click the add button)
function saveRecord(data) {

    const transaction = db.transaction(["pending"], "readwrite");
    const transactionStore = transaction.objectStore("pending");
    transactionStore.add(data)
}

function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();
    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                    method: "POST",
                    body: JSON.stringify(getAll.result),
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json"
                    }
                })
                .then(response => {
                    return response.json();
                })
                .then(() => {
                    // delete records if successful
                    const transaction = db.transaction(["pending"], "readwrite");
                    const store = transaction.objectStore("pending");
                    store.clear();
                });

        }
    }
};

// Get ALL in database ()
// function getAll() {
//     const transaction = db.transaction(["budget"], "readwrite");
//     const transactionStore = transaction.objectStore("budget");
//     transactionStore.getAll();
//     //test getAllTransaction .onsuccess
// }
// adde event listender when the page comes back online
window.addEventListener("online", checkDatabase)