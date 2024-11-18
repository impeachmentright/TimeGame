// script.js

// Show the main screen after loading
window.onload = () => {
    const loadingScreen = document.getElementById('loading-screen');
    const appContainer = document.getElementById('app-container');
  
    // Hide loading screen after 3 seconds
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      appContainer.style.display = 'flex';
    }, 3000);
  };
  
  // Variables
  let seconds = 0;
  let miningInterval = null;
  let miningSpeed = 1; // Initial mining speed multiplier
  
  // Elements
  const stopwatch = document.getElementById("stopwatch");
  const startButton = document.getElementById("start-button");
  
  // Start the stopwatch
  function updateStopwatch() {
    seconds += miningSpeed;
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
  
    stopwatch.textContent = `${hrs}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }
  
  // Start button event listener
  startButton.addEventListener("click", () => {
    if (!miningInterval) {
      miningInterval = setInterval(updateStopwatch, 1000);
      startButton.disabled = true;
      startButton.classList.remove('green-button');
      startButton.classList.add('gray-button');
    }
  });
  
  // Navigation buttons
  document.getElementById("mine-btn").addEventListener("click", showMainScreen);
  document.getElementById("upgrade-btn").addEventListener("click", showUpgradeScreen);
  document.getElementById("friends-btn").addEventListener("click", showFriendsScreen);
  document.getElementById("earn-btn").addEventListener("click", showEarnScreen);
  
  // Screen display functions
  function showMainScreen() {
    hideAllScreens();
    document.getElementById('main-screen').style.display = 'flex';
  }
  
  function showUpgradeScreen() {
    hideAllScreens();
    document.getElementById('upgrade-screen').style.display = 'flex';
  }
  
  function showFriendsScreen() {
    hideAllScreens();
    document.getElementById('friends-screen').style.display = 'flex';
  }
  
  function showEarnScreen() {
    hideAllScreens();
    document.getElementById('earn-screen').style.display = 'flex';
  }
  
  function hideAllScreens() {
    document.getElementById('main-screen').style.display = 'none';
    document.getElementById('upgrade-screen').style.display = 'none';
    document.getElementById('friends-screen').style.display = 'none';
    document.getElementById('earn-screen').style.display = 'none';
  }
  // Upgrade variables
let upgradeLevels = [1.15, 1.3, 1.5, 2, 4];
let currentUpgradeIndex = 0;

// Elements
const currentSpeedDisplay = document.getElementById('current-speed');
const upgradeButton = document.getElementById('upgrade-button');
const backFromUpgradeButton = document.getElementById('back-from-upgrade');

// Update current speed display
function updateCurrentSpeedDisplay() {
  currentSpeedDisplay.textContent = miningSpeed.toFixed(2);
}

// Upgrade button event listener
upgradeButton.addEventListener('click', () => {
  if (currentUpgradeIndex < upgradeLevels.length) {
    // Here you should implement the cost deduction logic
    // For now, we'll just upgrade without cost
    miningSpeed = upgradeLevels[currentUpgradeIndex];
    currentUpgradeIndex++;
    updateCurrentSpeedDisplay();
  } else {
    alert('Maximum upgrade level reached.');
  }
});

// Back button event listener
backFromUpgradeButton.addEventListener('click', showMainScreen);
// Elements
const referralLinkInput = document.getElementById('referral-link');
const copyLinkButton = document.getElementById('copy-link-button');
const backFromFriendsButton = document.getElementById('back-from-friends');

// Generate referral link (replace with actual logic)
function generateReferralLink() {
  const userId = 'USER_ID'; // Replace with actual user ID
  return `https://t.me/YourBotName?start=${userId}`;
}

// Show referral link when screen is displayed
function showFriendsScreen() {
  hideAllScreens();
  document.getElementById('friends-screen').style.display = 'flex';
  referralLinkInput.value = generateReferralLink();
}

// Copy referral link to clipboard
copyLinkButton.addEventListener('click', () => {
  referralLinkInput.select();
  document.execCommand('copy');
  alert('Referral link copied to clipboard.');
});

// Back button event listener
backFromFriendsButton.addEventListener('click', showMainScreen);
// Elements
const backFromEarnButton = document.getElementById('back-from-earn');
const taskButtons = document.querySelectorAll('.task-button');

// Back button event listener
backFromEarnButton.addEventListener('click', showMainScreen);

// Task buttons event listeners
taskButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const task = e.target.getAttribute('data-task');
    // Implement task logic based on the task type
    if (task === 'subscribe') {
      // Open Telegram channel link
      window.open('https://t.me/YourChannelName', '_blank');
      // After verification, reward the user
    } else if (task === 'watch-ad') {
      // Show an ad (you'll need an ad provider)
      // After the ad, reward the user
    }
    alert('Task completed! You have earned rewards.');
  });
});