document.addEventListener('DOMContentLoaded', () => {

    const prizeImage = document.getElementById('prize-image');
    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const resultCode = 1; 

    // Logic to set the image based on the variable
    if (resultCode === 1) {
        // Winning scenario
        prizeImage.src = 'winner.jpg';
    } else if (resultCode === 2) {
        // Try again scenario
        prizeImage.src = 'onemorechance.jpg';
    } else {
        // Loss scenario (Default for 3 or any other number)
        prizeImage.src = 'loss.jpg'; 
    }

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let isFinished = false;
    let actionTriggered = false;

    function initCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#999');
        gradient.addColorStop(0.2, '#fff');
        gradient.addColorStop(0.4, '#ccc');
        gradient.addColorStop(0.6, '#eee');
        gradient.addColorStop(0.8, '#999');
        gradient.addColorStop(1, '#ddd');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 75;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }

    /* C# Backend function */
    function functionAfterScratch() {
        if (actionTriggered) return;
        actionTriggered = true;

        // Log the result code instead of the attempt number
        console.log("3 seconds passed. Result processed for code: " + resultCode);
    }

    function finishGame() {
        isFinished = true;
        canvas.style.transition = "opacity 0.8s ease-out";
        canvas.style.opacity = "0";
        canvas.style.pointerEvents = "none";

        setTimeout(() => {
            functionAfterScratch();
        }, 3000);
    }

    function checkScratchPercentage() {
        if (isFinished) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let clearPixels = 0;

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) clearPixels++;
        }

        const percentage = (clearPixels / (pixels.length / 4)) * 100;

        if (percentage > 45) {
            finishGame();
        }
    }

    function getPosition(e) {
        const rect = canvas.getBoundingClientRect();
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let clientY = e.touches ? e.touches[0].clientY : e.clientY;

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    function draw(e) {
        if (!isDrawing || isFinished) return;
        if (e.cancelable) e.preventDefault();

        const { x, y } = getPosition(e);

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
        ctx.fill();

        lastX = x;
        lastY = y;
    }

    canvas.addEventListener('mousedown', e => {
        isDrawing = true;
        const pos = getPosition(e);
        lastX = pos.x; lastY = pos.y;
        draw(e);
    });

    window.addEventListener('mouseup', () => {
        if (isDrawing) {
            isDrawing = false;
            checkScratchPercentage();
        }
    });

    canvas.addEventListener('mousemove', draw);

    canvas.addEventListener('touchstart', e => {
        isDrawing = true;
        const pos = getPosition(e);
        lastX = pos.x; lastY = pos.y;
        draw(e);
    }, { passive: false });

    window.addEventListener('touchend', () => {
        if (isDrawing) {
            isDrawing = false;
            checkScratchPercentage();
        }
    });

    canvas.addEventListener('touchmove', draw, { passive: false });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initCanvas, 100);
    });

    initCanvas();
});