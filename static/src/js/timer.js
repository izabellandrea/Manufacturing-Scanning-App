function startTimer() {
  LottieInteractivity.create({
    mode: 'chain',
    player: '#gears',
    loop: true,
    actions: [
      {
          state: 'autoplay',
          transition: 'repeat',
          repeat: 2
      }
  ]
  });
}

// Pause the timer
function pauseTimer() {
  LottieInteractivity.create({
    mode: 'chain',
    player: '#gears',
    actions: [
      {
          state: 'none'
      }
  ]
  });
}

