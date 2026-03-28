import { OpenScanner, CloseScanner, ChangeCamera } from '../Utils/Scanner.js';
import { app } from './App.js';

document.getElementById('scan-btn').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('camera-modal').style.display = 'flex';
    OpenScanner();
});

document.getElementById('close-camera-button').addEventListener('click', () => {
    document.getElementById('camera-modal').style.display = 'none';
    CloseScanner();
});

document.getElementById('change-camera-button').addEventListener('click', () => {
    ChangeCamera();
});

document.getElementById('leaderboard-btn').addEventListener('click', (e) => {
    e.preventDefault();
    const modal = document.getElementById('leaderboard-modal');
    const body = document.getElementById('leaderboard-modal-body');
    modal.style.display = 'flex';

    fetch(`https://codecyprus.org/th/api/leaderboard?session=${app.session}&sorted`)
        .then(r => r.json())
        .then(data => {
            body.innerHTML = `
                <table class="lb-modal-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Player</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.leaderboard.map((p, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${p.player}</td>
                                <td>${p.score} pts</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        });
});

document.getElementById('close-leaderboard-button').addEventListener('click', () => {
    document.getElementById('leaderboard-modal').style.display = 'none';
});