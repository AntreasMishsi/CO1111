class Leaderboard {

    constructor() {
        this.allPlayers = [];
        this.session = localStorage.getItem("session");

        this.init();
    }

    init() {
        this.loadLeaderboard();
        setInterval(() => this.loadLeaderboard(), 10000);
    }

    async loadLeaderboard() {

        if (!this.session) {
            alert("No active session found.");
            return;
        }

        const response = await fetch(
            `https://codecyprus.org/th/api/leaderboard?session=${this.session}`
        );

        const data = await response.json();

        if (data.status === "OK") {
            this.allPlayers = data.leaderboard;
            this.showTable(this.allPlayers);
        } else {
            alert(data.errorMessages?.[0] || "Error loading leaderboard");
        }
    }

    showTable(players) {

        let html = "<table>";
        html += "<tr><th>Rank</th><th>Player</th><th>Score</th><th>Time</th></tr>";

        players.forEach((player, index) => {

            let rank = index + 1;

            if (index === 0) rank = "🥇";
            else if (index === 1) rank = "🥈";
            else if (index === 2) rank = "🥉";

            html += "<tr>";
            html += "<td>" + rank + "</td>";
            html += "<td>" + player.player + "</td>";
            html += "<td>" + player.score + "</td>";
            html += "<td>" + this.convertTime(player.completionTime) + "</td>";
            html += "</tr>";
        });

        html += "</table>";

        document.getElementById("leaderboard").innerHTML = html;
    }

    convertTime(ms) {
        if (!ms) return "-";

        let seconds = Math.floor(ms / 1000);
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = seconds % 60;

        return minutes + "m " + remainingSeconds + "s";
    }

    searchPlayer(text) {
        const filtered = this.allPlayers.filter(p =>
            p.player.toLowerCase().includes(text.toLowerCase())
        );

        this.showTable(filtered);
    }

    toggleDark() {
        document.body.classList.toggle("dark");
    }
}

// Create object when page loads
const leaderboard = new Leaderboard();