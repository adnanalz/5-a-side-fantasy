let isSignUp = false;

function signIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (email && password) {
        // Here you would typically send these credentials to a server
        // For now, we'll just simulate a successful sign-in
        document.getElementById('auth-container').style.display = 'none';
        document.querySelector('.container').style.display = 'block';
    } else {
        alert('Please enter both email and password');
    }
}

function toggleAuth() {
    isSignUp = !isSignUp;
    const authTitle = document.querySelector('#auth-container h2');
    const authButton = document.querySelector('#auth-container button');
    const authToggle = document.querySelector('#auth-container p');
    
    if (isSignUp) {
        authTitle.textContent = 'Sign Up';
        authButton.textContent = 'Sign Up';
        authToggle.innerHTML = 'Already have an account? <a href="#" onclick="toggleAuth()">Sign In</a>';
    } else {
        authTitle.textContent = 'Sign In';
        authButton.textContent = 'Sign In';
        authToggle.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleAuth()">Sign Up</a>';
    }
}
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

let captains = {
    team1: null,
    team2: null
};

function addPlayer() {
    const team = document.getElementById('team-select').value;
    const name = document.getElementById('player-name').value;
    const price = document.getElementById('player-price').value;
    const position = document.getElementById('player-position').value;

    if (name && price && position) {
        teams[team][position] = { name, price, goals: 0, assists: 0, points: 0 };
        updateTeamDisplay(team);
        updatePlayerSelect();
        updateCaptainSelect();
        clearInputs();
    } else {
        alert('Please fill all fields');
    }
}

function updateTeamDisplay(team) {
    const teamElement = document.getElementById(team);
    const players = teamElement.getElementsByClassName('player');
    for (let player of players) {
        const position = player.dataset.position;
        if (teams[team][position]) {
            player.textContent = `${teams[team][position].name}\n£${teams[team][position].price}m`;
        } else {
            player.textContent = position;
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

function updateCaptainSelect() {
    const teamSelect = document.getElementById('team-select');
    const captainSelect = document.getElementById('captain-select');
    captainSelect.innerHTML = '<option value="">Select Captain</option>';
    const team = teams[teamSelect.value];
    for (let position in team) {
        if (team[position]) {
            const option = document.createElement('option');
            option.value = position;
            option.textContent = team[position].name;
            captainSelect.appendChild(option);
        }
    }
}

function selectCaptain() {
    const team = document.getElementById('team-select').value;
    const position = document.getElementById('captain-select').value;
    if (position) {
        captains[team] = position;
        alert(`${teams[team][position].name} is now the captain of ${team}!`);
    } else {
        alert('Please select a player to be captain');
    }
}

function addGoal() {
    const team = document.getElementById('update-team').value;
    const position = document.getElementById('update-player').value;
    if (position && teams[team][position]) {
        teams[team][position].goals++;
        let points = (position.includes('forward') ? 5 : 8);
        if (captains[team] === position) {
            points *= 2; // Double points for captain
        }
        teams[team][position].points += points;
        updatePointsDisplay();
    }
}

function addAssist() {
    const team = document.getElementById('update-team').value;
    const position = document.getElementById('update-player').value;
    if (position && teams[team][position]) {
        teams[team][position].assists++;
        let points = 4;
        if (captains[team] === position) {
            points *= 2; // Double points for captain
        }
        teams[team][position].points += points;
        updatePointsDisplay();
    }
}

function updatePointsDisplay() {
    const pointsList = document.getElementById('points-list');
    pointsList.innerHTML = '';
    for (let team in teams) {
        const teamPoints = document.createElement('div');
        teamPoints.className = 'team-points';
        teamPoints.innerHTML = `<h3>${team.charAt(0).toUpperCase() + team.slice(1)}</h3>`;
        for (let position in teams[team]) {
            if (teams[team][position]) {
                const player = teams[team][position];
                const playerPoints = document.createElement('div');
                playerPoints.className = 'player-points';
                playerPoints.textContent = `${player.name}: ${player.points} points (Goals: ${player.goals}, Assists: ${player.assists})`;
                teamPoints.appendChild(playerPoints);
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

// Event Listeners
document.getElementById('team-select').addEventListener('change', updateCaptainSelect);
document.getElementById('update-team').addEventListener('change', updatePlayerSelect);

// Initial setup
updateTeamDisplay('team1');
updateTeamDisplay('team2');
updatePlayerSelect();
updateCaptainSelect();
updatePointsDisplay();