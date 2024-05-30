document.addEventListener('DOMContentLoaded', () => {
    const ball = document.querySelector('.ball img');
    const blocks = document.querySelectorAll('.block');
    let directionX = 0;
    let directionY = 0;
    const speed = 1000; // Adjust the speed as needed
    let isMoving = false;
    let originalImgSrc = ball.src;

    const soundEffect = new Audio('Retro Game Coin Sound Effect.mp3');
    const startTime = 0.5;
    soundEffect.currentTime = startTime;

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
                // If collision detected, remove the block
                block.remove();
                soundEffect.currentTime = startTime;
                soundEffect.play();
                resetBallPosition();
                document.body.style.backgroundColor = block.style.backgroundColor;
                ball.src = "images/new-moon.png"; // Change ball image source
                setTimeout(() => {
                    ball.src = originalImgSrc; // Revert back to original image source after 500ms
                }, 50);
                resetBallPosition();
            }
        });

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
