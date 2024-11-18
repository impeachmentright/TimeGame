// script.js

// Показать главный экран после загрузки
window.onload = () => {
    const loadingScreen = document.getElementById('loading-screen');
    const appContainer = document.getElementById('app-container');
  
    // Убрать экран загрузки через 3 секунды
    setTimeout(() => {
      loadingScreen.style.display = 'none'; // Скрываем экран загрузки
      appContainer.style.display = 'flex'; // Показываем основное приложение
    }, 3000);
  };
  
  // Основная логика приложения
  const stopwatch = document.getElementById("stopwatch");
  let seconds = 0;
  
  // Запуск секундомера
  function updateStopwatch() {
    seconds++;
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
  
    stopwatch.textContent = `${hrs}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }
  
  // Запуск таймера каждую секунду
  setInterval(updateStopwatch, 1000);
  
  // Добавить логику кнопок (пример)
  document.getElementById("time-btn").addEventListener("click", () => {
    alert("This is the Time section.");
  });
  
  document.getElementById("upgrade-btn").addEventListener("click", () => {
    alert("This is the Upgrade section.");
  });
  
  document.getElementById("earn-btn").addEventListener("click", () => {
    alert("This is the Earn section.");
  });
  
  document.getElementById("box-btn").addEventListener("click", () => {
    alert("This is the Box section.");
  });