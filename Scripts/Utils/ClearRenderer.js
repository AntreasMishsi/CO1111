

// ID of the container holding all HTML elements that change across stages
export const RENDERED_AREA_ID = 'rendered-area';

// cleans the container
export function ClearRenderer() {
    const container = document.getElementById(RENDERED_AREA_ID);
    container.innerHTML = '';
}