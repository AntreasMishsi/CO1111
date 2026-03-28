
let containerEl = null;
let totalDots = 0;
//initializes the progress dots by creating dot elements inside the container
export function initDots(containerId, total = 6) {
    totalDots = total;
    containerEl = document.getElementById(containerId);
    //if the container doesnt exist to stop
    if (!containerEl) {
        console.warn(`progress-dots: #${containerId} not found in the DOM`);
        return;
    }
    // set accessibility attributes so screen readers understand this progress by the dots
    containerEl.innerHTML = '';
    containerEl.setAttribute('role', 'progressbar');
    containerEl.setAttribute('aria-valuemin', '1');
    containerEl.setAttribute('aria-valuemax', String(total));

    //create one dot for each question
    for (let i = 1; i <= total; i++) {
        const dot = document.createElement('span');//span represent the dot
        dot.classList.add('progress-dot');// for css
        dot.dataset.step = i;// store the question number on the dot so we can read it later
        dot.setAttribute('aria-label', `Question ${i}`);//accessibility for screen readers
        containerEl.appendChild(dot);// adding dot to container
    }
    // highlight first dot
    setActiveDot(1);
}
//Marks a specific dot as active and all previous dots as completed.
export function setActiveDot(step) {
    if (!containerEl) return;

    const dots = containerEl.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {  //loop through every dot and assign the correct state
        const dotStep = index + 1;
        dot.classList.remove('active', 'completed');
        if (dotStep < step)   dot.classList.add('completed');//if this dot is before the current step, mark it as completed
        if (dotStep === step) dot.classList.add('active');//if this dot matches the current step, mark it as active
    });
    // Update the eria attribute so screen readers know the current position
    containerEl.setAttribute('aria-valuenow', String(step));

    //Find the question label element and update its text
    const label = document.getElementById('question-label');
    if (label) label.textContent = `Question ${step} of ${totalDots}`;
}
// updates the score label on the page.
export function updateScore(score) {
    const label = document.getElementById('score-label');
    if (label) label.textContent = `Score: ${score}`;
}
// advances the active dot to the next question.
export function nextDot() {
    if (!containerEl) return;
    const current = getCurrentStep();
    const next = Math.min(current + 1, totalDots);
    setActiveDot(next);
    return next;
}
// returns the currently active step number
export function getCurrentStep() {
    if (!containerEl) return 1;
    const active = containerEl.querySelector('.progress-dot.active');
    return active ? parseInt(active.dataset.step, 10) : 1;
}