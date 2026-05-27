const greetingInput = document.getElementById("greetingInput");
const greeting = document.getElementById("greeting");
const subGreetingInput = document.getElementById("subGreetingInput");
const subGreeting = document.getElementById("subGreeting");

export function initGreetingListeners() {
    greetingInput.addEventListener('input', e => {
        greeting.textContent = e.target.value;
        greetingInput.value = e.target.value;
        localStorage.setItem("greeting", e.target.value);
    });

    subGreetingInput.addEventListener('input', e => {
        subGreeting.textContent = e.target.value;
        subGreetingInput.value = e.target.value;
        localStorage.setItem("subGreeting", e.target.value);
    });
}


export function loadGreeting() {
    let greeting = localStorage.getItem("greeting");
    let subGreeting = localStorage.getItem("subGreeting");
    if (greeting) {
        document.getElementById("greeting").textContent = greeting;
        document.getElementById("greetingInput").value = greeting;
    }
    if (subGreeting) {
        document.getElementById("subGreeting").textContent = subGreeting;
        document.getElementById("subGreetingInput").value = subGreeting;
    }
}