document.addEventListener('DOMContentLoaded', () => {
    const ball = document.querySelector('.ball img');
    const blocks = document.querySelectorAll('.block');
    let directionX = 0;
    let directionY = 0;
    const speed = 1000; // Adjust the speed as needed
    let isMoving = false;
    let originalImgSrc = ball.src;
    let startTime = null; // Variable to store start time
    let isGameOver = false; // Variable to track game over state

    // Stopwatch element
    const stopwatch = document.getElementById('stopwatch');

    const soundEffect = new Audio('Retro Game Coin Sound Effect.mp3');
    const startSoundTime = 0.5;
    soundEffect.currentTime = startSoundTime;

    const moveBall = () => {
        const ballRect = ball.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Check if the ball has reached the end of the screen
        if (ballRect.left <= 0 || ballRect.right >= screenWidth || ballRect.top <= 0 || ballRect.bottom >= screenHeight) {
            // Reset ball position
            resetBallPosition();
            return; // Stop the animation
        }

        ball.style.left = `${ballRect.left + directionX}px`;
        ball.style.top = `${ballRect.top + directionY}px`;

        // Check for collision with blocks
        blocks.forEach(block => {
            const blockRect = block.getBoundingClientRect();
            if (
                ballRect.left < blockRect.right &&
                ballRect.right > blockRect.left &&
                ballRect.top < blockRect.bottom &&
                ballRect.bottom > blockRect.top
            ) {

                block.remove();
                soundEffect.currentTime = startSoundTime;
                soundEffect.play();
                resetBallPosition();
                document.body.style.backgroundColor = block.style.backgroundColor;
                ball.src = "images/new-moon.png";
                setTimeout(() => {
                    ball.src = originalImgSrc;
                }, 50);
                resetBallPosition();
            }
        });

        // Check if all blocks are removed
        if (document.querySelectorAll('.block').length === 0) {
            isMoving = false;
            showGameOverDialog();
            if (!isGameOver) {
                const endTime = new Date().getTime();
                const elapsedTime = (endTime - startTime) / 1000; // Convert to seconds
                document.getElementById('timeCompleted').textContent = `Time completed: ${elapsedTime.toFixed(2)} seconds`;
                isGameOver = true;
            }
            // Hide the stopwatch when the game is over
            stopwatch.classList.add('hidden');
            return;
        }

        // Keep the animation going
        if (isMoving) {
            requestAnimationFrame(moveBall);
        }
    };

    const resetBallPosition = () => {
        ball.style.left = '50%';
        ball.style.top = '90%';
        directionX = 0;
        directionY = 0;
        isMoving = false;
    };


    const showGameOverDialog = () => {
        gameOverDialog.style.display = 'block';
    };

    const hideGameOverDialog = () => {
        gameOverDialog.style.display = 'none';
    };

    const resetGame = () => {
        // Reset game state
        isGameOver = false;
        // Show the stopwatch
        stopwatch.classList.remove('hidden');
        // Reload the page
        location.reload();
    };

    startText.addEventListener('click', () => {
        startText.style.display = 'none';

        // Show the stopwatch when the game starts
        stopwatch.classList.remove('hidden');

        // Start the stopwatch only if it's not already started
        if (!startTime) {

        // Start the stopwatch
            startTime = new Date().getTime();
        }

        document.addEventListener('click', (event) => {
            const ballRect = ball.getBoundingClientRect();
            const ballCenterX = ballRect.left + ballRect.width / 2;
            const ballCenterY = ballRect.top + ballRect.height / 2;

            const deltaX = event.clientX - ballCenterX;
            const deltaY = event.clientY - ballCenterY;

            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Normalize the direction vector
            directionX = (deltaX / distance) * speed;
            directionY = (deltaY / distance) * speed;

            // Start the ball moving
            isMoving = true;
            moveBall();
        });
    });
    
    playAgainBtn.addEventListener('click', () => {
    // Hide the game over dialog
    hideGameOverDialog();
    // Reset the game
    resetGame();
});

    // Stopwatch function
    const updateStopwatch = () => {
        if (startTime && !isGameOver) {
            const currentTime = new Date().getTime();
            const elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds
            stopwatch.textContent = `${elapsedTime.toFixed(2)}`;
        } else {
            // If the game is over, stop updating the stopwatch
            clearInterval(stopwatchInterval);
        }
    };

    // Update stopwatch every 10 milliseconds
    setInterval(updateStopwatch, 10);
});
