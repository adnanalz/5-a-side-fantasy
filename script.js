let currentUser = null;
let teams = {
    team1: {},
    team2: {}
};

// DOM Elements
const signInScreen = document.getElementById('sign-in-screen');
const mainScreen = document.getElementById('main-screen');
const signInForm = document.getElementById('sign-in-form');
const addPlayerForm = document.getElementById('add-player-form');
const performanceForm = document.getElementById('performance-form');
const pointsModal = document.getElementById('points-modal');
const pointsList = document.getElementById('points-list');

// Event Listeners
signInForm.addEventListener('submit', handleSignIn);
addPlayerForm.addEventListener('submit', handleAddPlayer);
document.getElementById('toggle-sign-up').addEventListener('click', toggleSignUp);
document.getElementById('sign-out').addEventListener('click', handleSignOut);
document.getElementById('points-btn').addEventListener('click', showPointsModal);
document.getElementById('close-modal').addEventListener('click', hidePointsModal);
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => showScreen(btn.dataset.screen));
});
document.getElementById('update-team').addEventListener('change', updatePlayerSelect);

function handleSignIn(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // Here you would typically validate credentials with a backend
    // For now, we'll just simulate a successful login
    currentUser = { email };
    signInScreen.classList.add('hidden');
    mainScreen.classList.remove('hidden');
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

function handleAddPlayer(e) {
    e.preventDefault();
    const team = document.getElementById('team-select').value;
    const name = document.getElementById('player-name').value;
    const price = document.getElementById('player-price').value;
    const position = document.getElementById('player-position').value;

    teams[team][position] = { name, price, goals: 0, assists: 0, points: 0 };
    updateTeamDisplay(team);
    updatePlayerSelect();
    e.target.reset();
    showScreen('teams');
}

function updateTeamDisplay(team) {
    const formation = document.querySelector(`#${team} .formation`);
    formation.innerHTML = '';
    for (let position in teams[team]) {
        const player = teams[team][position];
        const playerElement = document.createElement('div');
        playerElement.className = 'player';
        playerElement.textContent = `${player.name}\n£${player.price}m`;
        formation.appendChild(playerElement);
    }
}

function updatePlayerSelect() {
    const updateTeam = document.getElementById('update-team');
    const updatePlayer = document.getElementById('update-player');
    updatePlayer.innerHTML = '<option value="">Select Player</option>';
    const team = teams[updateTeam.value];
    for (let position in team) {
        const option = document.createElement('option');
        option.value = position;
        option.textContent = team[position].name;
        updatePlayer.appendChild(option);
    }
}

function addGoal() {
    updatePerformance('goals', 5);
}

function addAssist() {
    updatePerformance('assists', 3);
}

function updatePerformance(stat, points) {
    const team = document.getElementById('update-team').value;
    const position = document.getElementById('update-player').value;
    if (team && position) {
        teams[team][position][stat]++;
        teams[team][position].points += points;
        updatePointsDisplay();
    }
}

function updatePointsDisplay() {
    pointsList.innerHTML = '';
    for (let team in teams) {
        const teamPoints = document.createElement('div');
        teamPoints.innerHTML = `<h3>${team}</h3>`;
        for (let position in teams[team]) {
            const player = teams[team][position];
            teamPoints.innerHTML += `<p>${player.name}: ${player.points} points (Goals: ${player.goals}, Assists: ${player.assists})</p>`;
        }
        pointsList.appendChild(teamPoints);
    }
}

function showScreen(screenId) {
    document.querySelectorAll('.content-screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(`${screenId}-screen`).classList.remove('hidden');
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.nav-btn[data-screen="${screenId}"]`).classList.add('active');
}

function showPointsModal() {
    updatePointsDisplay();
    pointsModal.classList.remove('hidden');
}

function hidePointsModal() {
    pointsModal.classList.add('hidden');
}

// Initial setup
updateTeamDisplay('team1');
updateTeamDisplay('team2');