// Drawing on the canvas
const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});
canvas.addEventListener('mousemove', (e) => {
    if (drawing) {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
});
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseleave', () => drawing = false);

document.getElementById('clearBtn').onclick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// Expression input and calculator
const expressionInput = document.getElementById('expressionInput');
const resultBox = document.getElementById('result');

document.getElementById('calcBtn').onclick = () => {
    const expr = expressionInput.value.trim();
    if (!expr) {
        resultBox.textContent = "Enter an expression.";
        return;
    }
    try {
        // Basic safe math evaluation
        let sanitized = expr.replace(/[^-()\d/*+.x^]/g, "");
        sanitized = sanitized.replace(/(\d)x/g, "$1*x"); // 2x => 2*x
        sanitized = sanitized.replace(/x/g, "0"); // For calculator, x=0
        sanitized = sanitized.replace(/\^/g, "**");
        const value = Function('"use strict";return (' + sanitized + ')')();
        resultBox.textContent = `Result: ${value}`;
    } catch (e) {
        resultBox.textContent = "Invalid expression.";
    }
};

// Graph plotter
const plotCanvas = document.getElementById('plotCanvas');
const plotCtx = plotCanvas.getContext('2d');

document.getElementById('plotBtn').onclick = () => {
    const expr = expressionInput.value.trim();
    if (!expr) {
        resultBox.textContent = "Enter an expression to plot.";
        return;
    }
    plotCtx.clearRect(0, 0, plotCanvas.width, plotCanvas.height);
    // Draw axes
    plotCtx.strokeStyle = "#aaa";
    plotCtx.lineWidth = 1;
    plotCtx.beginPath();
    plotCtx.moveTo(0, plotCanvas.height/2);
    plotCtx.lineTo(plotCanvas.width, plotCanvas.height/2);
    plotCtx.moveTo(plotCanvas.width/2, 0);
    plotCtx.lineTo(plotCanvas.width/2, plotCanvas.height);
    plotCtx.stroke();

    // Plot function
    let sanitized = expr.replace(/[^-()\d/*+.x^]/g, "");
    sanitized = sanitized.replace(/(\d)x/g, "$1*x"); // 2x => 2*x
    sanitized = sanitized.replace(/\^/g, "**");
    try {
        plotCtx.strokeStyle = "#fff";
        plotCtx.lineWidth = 2;
        plotCtx.beginPath();
        for (let px = 0; px < plotCanvas.width; px++) {
            let x = (px - plotCanvas.width/2) / 30; // x range -5.3..+5.3
            let y = Function("x", '"use strict";return (' + sanitized + ')')(x);
            let py = plotCanvas.height/2 - y * 30;
            if (px === 0)
                plotCtx.moveTo(px, py);
            else
                plotCtx.lineTo(px, py);
        }
        plotCtx.stroke();
        resultBox.textContent = "Plot generated.";
    } catch (e) {
        resultBox.textContent = "Error plotting function.";
    }
};
