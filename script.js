let teams = {
    team1: {
        goalkeeper: null,
        defender1: null,
        defender2: null,
        midfielder: null,
        forward1: null,
        forward2: null
    },
    team2: {
        goalkeeper: null,
        defender1: null,
        defender2: null,
        midfielder: null,
        forward1: null,
        forward2: null
    }
};

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

function addPlayer() {
    const team = document.getElementById('team-select').value;
    const name = document.getElementById('player-name').value;
    const price = document.getElementById('player-price').value;
    const position = document.getElementById('player-position').value;

    if (name && price && position) {
        teams[team][position] = { name, price, goals: 0, assists: 0, points: 0 };
        updateTeamDisplay(team);
        updatePlayerSelect();
        clearInputs();
    } else {
        alert('Please fill all fields');
    }
}

function updateTeamDisplay(team) {
    const formation = document.querySelector(`#${team} .formation`);
    formation.innerHTML = '';
    for (let position in teams[team]) {
        const player = teams[team][position];
        if (player) {
            const playerElement = document.createElement('div');
            playerElement.className = 'player';
            playerElement.textContent = `${player.name}\n£${player.price}m`;
            formation.appendChild(playerElement);
        }
    }
}

function updatePlayerSelect() {
    const updateTeam = document.getElementById('update-team');
    const updatePlayer = document.getElementById('update-player');
    updatePlayer.innerHTML = '<option value="">Select Player</option>';
    const team = teams[updateTeam.value];
    for (let position in team) {
        if (team[position]) {
            const option = document.createElement('option');
            option.value = position;
            option.textContent = team[position].name;
            updatePlayer.appendChild(option);
        }
    }
}

function addGoal() {
    const team = document.getElementById('update-team').value;
    const position = document.getElementById('update-player').value;
    if (position && teams[team][position]) {
        teams[team][position].goals++;
        teams[team][position].points += 5;
        updatePointsDisplay();
    }
}

function addAssist() {
    const team = document.getElementById('update-team').value;
    const position = document.getElementById('update-player').value;
    if (position && teams[team][position]) {
        teams[team][position].assists++;
        teams[team][position].points += 3;
        updatePointsDisplay();
    }
}

function updatePointsDisplay() {
    const pointsList = document.getElementById('points-list');
    pointsList.innerHTML = '';
    for (let team in teams) {
        const teamPoints = document.createElement('div');
        teamPoints.innerHTML = `<h3>${team}</h3>`;
        for (let position in teams[team]) {
            if (teams[team][position]) {
                const player = teams[team][position];
                teamPoints.innerHTML += `<p>${player.name}: ${player.points} points (Goals: ${player.goals}, Assists: ${player.assists})</p>`;
            }
        }
        pointsList.appendChild(teamPoints);
    }
}

function clearInputs() {
    document.getElementById('player-name').value = '';
    document.getElementById('player-price').value = '';
    document.getElementById('player-position').value = 'goalkeeper';
}

function openPointsModal() {
    document.getElementById('points-display').style.display = 'block';
    updatePointsDisplay();
}

function closePointsModal() {
    document.getElementById('points-display').style.display = 'none';
}

// Initial setup
updateTeamDisplay('team1');
updateTeamDisplay('team2');
updatePlayerSelect();

// Event listeners
document.getElementById('update-team').addEventListener('change', updatePlayerSelect);
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => showTab(btn.dataset.tab));
});