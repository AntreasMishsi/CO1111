export const RENDERED_AREA_ID = 'rendered-area';


export function ClearRenderer() {
    const container = document.getElementById(RENDERED_AREA_ID);
    container.innerHTML = '';
}