function rainDrop(ctx, x, y, width, height) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x - width / 2, y + height / 2, x + width / 2, y + height / 2, x, y + height);
        ctx.bezierCurveTo(x - width / 2, y + height / 2, x + width / 2, y + height / 2, x, y);
        ctx.fillStyle = 'blue';
        ctx.fill();
    }
    
    // Example usage:
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    rainDrop(ctx, 50, 50, 20, 40);
  
