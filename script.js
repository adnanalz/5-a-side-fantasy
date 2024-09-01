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

let captain = { team: null, position: null };

function addPlayer() {
    const team = document.getElementById('team-select').value;
    const name = document.getElementById('player-name').value;
    const price = document.getElementById('player-price').value;
    const position = document.getElementById('player-position').value;

    if (name && price && position) {
        teams[team][position] = { name, price, goals: 0, assists: 0, points: 0 };
        updateTeamDisplay(team);
        updatePlayerSelect();
        populateCaptainSelect();
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

function populateCaptainSelect() {
    const captainSelect = document.getElementById('captain-select');
    captainSelect.innerHTML = '<option value="">Select Captain</option>';
    
    const team = document.getElementById('team-select').value;
    for (let position in teams[team]) {
        if (teams[team][position]) {
            const option = document.createElement('option');
            option.value = position;
            option.textContent = teams[team][position].name;
            captainSelect.appendChild(option);
        }
    }
}

function selectCaptain() {
    const position = document.getElementById('captain-select').value;
    if (position) {
        captain.team = document.getElementById('team-select').value;
        captain.position = position;
        alert(`${teams[captain.team][captain.position].name} is now the captain!`);
    } else {
        captain.team = null;
        captain.position = null;
    }
}

function addGoal() {
    const team = document.getElementById('update-team').value;
    const position = document.getElementById('update-player').value;
    if (position && teams[team][position]) {
        teams[team][position].goals++;
        let points = (position.includes('forward') ? 5 : 8);
        if (captain.team === team && captain.position === position) {
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
        if (captain.team === team && captain.position === position) {
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
document.getElementById('captain-select').addEventListener('change', selectCaptain);
document.getElementById('update-team').addEventListener('change', updatePlayerSelect);

// Initial setup
updateTeamDisplay('team1');
updateTeamDisplay('team2');
updatePlayerSelect();
updatePointsDisplay();

// Firebase configuration
const firebaseConfig = {
    // Your Firebase config object goes here
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Get references to auth and firestore
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  let currentUser = null;
  
  function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Logged in successfully
        currentUser = userCredential.user;
        console.log("Logged in as:", currentUser.email);
        showApp();
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert("Login failed: " + error.message);
      });
  }
  
  function signup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed up successfully
        currentUser = userCredential.user;
        console.log("Signed up as:", currentUser.email);
        showApp();
      })
      .catch((error) => {
        console.error("Signup error:", error);
        alert("Signup failed: " + error.message);
      });
  }
  
  function logout() {
    auth.signOut().then(() => {
      currentUser = null;
      console.log("Logged out");
      hideApp();
    }).catch((error) => {
      console.error("Logout error:", error);
    });
  }
  
  function showApp() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('logout-container').style.display = 'block';
    document.querySelector('.container').style.display = 'block';
    loadUserData();
  }
  
  function hideApp() {
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('logout-container').style.display = 'none';
    document.querySelector('.container').style.display = 'none';
  }
  
  // Check if user is already logged in
  auth.onAuthStateChanged((user) => {
    if (user) {
      currentUser = user;
      showApp();
    } else {
      hideApp();
    }
  });
  
  // Modify your existing functions to work with Firebase
  
  function addPlayer() {
    if (!currentUser) return;
  
    const team = document.getElementById('team-select').value;
    const name = document.getElementById('player-name').value;
    const price = document.getElementById('player-price').value;
    const position = document.getElementById('player-position').value;
  
    if (name && price && position) {
      db.collection('users').doc(currentUser.uid).collection('teams').doc(team).set({
        [position]: { name, price, goals: 0, assists: 0, points: 0 }
      }, { merge: true })
      .then(() => {
        console.log("Player added successfully");
        updateTeamDisplay(team);
        updatePlayerSelect();
        populateCaptainSelect();
        clearInputs();
      })
      .catch((error) => {
        console.error("Error adding player: ", error);
      });
    } else {
      alert('Please fill all fields');
    }
  }
  
  function loadUserData() {
    if (!currentUser) return;
  
    db.collection('users').doc(currentUser.uid).collection('teams').get()
      .then((querySnapshot) => {
        teams = { team1: {}, team2: {} };
        querySnapshot.forEach((doc) => {
          teams[doc.id] = doc.data();
        });
        updateTeamDisplay('team1');
        updateTeamDisplay('team2');
        updatePlayerSelect();
        updatePointsDisplay();
      })
      .catch((error) => {
        console.error("Error loading user data: ", error);
      });
  }
  
  // Update other functions (updateTeamDisplay, addGoal, addAssist, etc.) to use Firebase
  // Instead of directly modifying the 'teams' object, update the database and then refresh the display