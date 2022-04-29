(() => {

	let yOffset = 0; //window.pageYOffset 대신 쓸 변수
	let prevScrollHeight = 0; //현재 스크롤위치(yOffset)보다 이전에 위치한 스크롤 세션들의 스크롤 높이값의 합
	let currentScene = 0; //현재  활성화된 씬(scroll-section)
	let enterNewScene = false; //새로운 scene이 시작되는 순간 true
	let acc = 0.2;
	let delayedYOffset = 0;
	let rafId;
	let rafState;

	const sceneInfo = [
		{
			//scroll-section-0
			type: 'sticky',
			heightNum: 5, //브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0,
			objects: {
				container: document.querySelector('#scroll-section-0'),
				messageA: document.querySelector('#scroll-section-0 .main-message.a'),
				messageB: document.querySelector('#scroll-section-0 .main-message.b'),
				messageC: document.querySelector('#scroll-section-0 .main-message.c'),
				messageD: document.querySelector('#scroll-section-0 .main-message.d'),
				canvas: document.querySelector('#video-canvas-0'),
				context: document.querySelector('#video-canvas-0').getContext('2d'),
				videoImages: []
			},
			values: {
				videoImageCount: 300,
				imageSequence: [0, 299],
				canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
				messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
				messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
				messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
				messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
				messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
				messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
				messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
				messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
				messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
				messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
				messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
				messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
				messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
				messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
				messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
				messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
			}
		},
		{
			//scroll-section-1
			type: 'normal',
			//heightNum: 1, type이 normal이라 주석
			scrollHeight: 0,
			objects: {
				container: document.querySelector('#scroll-section-1'),
				content: document.querySelector('#scroll-section-1 .description')
			}
		},
		{
			//scroll-section-2
			type: 'sticky',
			heightNum: 5,
			scrollHeight: 0,
			objects: {
				container: document.querySelector('#scroll-section-2'),
				messageA: document.querySelector('#scroll-section-2 .a'),
				messageB: document.querySelector('#scroll-section-2 .b'),
				messageC: document.querySelector('#scroll-section-2 .c'),
				pinB: document.querySelector('#scroll-section-2 .b .pin'),
				pinC: document.querySelector('#scroll-section-2 .c .pin'),
				canvas: document.querySelector('#video-canvas-1'),
				context: document.querySelector('#video-canvas-1').getContext('2d'),
				videoImages: []
			},
			values: {
				videoImageCount: 960,
				imageSequence: [0, 959],
				canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
				canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
				messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
				messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
				messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
				messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
				messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
				messageC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
				messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
				messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
				messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],
				messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
				messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
				messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
				pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
				pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }]
			}
		},
		{
			//scroll-section-3
			type: 'sticky',
			heightNum: 5,
			scrollHeight: 0,
			objects: {
				container: document.querySelector('#scroll-section-3'),
				canvasCaption: document.querySelector('.canvas-caption'),
				canvas: document.querySelector('.image-blend-canvas'),
				context: document.querySelector('.image-blend-canvas').getContext('2d'),
				imagesPath: [
					'./images/blend-image-1.jpg',
					'./images/blend-image-2.jpg'
				],
				images: [],
				messageA: document.querySelector('#scroll-section-3 .main-message.a')
			},
			values: {
				rect1X: [0, 0, { start: 0, end: 0}],
				rect2X: [0, 0, { start: 0, end: 0}],
				blendHeight: [0, 0, { start: 0, end: 0}],
				canvas_scale: [0, 0, { start: 0, end: 0}],
				rectStartY: 0,
				canvasCaption_opacity: [0, 1, { start: 0, end: 0}],
				canvasCaption_translateY: [20, 0, { start: 0, end: 0}],
				messageA_opacity_in: [0, 1, { start: 0, end: 0 }],
				messageA_opacity_out: [1, 0, { start: 0, end: 0 }]
			}
		},
	];
	
	function setCanvasImages(){
		let imgElem;
		for(let i = 0; i < sceneInfo[0].values.videoImageCount; i++){
			imgElem = new Image();
			imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
			sceneInfo[0].objects.videoImages.push(imgElem);
		}

		let imgElem2;
		for(let i = 0; i < sceneInfo[2].values.videoImageCount; i++){
			imgElem2 = new Image();
			imgElem2.src = `./video/002/IMG_${7027 + i}.JPG`;
			sceneInfo[2].objects.videoImages.push(imgElem2);
		}

		let imgElem3;
		for(let i = 0; i < sceneInfo[3].objects.imagesPath.length; i++){
			imgElem3 = new Image();
			imgElem3.src = sceneInfo[3].objects.imagesPath[i];
			sceneInfo[3].objects.images.push(imgElem3);
		}
	}

	function checkMenu(){
		if(yOffset > 44){
			document.body.classList.add('local-nav-sticky');
		}else{
			document.body.classList.remove('local-nav-sticky');
		}
	}

	function setLayout(){
		//각 스크롤 섹션의 높이 세팅
		for(let i = 0; i < sceneInfo.length; i++){
			if(sceneInfo[i].type === 'sticky'){
				sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
			}else if(sceneInfo[i].type === 'normal'){
				sceneInfo[i].scrollHeight = sceneInfo[i].objects.container.offsetHeight;
			}
			sceneInfo[i].objects.container.style.height = `${sceneInfo[i].scrollHeight}px`;
		}

		yOffset = window.pageYOffset;

		let totalScrollHeight = 0;
		for(let i = 0; i < sceneInfo.length; i++){
			totalScrollHeight += sceneInfo[i].scrollHeight;
			if(totalScrollHeight >= yOffset){
				currentScene = i;
				break;
			}
		}
		document.body.setAttribute('id', `show-scene-${currentScene}`);

		const heightRatio = window.innerHeight / 1080;
		sceneInfo[0].objects.canvas.style.transform =`translate3d(-50%, -50%, 0) scale(${heightRatio})`;
		sceneInfo[2].objects.canvas.style.transform =`translate3d(-50%, -50%, 0) scale(${heightRatio})`;
	}

	function calcValues(values, currentYOffset){
		let rv;
		const scrollHeight = sceneInfo[currentScene].scrollHeight
		const scrollRatio = currentYOffset / scrollHeight;

		if(values.length === 3){
			//start~end 사이에 애니메이션 실행
			const partScrollStart = values[2].start * scrollHeight;
			const partScrollEnd = values[2].end * scrollHeight;
			const partScrollHeight = partScrollEnd - partScrollStart;

			if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd){
				rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
			}else if(currentYOffset < partScrollStart){
				rv = values[0];
			}else if(currentYOffset > partScrollEnd){
				rv = values[1];
			}
		}else{
			rv = scrollRatio * (values[1] - values[0]) + values[0];
		}

		return rv;
	}

	function playAnimation(){
		const objects = sceneInfo[currentScene].objects;
		const values = sceneInfo[currentScene].values;
		const currentYOffset = yOffset - prevScrollHeight;
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;

		switch(currentScene) {
			case 0:
				objects.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

				if(scrollRatio <= 0.22){
					objects.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objects.messageA.style.transform = `translate3d(${calcValues(values.messageA_translateY_in, currentYOffset)}%)`;
				}else{
					objects.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objects.messageA.style.transform = `translate3d(${calcValues(values.messageA_translateY_out, currentYOffset)}%)`;
				}

				if(scrollRatio <= 0.42){
					objects.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objects.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
				}else{
					objects.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objects.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
				}
	
				if(scrollRatio <= 0.62){
					objects.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objects.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
				}else{
					objects.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objects.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
				}
	
				if(scrollRatio <= 0.82){
					objects.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
					objects.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
				}else{
					objects.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
					objects.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
				}
				break;

			case 2:
				if(scrollRatio <= 0.5){
					objects.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
				}else{
					objects.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
				}
	
				if(scrollRatio <= 0.32){
					objects.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objects.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				}else{
					objects.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objects.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
	
				if(scrollRatio <= 0.67){
					objects.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
					objects.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objects.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
				}else{
					objects.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
					objects.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objects.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
				}
	
				if(scrollRatio <= 0.93){
					objects.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
					objects.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objects.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
				}else{
					objects.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
					objects.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objects.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
				}
				
				//currentScene 3에서 쓰는 캔버스를 미리 그려주기 시작
				if (scrollRatio > 0.9) {
					const objects = sceneInfo[3].objects;
					const values = sceneInfo[3].values;
					const widthRatio = window.innerWidth / objects.canvas.width;
					const heightRatio = window.innerHeight / objects.canvas.height;
					let canvasScaleRatio;

					if (widthRatio <= heightRatio) {
						canvasScaleRatio = heightRatio;
					} else {
						canvasScaleRatio = widthRatio;
					}

					objects.canvas.style.transform = `scale(${canvasScaleRatio})`;
					objects.context.fillStyle = 'white';
					objects.context.drawImage(objects.images[0], 0, 0);

					const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
					const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

					const whiteRectWidth = recalculatedInnerWidth * 0.15;
					values.rect1X[0] = (objects.canvas.width - recalculatedInnerWidth) / 2;
					values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
					values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
					values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

					objects.context.fillRect(
						parseInt(values.rect1X[0]),
						0,
						parseInt(whiteRectWidth),
						objects.canvas.height
					);
					objects.context.fillRect(
						parseInt(values.rect2X[0]),
						0,
						parseInt(whiteRectWidth),
						objects.canvas.height
					);
				}

				break;

			case 3:
				//가로 세로 모두 꽉 차게 하기 위해 세팅
				const widthRatio = window.innerWidth / objects.canvas.width;
				const heightRatio = window.innerHeight / objects.canvas.height;
				let canvasScaleRatio;

				if (widthRatio <= heightRatio) {
					// 캔버스보다 브라우저 창이 홀쭉한 경우
					canvasScaleRatio = heightRatio;
				} else {
					// 캔버스보다 브라우저 창이 납작한 경우
					canvasScaleRatio = widthRatio;
				}

				objects.canvas.style.transform = `scale(${canvasScaleRatio})`;
				objects.context.fillStyle = 'white';
				objects.context.drawImage(objects.images[0], 0, 0);

				// 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
				const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
				const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

				if (!values.rectStartY) {
					values.rectStartY = objects.canvas.offsetTop + (objects.canvas.height - objects.canvas.height * canvasScaleRatio) / 2;
					values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight;
					values.rect2X[2].start = (window.innerHeight / 2) / scrollHeight;
					values.rect1X[2].end = values.rectStartY / scrollHeight;
					values.rect2X[2].end = values.rectStartY / scrollHeight;
				}

				const whiteRectWidth = recalculatedInnerWidth * 0.15;
				values.rect1X[0] = (objects.canvas.width - recalculatedInnerWidth) / 2;
				values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
				values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
				values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

				// 좌우 흰색 박스 그리기
				objects.context.fillRect(
					parseInt(calcValues(values.rect1X, currentYOffset)),
					0,
					parseInt(whiteRectWidth),
					objects.canvas.height
				);
				objects.context.fillRect(
					parseInt(calcValues(values.rect2X, currentYOffset)),
					0,
					parseInt(whiteRectWidth),
					objects.canvas.height
				);

				if (scrollRatio < values.rect1X[2].end) {
					objects.canvas.classList.remove('sticky');
				} else {
					// 이미지 블렌드
					values.blendHeight[0] = 0;
					values.blendHeight[1] = objects.canvas.height;
					values.blendHeight[2].start = values.rect1X[2].end;
					values.blendHeight[2].end = values.blendHeight[2].start + 0.2;
					const blendHeight = calcValues(values.blendHeight, currentYOffset);

					objects.context.drawImage(objects.images[1],
						0, objects.canvas.height - blendHeight, objects.canvas.width, blendHeight,
						0, objects.canvas.height - blendHeight, objects.canvas.width, blendHeight
					);

					objects.canvas.classList.add('sticky');
					objects.canvas.style.top = `${-(objects.canvas.height - objects.canvas.height * canvasScaleRatio) / 2}px`;

					if (scrollRatio > values.blendHeight[2].end) {
						values.canvas_scale[0] = canvasScaleRatio;
						values.canvas_scale[1] = document.body.offsetWidth / (1.5 * objects.canvas.width);
						values.canvas_scale[2].start = values.blendHeight[2].end;
						values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2;

						objects.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentYOffset)})`;
						objects.canvas.style.marginTop = 0;
					}

					if (scrollRatio > values.canvas_scale[2].end
					&& values.canvas_scale[2].end > 0) {
						objects.canvas.classList.remove('sticky');
						objects.canvas.style.marginTop = `${scrollHeight * 0.4}px`;

						values.canvasCaption_opacity[2].start = values.canvas_scale[2].end;
						values.canvasCaption_opacity[2].end = values.canvasCaption_opacity[2].start + 0.1;
						values.canvasCaption_translateY[2].start = values.canvasCaption_opacity[2].start;
						values.canvasCaption_translateY[2].end = values.canvasCaption_opacity[2].end;
						objects.canvasCaption.style.opacity = calcValues(values.canvasCaption_opacity, currentYOffset);
						objects.canvasCaption.style.transform = `translate3d(0, ${calcValues(values.canvasCaption_translateY, currentYOffset)}%, 0)`;
					} else {
						objects.canvasCaption.style.opacity = values.canvasCaption_opacity[0];
					}

					values.messageA_opacity_in[2].start = values.rect1X[2].end;
					values.messageA_opacity_in[2].end = values.blendHeight[2].start + 0.1;
					values.messageA_opacity_out[2].start = values.messageA_opacity_in[2].end + 0.1;
					values.messageA_opacity_out[2].end = values.messageA_opacity_out[2].start + 0.1;

					if (scrollRatio < values.messageA_opacity_in[2].end + 0.05) {
						objects.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					} else {
						objects.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					}
				}

				if (scrollRatio <= values.messageA_opacity_in[2].start) {
					objects.messageA.style.opacity = values.messageA_opacity_in[0];
				}
				if (scrollRatio >= values.messageA_opacity_out[2].end) {
					objects.messageA.style.opacity = values.messageA_opacity_out[1];
				}

				break;
		}
	}

	function scrollLoop(){
		enterNewScene = false;
		prevScrollHeight = 0;

		for(let i = 0; i < currentScene; i++){
			prevScrollHeight += sceneInfo[i].scrollHeight;
		}

		if(delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			document.body.classList.remove('.scroll-effect-end');
		}

		if(delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			enterNewScene = true;
			if(currentScene === sceneInfo.length - 1){
				document.body.classList.add('.scroll-effect-end');
			}
			if(currentScene < sceneInfo.length - 1){
				currentScene++;
			}
			document.body.setAttribute('id', `show-scene-${currentScene}`);
		}
		
		if(delayedYOffset < prevScrollHeight) {
			if(currentScene === 0) return; //브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
			enterNewScene = true;
			currentScene--;
			document.body.setAttribute('id', `show-scene-${currentScene}`);
		}

		if(enterNewScene) return;

		playAnimation();
	}

	function loop(){
		delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;
		
		if(!enterNewScene){
			if(currentScene === 0 || currentScene === 2){
				const objects = sceneInfo[currentScene].objects;
				const values = sceneInfo[currentScene].values;
				const currentYOffset = delayedYOffset - prevScrollHeight;
				let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
				if(objects.videoImages[sequence]){
					objects.context.drawImage(objects.videoImages[sequence], 0, 0);
				}
			}
		}

		rafId = requestAnimationFrame(loop);

		if(Math.abs(yOffset - delayedYOffset) < 1){
			cancelAnimationFrame(rafId);
			rafState = false;
		}
	}

	window.addEventListener('load', () => {

		document.body.classList.remove('before-load');
		setLayout();
		sceneInfo[0].objects.context.drawImage(sceneInfo[0].objects.videoImages[0], 0, 0);
		
		if(yOffset > 0){
			let tempYOffset = yOffset;
			let tempScrollCount = 0;
			let siId = setInterval(() => {
				scrollTo(0, tempYOffset);
				tempYOffset += 2;
	
				if(tempScrollCount > 10){
					clearInterval(siId);
				}
				tempScrollCount++;
			}, 20);
		}

		window.addEventListener('scroll', ()=> {
			yOffset = window.pageYOffset;
			scrollLoop();
			checkMenu();

			if(!rafState){
				rafId = requestAnimationFrame(loop);
				rafState = true;
			}
		});
		
		window.addEventListener('resize', () => {
			if(window.innerWidth > 900){
				window.location.reload();
			}
		});

		window.addEventListener('orientationChange', () => {
			scrollTo(0,0);
			setTimeout(() => {
				window.location.reload();
			}, 500);
		});

		document.querySelector('.loading').addEventListener('transitionend', (e) => {
			document.body.removeChild(e.currentTarget);
		});

	});

	setCanvasImages();
	
})();