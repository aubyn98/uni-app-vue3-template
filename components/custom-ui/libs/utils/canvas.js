export function loadImage(src, canvas, imgMap) {
	return new Promise((r, j) => {
		if (imgMap[src]) return r(imgMap[src])
		const image = canvas.createImage()
		image.onload = () => {
			imgMap[src] = image
			r(image)
		}
		image.onerror = j
		image.src = src
	})
}

export function drawMultilineText({
	ctx,
	text,
	x,
	y,
	maxWidth = 750,
	lineHeight = 36,
	align = 'left',
	maxLine
}) {
	const lines = []; // 存储所有行文本
	let currentLine = '';
	const chars = String(text).split('');

	// 先拆分所有行
	for (let i = 0; i < chars.length; i++) {
		const char = chars[i];
		const testLine = currentLine + char;
		if (ctx.measureText(testLine).width > maxWidth && i > 0) {
			lines.push(currentLine);
			currentLine = char;
		} else {
			currentLine = testLine;
		}
	}
	lines.push(currentLine); // 最后一行
	if (maxLine && lines.length > maxLine) {
		lines.length = maxLine
		const last = maxLine - 1
		const lastLine = lines[last]
		lines[last] = lastLine.slice(0, lastLine.length - 3) + '...'
	}

	// 绘制每行，根据对齐方式调整x坐标
	lines.forEach((line, index) => {
		let drawX = x;
		if (align === 'center') {
			// 居中：x = 基准x - 行宽/2
			drawX = x - ctx.measureText(line).width / 2;
		} else if (align === 'right') {
			// 右对齐：x = 基准x - 行宽
			drawX = x - ctx.measureText(line).width;
		}
		ctx.fillText(line, drawX, y + index * lineHeight);
	});
}

// 示例：检测点击是否在多边形内
export function detectPolygon(x, y, polygonPoints) {
	ctx.beginPath();
	ctx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
	for (let i = 1; i < polygonPoints.length; i++) {
		ctx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
	}
	ctx.closePath();
	return ctx.isPointInPath(x, y); // 返回true表示点在路径内
}