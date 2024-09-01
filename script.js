let currentUser = null;
let teams = {
    team1: {
        forward: null,
        midfielder: null,
        defender1: null,
        defender2: null,
        goalkeeper: null
    },
    team2: {
        forward: null,
        midfielder: null,
        defender1: null,
        defender2: null,
        goalkeeper: null
    }
};
let captains = { team1: null, team2: null };

// DOM Elements
const signInScreen = document.getElementById('sign-in-screen');
const mainScreen = document.getElementById('main-screen');
const signInForm = document.getElementById('sign-in-form');
const signOutButton = document.getElementById('sign-out');
const addPlayerButton = document.getElementById('add-player');
const addGoalButton = document.getElementById('add-goal');
const addAssistButton = document.getElementById('add-assist');
const captainSelect1 = document.getElementById('captain-select-team1');
const captainSelect2 = document.getElementById('captain-select-team2');

// Event Listeners
signInForm.addEventListener('submit', handleSignIn);
document.getElementById('toggle-sign-up').addEventListener('click', toggleSignUp);
signOutButton.addEventListener('click', handleSignOut);
addPlayerButton.addEventListener('click', addPlayer);
addGoalButton.addEventListener('click', () => updatePerformance('goals'));
addAssistButton.addEventListener('click', () => updatePerformance('assists'));
captainSelect1.addEventListener('change', () => selectCaptain('team1'));
captainSelect2.addEventListener('change', () => selectCaptain('team2'));
document.getElementById('update-team').addEventListener('change', updatePlayerSelect);

function handleSignIn(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (email && password) {
        currentUser = { email };
        signInScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');
    } else {
        alert('Please enter both email and password');
    }
}

function toggleSignUp(e) {
    e.preventDefault();
    const isSignUp = signInForm.querySelector('button').textContent === 'Sign In';
    signInForm.querySelector('button').textContent = isSignUp ? 'Sign Up' : 'Sign In';
    document.querySelector('#sign-in-screen h1').textContent = isSignUp ? 'Sign Up' : 'Sign In';
    document.querySelector('#sign-in-screen p').innerHTML = isSignUp 
        ? 'Already have an account? <a href="#" id="toggle-sign-up">Sign In</a>'
        : 'Don\'t have an account? <a href="#" id="toggle-sign-up">Sign Up</a>';
    document.getElementById('toggle-sign-up').addEventListener('click', toggleSignUp);
}

function handleSignOut() {
    currentUser = null;
    mainScreen.classList.add('hidden');
    signInScreen.classList.remove('hidden');
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
        updateCaptainSelect('team1');
        updateCaptainSelect('team2');
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
            player.textContent = position.toUpperCase();
        }
    }
}

function updatePlayerSelect() {
    const updateTeam = document.getElementById('update-team').value;
    const updatePlayer = document.getElementById('update-player');
    updatePlayer.innerHTML = '<option value="">Select Player</option>';
    for (let position in teams[updateTeam]) {
        if (teams[updateTeam][position]) {
            const option = document.createElement('option');
            option.value = position;
            option.textContent = teams[updateTeam][position].name;
            updatePlayer.appendChild(option);
        }
    }
}

function updateCaptainSelect(team) {
    const captainSelect = document.getElementById(`captain-select-${team}`);
    captainSelect.innerHTML = '<option value="">Select Captain</option>';
    for (let position in teams[team]) {
        if (teams[team][position]) {
            const option = document.createElement('option');
            option.value = position;
            option.textContent = teams[team][position].name;
            captainSelect.appendChild(option);
        }
    }
}

function selectCaptain(team) {
    const captainSelect = document.getElementById(`captain-select-${team}`);
    captains[team] = captainSelect.value;
    console.log(`Captain for ${team} set to ${captains[team]}`);
}

function updatePerformance(stat) {
    const team = document.getElementById('update-team').value;
    const position = document.getElementById('update-player').value;
    if (position && teams[team][position]) {
        teams[team][position][stat]++;
        let points = stat === 'goals' ? (position === 'forward' ? 5 : 8) : 3;
        if (captains[team] === position) {
            points *= 2;
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
    document.getElementById('player-position').value = 'forward';
}