document.addEventListener('DOMContentLoaded', () => {

    const prizeImage = document.getElementById('prize-image');

    const totalWinnerImages = 1;
    const winChance = 0.3;

    const isWinner = Math.random() < winChance;

    if (isWinner) {
        const randomNum = Math.floor(Math.random() * totalWinnerImages) + 1;
        prizeImage.src = `winner${randomNum}.jpg`;
        console.log(`Game Loaded: Winner #${randomNum}`);
    } else {
        prizeImage.src = 'loss.jpg';
        console.log("Game Loaded: Loss");
    }

    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

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

        ctx.font = "bold 30px Arial";
        ctx.fillStyle = "#555";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("", canvas.width / 2, canvas.height / 2);

        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 40;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }

    function getPosition(e) {
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if (e.type.includes('touch')) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    function draw(e) {
        if (!isDrawing) return;
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
        lastX = pos.x;
        lastY = pos.y;
        draw(e);
    });

    window.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mousemove', draw);

    canvas.addEventListener('touchstart', e => {
        isDrawing = true;
        const pos = getPosition(e);
        lastX = pos.x;
        lastY = pos.y;
        draw(e);
    }, { passive: false });

    window.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('touchmove', draw, { passive: false });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initCanvas, 100);
    });

    initCanvas();
});