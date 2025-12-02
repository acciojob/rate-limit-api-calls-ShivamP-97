//your JS code here. If required.
const fetchButton = document.getElementById("fetch-button");
const clickCountDisplay = document.getElementById("click-count");
const resultsDiv = document.getElementById("results");

const MAX_CALLS = 5;
const WINDOW_TIME = 10000; 

let callCount = 0;
let queue = [];
let isWindowActive = false;

function startWindow() {
    isWindowActive = true;
    callCount = 0;
    clickCountDisplay.textContent = callCount;

    setTimeout(() => {
        isWindowActive = false;
        callCount = 0;
        clickCountDisplay.textContent = 0;

        processQueue();
    }, WINDOW_TIME);
}

function processQueue() {
    while (queue.length > 0 && callCount < MAX_CALLS) {
        const resolve = queue.shift();
        makeApiCall(resolve);
    }

    if (queue.length > 0) {
        alert("Too many API calls. Please wait and try again.");
    }
}

function makeApiCall(resolve) {
    callCount++;
    clickCountDisplay.textContent = callCount;

    fetch("https://jsonplaceholder.typicode.com/todos/1")
        .then(response => response.json())
        .then(data => {
			const el = document.createElement("div");
			el.textContent = `ID: ${data.id}, Title: ${data.title}, Completed: ${data.completed}`;
			resultsDiv.appendChild(el);
			
			resolve();
        })
        .catch(err => {
            console.error(err);
            resolve();
        });
}

function rateLimitedFetch() {
    return new Promise((resolve) => {
        if (!isWindowActive) {
            startWindow();
        }

        if (callCount < MAX_CALLS) {
            makeApiCall(resolve);
        } else {
            queue.push(resolve);
        }
    });
}

fetchButton.addEventListener("click", () => {
    clickCountDisplay.textContent = Number(clickCountDisplay.textContent) + 1;

    rateLimitedFetch();
});
