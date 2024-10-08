﻿



function t19_julia_gl64() {

	const items = initializeComponents();

	fill();

	return items.ret;


	function initializeComponents() {

		let btnResetSettings: HTMLElement;
		let btnToggleMode: HTMLElement;
		let btnToggleView: HTMLInputElement;
		let rangeSuperSamp: HTMLInputElement;
		let spanSuperSamp: HTMLElement;
		let rangeRenderMode: HTMLInputElement;
		let spanRenderMode: HTMLElement;
		let rangePower: HTMLInputElement;
		let spanPower: HTMLElement;
		let rangeZLength: HTMLInputElement;
		let spanZLength: HTMLElement;
		let rangeMaxIters: HTMLInputElement;
		let spanMaxIters: HTMLElement;
		let rangeColSteps: HTMLInputElement;
		let spanColSteps: HTMLElement;
		let spanScale: HTMLElement;
		const juliaPlot = createJuliaPlot();
		let canvasGl: HTMLCanvasElement;
		let canvas2d: HTMLCanvasElement;
		const ret =
			<div>
				<h4>Fractals</h4>
				<div style={{ position: "relative", }}>{btnResetSettings = <button style={{ position: "absolute", left: "470px", bottom: "5px", whiteSpace: "nowrap", }}>Reset settings</button>}</div>
				<table style={{ whiteSpace: "nowrap", }}><tr>
					<td>{btnToggleMode = <button style={{ minWidth: "90px", }} />}</td>
					<td style={{ paddingLeft: "15px", }}>Supersampling</td><td>{rangeSuperSamp = <input type="range" min="1" max="8" style={{ width: "80px", }} /> as HTMLInputElement}</td><td>{spanSuperSamp = <span />}</td>
					<td style={{ paddingLeft: "15px", }}>Speed vs accuracy</td><td>{rangeRenderMode = <input type="range" min="0" max="2" style={{ width: "60px", }} /> as HTMLInputElement}</td><td>{spanRenderMode = <span />}</td>
				</tr></table>
				<table style={{ whiteSpace: "nowrap", }}>
					<tr><td>Color steps</td><td>{rangeColSteps = <input type="range" min="1" max="100" style={{ width: "400px", }} /> as HTMLInputElement}</td><td>{spanColSteps = <span />}</td>
						<td><label style={{ userSelect: "none", }}>{btnToggleView = <input type="checkbox" /> as HTMLInputElement} gradient</label></td></tr>
					<tr><td>Iterations</td><td>{rangeMaxIters = <input type="range" min="1" max="1000" style={{ width: "400px", }} /> as HTMLInputElement}</td><td>{spanMaxIters = <span />}</td>
						<td><button onclick={inc} style={{ width: "20px", }}>+</button> <button onclick={dec} style={{ width: "20px", }}>-</button></td></tr>
					<tr><td>Power of z</td><td>{rangePower = <input type="range" style={{ width: "400px", }} /> as HTMLInputElement}</td><td>{spanPower = <span />}</td><td /></tr>
					<tr><td>Length of z</td><td>{rangeZLength = <input type="range" min="1" max="20" step="0.1" style={{ width: "400px", }} /> as HTMLInputElement}</td><td>{spanZLength = <span />}</td><td /></tr>
				</table>
				Scale: {spanScale = <span />}
				{juliaPlot.el}
				<div style={{ backgroundColor: "white", resize: "both", overflow: "hidden", border: "1px solid", width: "602px", height: "402px", }}>
					{canvasGl = <canvas style={{ width: "100%", height: "100%", }} /> as HTMLCanvasElement}
					{canvas2d = <canvas style={{ width: "100%", height: "100%", display: "none", }} /> as HTMLCanvasElement}
				</div>
				<div style={{ marginTop: "15px", }}>Controls:</div>
				- Move: <b>One finger drag</b> / <b>Left mouse button drag</b>.<br />
				- Zoom: <b>Two finger pinch</b> / <b>Mouse wheel</b>. <b>Shift</b> to speed up.<br />
				- Julia c parameter: <b>Three finger drag</b> / <b>Right mouse button drag</b>. <b>Shift</b> to speed up. <b>Ctrl</b> to speed down. <b>Ctrl + Shift</b> to speed down more.<br />
				- Reset settings button adds history entry, so browser back button can be used to revert reset.<br />
			</div>;

		const rangePower2 = inputRange2(rangePower, [-5, -4, -3, ...range(11).map(i => i / 10 - 2), ...range(10).map(i => i / 10 + 1), 2, 3, 4, 5,]);



		return { ret, btnResetSettings, btnToggleMode, btnToggleView, rangeSuperSamp, spanSuperSamp, rangeRenderMode, spanRenderMode, rangePower2, spanPower, rangeZLength, spanZLength, rangeMaxIters, spanMaxIters, rangeColSteps, spanColSteps, spanScale, juliaPlot, canvasGl, canvas2d, };
		function inc() { rangeMaxIters.max = `${+rangeMaxIters.max * 2}`; }
		function dec() { rangeMaxIters.max = `${+rangeMaxIters.max / 2}`; }
	}
	function inputRange2(el: HTMLInputElement, values: number[]) {
		[el.min, el.max, el.step,] = ["0", `${values.length - 1}`, "1",];
		const oninput = delegate();
		el.oninput = () => oninput.invoke();

		return { getValue, setValue, oninput, };

		function getValue() { return values[+el.value]; }
		function setValue(n: number) {
			const idx = values.findIndex(n2 => n2 === n);
			if (idx >= 0)
				el.value = `${idx}`;
		}
	}
	function createJuliaPlot() {
		let cross: HTMLElement;
		const el =
			<div style={{ position: "relative", }}>
				<span style={{ display: "inline-block", position: "absolute", left: "535px", bottom: "20px", width: "50px", height: "50px", border: "1px solid #ccc", borderRadius: "100px", }}>
					{cross = <span style={{ position: "absolute", pointerEvents: "none", }}>+</span>}
				</span>
			</div>;
		return { el, setPos, };
		function setPos(x: number, y: number) {
			setStyle(cross, { left: `${25 + x * 25 - 5}px`, top: `${25 - y * 25 - 13}px`, });
		}
	}



	function fill() {

		// maybe sometime
		//		animate change of power (without interval -1..1), fullscreen, edit palette
		//		enhance animation. animation is not smooth, when drawing is slow (part slow and part fast. as if animation handler get wrong time). take into account the expected rendering length. don't render frame 0. is it possible to interrupt rendering on gpu?
		//		creating flyovers
		//		canvas resizing on mobile is not working (?)
		// more fractals: http://usefuljs.net/fractals/docs/index.html, https://en.wikipedia.org/wiki/Mandelbrot_set
		// more implementations of float64: https://github.com/clickingbuttons/jeditrader/blob/a921a0e/shaders/src/fp64.wgsl (https://github.com/visgl/luma.gl/blob/291a2fdfb1cfdb15405032b3dcbfbe55133ead61/modules/shadertools/src/modules/math/fp64/fp64-arithmetic.glsl.ts)

		const canvasGl = items.canvasGl;
		const canvas2d = items.canvas2d;
		const workersPool: Worker[] = [];

		const spanScaleMultiplier = 600;

		const defaultParams = {
			drawMandelbrot: false,
			drawMono: false,
			superSamp: 2,
			renderMode: 1,
			power: 2,
			zLength: 2,
			maxIters: 200,
			colSteps: 20,
			scale: 3 / spanScaleMultiplier,
			centerX: 0,
			centerY: 0,
			juliaX: -0.6258,
			juliaY: 0.4025,
			flipPolar: 1,
		};
		const p = { ...defaultParams, };
		let prevP = { ...p, };

		let redraw = true;
		let lastUpdateTime = 0;
		let otherSetCenterAndScale = [p.centerX, p.centerY, p.scale,];


		// julia
		//[p.juliaX, p.juliaY,] = [-1.402, 0.005,];
		//[p.juliaX, p.juliaY,] = [-0.553, 0.504,];
		//[p.juliaX, p.juliaY,] = [-0.785 * 0.95, 0.13083333969116212 * 0.95,];

		// mandelbrot
		//[p.centerX, p.centerY, p.scale, p.maxIters, p.drawMandelbrot,] = [-0.9033519195433093, 0.25002747496554767, 0.0000022849254986921118, 147, true,];
		//[p.centerX, p.centerY, p.scale, p.maxIters, p.drawMandelbrot,] = [-0.8115766681578079, 0.20141225898974988, 0.0000014034116967598337, 500, true,];
		//[p.centerX, p.centerY, p.scale, p.maxIters, p.drawMandelbrot,] = [-0.8115734686602871, 0.20143013094290876, 2.8456343445241582e-8, 500, true,];


		setupInteraction();
		const gradientColors = setupGradientColors();
		const aaa = setupDraw();
		update(0);

		async function update(t: number) {
			//if (lastUpdateTime)
			//	console.log(myRound(t - lastUpdateTime, 4));	// eslint-disable-line no-console

			if (redraw) {
				redraw = false;
				lastUpdateTime = t;

				if (resizeCanvas(p.renderMode === 2 ? canvas2d : canvasGl))
					return;

				if (p.renderMode === 2)
					//const t2 = new Date();
					//await drawCpu();
					await drawCpuThread();
					//console.log("redraw end", new Date().getTime() - t2.getTime());	// eslint-disable-line no-console
				else
					drawGpu();
			} else
				lastUpdateTime = 0;
			requestAnimationFrame(update);
		}


		function resizeCanvas(canv: HTMLCanvasElement) {
			const displayWidth = canv.clientWidth;
			const displayHeight = canv.clientHeight;
			if (displayWidth === 0 || displayHeight === 0) {
				redraw = true; requestAnimationFrame(update); return true;
			}
			if (canv.width !== displayWidth || canv.height !== displayHeight) {
				canv.width = displayWidth;
				canv.height = displayHeight;
			}
			return false;
		}


		// interaction -------------------------------------------------------

		function setupInteraction() {

			readHashParams();
			window.addEventListener("popstate", () => { readHashParams(); redraw = true; });
			items.btnResetSettings.onclick = () => { history.pushState(null, "", "#"); readHashParams(); redraw = true; };
			function readHashParams() {
				p.drawMandelbrot = readHashParamDef("drawMandelbrot", s => !!+s, () => true, defaultParams.drawMandelbrot);
				p.drawMono = readHashParamDef("drawMono", s => !!+s, () => true, defaultParams.drawMono);
				p.superSamp = readHashParamDef("superSamp", s => +s, () => true, defaultParams.superSamp);
				p.renderMode = readHashParamDef("renderMode", s => +s, () => true, defaultParams.renderMode);
				p.power = readHashParamDef("power", s => +s, () => true, defaultParams.power);
				p.zLength = readHashParamDef("zLength", s => +s, () => true, defaultParams.zLength);
				p.maxIters = readHashParamDef("maxIters", s => +s, () => true, defaultParams.maxIters);
				p.colSteps = readHashParamDef("colSteps", s => +s, () => true, defaultParams.colSteps);
				p.scale = readHashParamDef("scale", s => +s / spanScaleMultiplier, () => true, defaultParams.scale);
				p.centerX = readHashParamDef("centerX", s => +s, () => true, defaultParams.centerX);
				p.centerY = readHashParamDef("centerY", s => +s, () => true, defaultParams.centerY);
				p.juliaX = readHashParamDef("juliaX", s => +s, () => true, defaultParams.juliaX);
				p.juliaY = readHashParamDef("juliaY", s => +s, () => true, defaultParams.juliaY);
				p.flipPolar = readHashParamDef("flipPolar", s => +s, () => true, defaultParams.flipPolar);

				items.btnToggleMode.innerText = p.drawMandelbrot ? "Mandelbrot" : "Julia";
				items.juliaPlot.el.style.display = p.drawMandelbrot ? "none" : null!;
				items.btnToggleView.checked = !p.drawMono;
				items.rangeColSteps.disabled = p.drawMono;
				items.rangeSuperSamp.value = `${p.superSamp}`;
				items.spanSuperSamp.innerText = `${p.superSamp ** 2}`;
				setStyle(canvasGl, { display: p.renderMode === 2 ? "none" : null!, }); setStyle(canvas2d, { display: p.renderMode === 2 ? null! : "none", });
				items.rangeRenderMode.value = `${p.renderMode}`;
				items.spanRenderMode.innerText = ["gpu32", "gpu64", "cpu64", "gl128",][p.renderMode];
				items.rangePower2.setValue(p.power);
				items.spanPower.innerText = `${myRound(p.power)}`;
				items.rangeZLength.value = `${p.zLength}`;
				items.spanZLength.innerText = `${myRound(p.zLength)}`;
				items.rangeMaxIters.value = `${p.maxIters}`;
				items.spanMaxIters.innerText = `${p.maxIters}`;
				items.rangeColSteps.value = `${p.colSteps}`;
				items.spanColSteps.innerText = `${p.colSteps}`;
				items.spanScale.innerText = (p.scale * spanScaleMultiplier).toExponential(1);
				items.juliaPlot.setPos(p.juliaX, p.juliaY);
			}
			function writeHashParams0() {
				history.replaceState(null, "", "#" + [
					p.drawMandelbrot !== defaultParams.drawMandelbrot ? `drawMandelbrot=${+p.drawMandelbrot}` : "",
					p.drawMono !== defaultParams.drawMono ? `drawMono=${+p.drawMono}` : "",
					p.superSamp !== defaultParams.superSamp ? `superSamp=${p.superSamp}` : "",
					p.renderMode !== defaultParams.renderMode ? `renderMode=${p.renderMode}` : "",
					p.power !== defaultParams.power ? `power=${p.power}` : "",
					p.zLength !== defaultParams.zLength ? `zLength=${p.zLength}` : "",
					p.maxIters !== defaultParams.maxIters ? `maxIters=${p.maxIters}` : "",
					p.colSteps !== defaultParams.colSteps ? `colSteps=${p.colSteps}` : "",
					p.scale !== defaultParams.scale ? `scale=${p.scale * spanScaleMultiplier}` : "",
					p.centerX !== defaultParams.centerX ? `centerX=${myRound(p.centerX)}` : "",
					p.centerY !== defaultParams.centerY ? `centerY=${myRound(p.centerY)}` : "",
					p.juliaX !== defaultParams.juliaX ? `juliaX=${myRound(p.juliaX)}` : "",
					p.juliaY !== defaultParams.juliaY ? `juliaY=${myRound(p.juliaY)}` : "",
					p.flipPolar !== defaultParams.flipPolar ? `flipPolar=${p.flipPolar}` : "",
				].filter(p => !isNullOrEmpty(p)).join("&")); // "window.location.hash = `#filter=${filter}`" zavola i popstate event
			}
			let writeTimeoutId = -1;
			function writeHashParams() {
				clearTimeout(writeTimeoutId);
				writeTimeoutId = setTimeout(writeHashParams0, TSpan.fromSeconds(.2)) as any;
			}


			items.btnToggleMode.onclick = () => {
				p.drawMandelbrot = !p.drawMandelbrot;
				items.btnToggleMode.innerText = p.drawMandelbrot ? "Mandelbrot" : "Julia";
				items.juliaPlot.el.style.display = p.drawMandelbrot ? "none" : null!;
				const aux = otherSetCenterAndScale;
				otherSetCenterAndScale = [p.centerX, p.centerY, p.scale,];
				[p.centerX, p.centerY, p.scale,] = aux;
				items.spanScale.innerText = (p.scale * spanScaleMultiplier).toExponential(1);
				redraw = true;
				writeHashParams();
			};
			items.btnToggleView.onchange = () => {
				p.drawMono = !items.btnToggleView.checked;
				items.rangeColSteps.disabled = p.drawMono;
				redraw = true;
				writeHashParams();
			};
			items.rangeSuperSamp.oninput = () => {
				p.superSamp = +items.rangeSuperSamp.value;
				items.spanSuperSamp.innerText = `${p.superSamp ** 2}`;
				redraw = true;
				writeHashParams();
			};
			items.rangeRenderMode.oninput = () => {
				const prev = p.renderMode;
				p.renderMode = +items.rangeRenderMode.value;
				items.spanRenderMode.innerText = ["gpu32", "gpu64", "cpu64", "gl128",][p.renderMode];
				if (prev !== 2 && p.renderMode === 2) { setStyle(canvasGl, { display: "none", }); setStyle(canvas2d, { display: null!, }); }
				if (prev === 2 && p.renderMode !== 2) { setStyle(canvas2d, { display: "none", }); setStyle(canvasGl, { display: null!, }); }
				redraw = true;
				writeHashParams();
			};
			items.rangePower2.oninput.add(() => {
				p.power = items.rangePower2.getValue();
				items.spanPower.innerText = `${myRound(p.power)}`;
				redraw = true;
				writeHashParams();
			});
			items.rangeZLength.oninput = () => {
				p.zLength = +items.rangeZLength.value;
				items.spanZLength.innerText = `${myRound(p.zLength)}`;
				redraw = true;
				writeHashParams();
			};
			items.rangeMaxIters.oninput = () => {
				p.maxIters = +items.rangeMaxIters.value;
				items.spanMaxIters.innerText = `${p.maxIters}`;
				redraw = true;
				writeHashParams();
			};
			items.rangeColSteps.oninput = () => {
				p.colSteps = +items.rangeColSteps.value;
				items.spanColSteps.innerText = `${p.colSteps}`;
				redraw = true;
				writeHashParams();
			};


			let lastMouseUp = new Date();
			document.oncontextmenu = () => new Date().getTime() - lastMouseUp.getTime() > TSpan.fromSeconds(.1);

			setupInteraction2(canvasGl);
			setupInteraction2(canvas2d);
			function setupInteraction2(canv: HTMLCanvasElement) {

				new ResizeObserver(() => { redraw = true; }).observe(canv);
				let prevPos = { x: 0, y: 0, };
				let lastTouchesCount: number;
				let lastWidth: number;
				setMouseTracking(canv,
					event => { prevPos = eventPosToElement(event, canv); lastTouchesCount = 0; lastWidth = 0; },
					event => {
						const touch = isTouchEvent(event);
						if (touch && lastTouchesCount !== event.touches.length) {
							prevPos = eventPosToElement(event, canv); 
							lastTouchesCount = event.touches.length;
							lastWidth = 0;
						} else {
							// mouse pan, touch pan
							const pos = eventPosToElement(event, canv);
							const dx = pos.x - prevPos.x;
							const dy = -(pos.y - prevPos.y);
							prevPos = pos;
							const [left, right,] = [1, 2,].map(i => ((event as MouseEvent).buttons & i) === i);
							if (left || touch && event.touches.length < 3) {
								p.centerX -= dx * p.scale;
								p.centerY -= dy * p.scale;
								redraw = true;
								writeHashParams();
							}
							if (!p.drawMandelbrot && (right || touch && event.touches.length === 3)) {
								//juliaX += 0.1 * dx * scale;
								//juliaY += 0.1 * dy * scale;
								const slow = event.ctrlKey;
								const fast = event.shiftKey;
								const speed = slow && fast ? 0.01 : slow ? 0.1 : fast ? 10 : 1;
								const rPrev = Math.hypot(p.juliaX, p.juliaY);
								const r = rPrev + 0.1 * dy * p.scale * p.flipPolar * speed;
								const fi = Math.atan2(p.juliaY, p.juliaX) - 0.1 * dx * p.scale * p.flipPolar * speed;
								if (rPrev > 0 && r < 0 || rPrev < 0 && r > 0)
									p.flipPolar *= -1;
								p.juliaX = r * Math.cos(fi);
								p.juliaY = r * Math.sin(fi);
								items.juliaPlot.setPos(p.juliaX, p.juliaY);
								redraw = true;
								writeHashParams();
							}

							// touch zoom
							//console.log(event.clientX, event.clientY);
							//event = { touches: [{ clientX: 380, clientY: 315, }, { clientX: event.clientX, clientY: event.clientY, },], };
							if (touch && event.touches.length === 2) {
								const width2 = Math.hypot(event.touches[1].clientX - event.touches[0].clientX, event.touches[1].clientY - event.touches[0].clientY);
								if (width2 !== 0 && lastWidth !== 0) {
									const clientRect = canv.getBoundingClientRect();
									const prevScale2 = p.scale;
									p.scale *= lastWidth / width2;
									items.spanScale.innerText = (p.scale * spanScaleMultiplier).toExponential(1);

									const dx = Math.min(Math.max(pos.x, 0), clientRect.width) - clientRect.width / 2;
									const dy = -(Math.min(Math.max(pos.y, 0), clientRect.height) - clientRect.height / 2);

									p.centerX += dx * prevScale2 - dx * p.scale;
									p.centerY += dy * prevScale2 - dy * p.scale;

									redraw = true;
									writeHashParams();
								}
								lastWidth = width2;
							}
						}
					},
					() => { lastMouseUp = new Date(); }
				);
				canv.oncontextmenu = () => false;


				let mousePos: MouseEvent | null;
				document.addEventListener("mousemove", event => mousePos = event);


				let anim: ReturnType<typeof animate2> | null = null;
				let [againDir, againFast, againEvent,] = [0, false, { clientX: 0, clientY: 0, },];
				canv.addEventListener("wheel", event => {
					event.preventDefault();
					if (anim?.running())
						[againDir, againFast, againEvent,] = [Math.sign(event.deltaY), event.shiftKey, event,];
					else if (event.deltaY !== 0)
						auxScale(Math.sign(event.deltaY), event.shiftKey, event);
				});
				async function auxScale(dir: number, fast: boolean, event: { clientX: number, clientY: number, }) {
					const prevScale = p.scale;
					const clientRect = canv.getBoundingClientRect();

					anim = animate2(p2 => {
						const prevScale2 = p.scale;
						p.scale = prevScale * 2 ** (dir * (fast ? 2 : 1) * p2);
						items.spanScale.innerText = (p.scale * spanScaleMultiplier).toExponential(1);

						const dx = Math.min(Math.max((mousePos ?? event).clientX - clientRect.left, 0), clientRect.width) - clientRect.width / 2;
						const dy = -(Math.min(Math.max((mousePos ?? event).clientY - clientRect.top, 0), clientRect.height) - clientRect.height / 2);

						p.centerX += dx * prevScale2 - dx * p.scale;
						p.centerY += dy * prevScale2 - dy * p.scale;

						redraw = true;
						writeHashParams();
					}, TSpan.fromSeconds(0.5), x => x);// bezierEase({ x: .0, y: .0, }, { x: 1., y: 1., }));
					await anim.promise;
					if (againDir !== 0) {
						auxScale(againDir, againFast, againEvent);
						againDir = 0;
					}
				}
			}
		}
		function myRound(x: number, decimalPlaces = 14) { return Math.round(x * 10 ** decimalPlaces) / 10 ** decimalPlaces; }



		////////////////////////////////////////////////////////////////////////////////////////////////////////////

		function setupDraw() {
			const vertex_shader_src = `
				#version 300 es
				precision highp float;
				in vec2 a_Position;
				void main() {
					gl_Position = vec4(a_Position.xy, 0, 1);
				}
			`.trimStart();
			const fragment_shader_src = `
				#version 300 es
				precision highp float;
				out vec4 outColor;

				uniform bool u_drawMandelbrot;
				uniform bool u_drawMono;
				uniform int u_renderMode;
				uniform float u_superSamp;
				uniform float u_power;
				uniform float u_zLengthSq;
				uniform int u_maxIters;
				uniform int u_colSteps;
				uniform vec2 u_scale;
				uniform vec4 u_corner;
				uniform vec4 u_julia;

				vec4 getColor(int iters);


				#define POW_2_18 262144.	// 2^18
				//float myFround(float a) { float m = pow(2., 19. - (a == 0. ? 0. : floor(log2(abs(a))))); return round(a * m) / m; }
				float myFround(float a) { return round(a * POW_2_18) / POW_2_18; }

				//vec2 dd_add(vec2 dsa, vec2 dsb) {
				//	float t1 = myFround(dsa.x + dsb.x);
				//	float e = t1 - dsa.x;
				//	float t2 = ((dsb.x - e) + (dsa.x - (t1 - e))) + dsa.y + dsb.y;
				//	float dscx = myFround(t1 + t2);
				//	return vec2(dscx, t2 - (dscx - t1));
				//}

				float two_sum(float a, float b, out float err) {	// include/qd/inline.h
					float s = myFround(a + b);
					float bb = s - a;
					err = (a - (s - bb)) + (b - bb);
					return s;
				}
				float quick_two_sum(float a, float b, out float err) {	// include/qd/inline.h
					float s = myFround(a + b);
					err = b - (s - a);
					return s;
				}
				vec2 dd_add(vec2 a, vec2 b) {	// include/qd/dd_inline.h - ieee_add
					float s2, t2;
					float s1 = two_sum(a.x, b.x, s2);
					float t1 = two_sum(a.y, b.y, t2);
					s2 += t1;
					s1 = quick_two_sum(s1, s2, s2);
					s2 += t2;
					s1 = quick_two_sum(s1, s2, s2);
					return vec2(s1, s2);
				}

				//vec2 dd_mul(vec2 dsa, vec2 dsb) {
				//	float split = 8193.;
				//	float cona = myFround(dsa.x * split);
				//	float conb = myFround(dsb.x * split);
				//	float a1 = cona - (cona - dsa.x);
				//	float b1 = conb - (conb - dsb.x);
				//	float a2 = dsa.x - a1;
				//	float b2 = dsb.x - b1;
				//	float c11 = myFround(dsa.x * dsb.x);
				//	float c21 = a2 * b2 + (a2 * b1 + (a1 * b2 + (a1 * b1 - c11)));
				//	float c2 = dsa.x * dsb.y + dsa.y * dsb.x;
				//	float t1 = myFround(c11 + c2);
				//	float e = t1 - c11;
				//	float t2 = dsa.y * dsb.y + ((c2 - e) + (c11 - (t1 - e))) + c21;
				//	float cx = myFround(t1 + t2);
				//	return vec2(cx, t2 - (cx - t1));
				//}

				#define _QD_SPLITTER 134217729.               // = 2^27 + 1
				void split(float a, out float hi, out float lo) {
					float temp;
					temp = myFround(_QD_SPLITTER * a);
					hi = temp - (temp - a);
					lo = a - hi;
				}
				float two_prod(float a, float b, out float err) {
					float a_hi, a_lo, b_hi, b_lo;
					float p = a * b;
					split(a, a_hi, a_lo);
					split(b, b_hi, b_lo);
					err = ((a_hi * b_hi - p) + a_hi * b_lo + a_lo * b_hi) + a_lo * b_lo;
					return p;
				}
				vec2 dd_mul(vec2 a, vec2 b) {
					float p2;
					float p1 = two_prod(a.x, b.x, p2);
					p2 += a.x * b.y + a.y * b.x;
					p1 = quick_two_sum(p1, p2, p2);
					return vec2(p1, p2);
				}

				bool dd_greater(vec2 a, float b) {
					return a.x > b || a.x == b && a.y > 0.;
				}


				int getIters_dd(vec2 x, vec2 y, vec2 x0, vec2 y0) {
					for (int iters = 0; iters < u_maxIters; iters++) {
						if (dd_greater(dd_add(dd_mul(x, x), dd_mul(y, y)), u_zLengthSq))
							return iters;

						vec2 xPrev = x;
						x = dd_add(dd_add(dd_mul(x, x), -dd_mul(y, y)), x0);
						y = dd_add(dd_mul(2. * xPrev, y), y0);
					}
					return u_maxIters;
				}
				int getIters2_dd(vec2 cx, vec2 cy) {
					return
						u_drawMandelbrot
							? getIters_dd(cx, cy, cx, cy)
							: getIters_dd(cx, cy, u_julia.xy, u_julia.zw);
				}


				int getItersNon2(float x, float y, float x0, float y0) {
					float rSqPrev = 0.;
					for (int iters = 0; iters < u_maxIters; iters++) {
						float rSq = x * x + y * y;
						//if (rSq > u_zLengthSq)
						if (iters > 0 && rSqPrev < rSq && rSq > u_zLengthSq)
							return iters;
						rSqPrev = rSq;

						float r = pow(rSq, u_power / 2.); 			// z^n = r^n * (cos fi*n + i sin fi*n)
						float fi = atan(y, x) * u_power;
						x = r * cos(fi) + x0;
						y = r * sin(fi) + y0;
					}
					return u_maxIters;
				}
				int getIters(float x, float y, float x0, float y0) {
					for (int iters = 0; iters < u_maxIters; iters++) {
						if (x * x + y * y > u_zLengthSq)
							return iters;

						float xPrev = x;
						x = x * x - y * y + x0;
						y = 2. * xPrev * y + y0;
					}
					return u_maxIters;
				}
				int getIters2(vec2 c) {
					return
						u_drawMandelbrot
							? u_power == 2. ? getIters(c.x, c.y, c.x, c.y) : getItersNon2(c.x, c.y, c.x, c.y)
							: u_power == 2. ? getIters(c.x, c.y, u_julia.x, u_julia.z) : getItersNon2(c.x, c.y, u_julia.x, u_julia.z);
				}

				void main() {
					if (u_renderMode == 0 || u_power != 2.) {
						vec2 c = u_corner.xz + gl_FragCoord.xy * u_scale.x;

						float sampleStep = 1. / u_superSamp;
						vec4 acc = vec4(0);
						for (float i = .0; i < .99; i += sampleStep)
							for (float j = .0; j < .99; j += sampleStep)
								acc += getColor(getIters2(c + vec2(i, j) * u_scale.x));
						outColor = acc / pow(u_superSamp, 2.);
					//} if (u_renderMode == 3) {
					//	vec4 cx = qs_add(vec4(u_corner.xy, 0, 0), qs_mul(vec4(gl_FragCoord.x, 0, 0, 0), vec4(u_scale, 0, 0)));
					//	vec4 cy = qs_add(vec4(u_corner.zw, 0, 0), qs_mul(vec4(gl_FragCoord.y, 0, 0, 0), vec4(u_scale, 0, 0)));
					//
					//	float sampleStep = 1. / u_superSamp;
					//	vec4 acc = vec4(0);
					//	for (float i = .0; i < .99; i += sampleStep)
					//		for (float j = .0; j < .99; j += sampleStep)
					//			acc += getColor(getIters2_qd(qs_add(cx, qs_mul(vec4(u_scale, 0, 0), vec4(i, 0, 0, 0))), qs_add(cy, qs_mul(vec4(u_scale, 0, 0), vec4(j, 0, 0, 0)))));
					//	outColor = acc / pow(u_superSamp, 2.);
					} else {
						vec2 cx = dd_add(u_corner.xy, dd_mul(vec2(gl_FragCoord.x, 0), u_scale));
						vec2 cy = dd_add(u_corner.zw, dd_mul(vec2(gl_FragCoord.y, 0), u_scale));

						float sampleStep = 1. / u_superSamp;
						vec4 acc = vec4(0);
						for (float i = .0; i < .99; i += sampleStep)
							for (float j = .0; j < .99; j += sampleStep)
								acc += getColor(getIters2_dd(dd_add(cx, dd_mul(u_scale, vec2(i, 0))), dd_add(cy, dd_mul(u_scale, vec2(j, 0)))));
						outColor = acc / pow(u_superSamp, 2.);
					}
				}

				vec4 gradientColors[] = vec4[](
					vec4( 15,   2,  66, 255) / 255.,
					vec4(191,  41,  12, 255) / 255.,
					vec4(222,  99,  11, 255) / 255.,
					vec4(229, 208,  14, 255) / 255.,
					vec4(255, 255, 255, 255) / 255.,
					vec4(102, 173, 183, 255) / 255.,
					vec4( 14,  29, 104, 255) / 255.
				);
				vec4 getGradientColor(int iters) {
					int numCols = 7;
					int col0 = (iters / u_colSteps) % numCols;
					int col1 = (col0 + 1) % numCols;
					float proc = float(iters % u_colSteps) / float(u_colSteps);
					return mix(gradientColors[col0], gradientColors[col1], proc);
				}
				vec4 getColor(int iters) {
					return
						u_drawMono
							? iters < u_maxIters ? vec4(0, 0, 0, 1) : vec4(1, 192. / 255., 0, 1)
							: iters < u_maxIters ? getGradientColor(iters) : vec4(0, 0, 0, 1);
				}

			`.trimStart();

			const gl = canvasGl.getContext("webgl2"/*, { powerPreference: "low-power", }*/)!;

			// compile and link shaders
			const mandelbrot_program = createShader(gl, vertex_shader_src, fragment_shader_src);
			gl.useProgram(mandelbrot_program);

			// create a vertex buffer for a full-screen triangle
			const vertex_buf = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buf);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

			// set up the position attribute
			const position_attrib_location = gl.getAttribLocation(mandelbrot_program, "a_Position");
			gl.enableVertexAttribArray(position_attrib_location);
			gl.vertexAttribPointer(position_attrib_location, 2, gl.FLOAT, false, 0, 0);

			// find uniform locations
			const u_drawMandelbrot = gl.getUniformLocation(mandelbrot_program, "u_drawMandelbrot");
			const u_drawMono = gl.getUniformLocation(mandelbrot_program, "u_drawMono");
			const u_superSamp = gl.getUniformLocation(mandelbrot_program, "u_superSamp");
			const u_renderMode = gl.getUniformLocation(mandelbrot_program, "u_renderMode");
			const u_power = gl.getUniformLocation(mandelbrot_program, "u_power");
			const u_zLengthSq = gl.getUniformLocation(mandelbrot_program, "u_zLengthSq");
			const u_maxIters = gl.getUniformLocation(mandelbrot_program, "u_maxIters");
			const u_colSteps = gl.getUniformLocation(mandelbrot_program, "u_colSteps");
			const u_scale = gl.getUniformLocation(mandelbrot_program, "u_scale");
			const u_corner = gl.getUniformLocation(mandelbrot_program, "u_corner");
			const u_julia = gl.getUniformLocation(mandelbrot_program, "u_julia");

			return { gl, u_drawMandelbrot, u_drawMono, u_superSamp, u_renderMode, u_power, u_zLengthSq, u_maxIters, u_colSteps, u_scale, u_corner, u_julia, };
		}
		function createShader(gl: WebGLRenderingContext, vertexShaderSrc: string, fragmentShaderSrc: string) {
			const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
			gl.shaderSource(vertexShader, vertexShaderSrc);
			gl.compileShader(vertexShader);
			if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
				console.error("vertex shader compile error: " + gl.getShaderInfoLog(vertexShader));

			const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
			gl.shaderSource(fragmentShader, fragmentShaderSrc);
			gl.compileShader(fragmentShader);
			if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
				console.error("fragment shader compile error: " + gl.getShaderInfoLog(fragmentShader));

			const shader = gl.createProgram()!;
			gl.attachShader(shader, vertexShader);
			gl.attachShader(shader, fragmentShader);
			gl.linkProgram(shader);

			return shader;
		}

		function drawGpu() {
			const gl = aaa.gl;

			// bind inputs
			gl.uniform1i(aaa.u_drawMandelbrot, +p.drawMandelbrot);
			gl.uniform1i(aaa.u_drawMono, +p.drawMono);
			gl.uniform1f(aaa.u_superSamp, p.superSamp);
			gl.uniform1i(aaa.u_renderMode, p.renderMode);
			gl.uniform1f(aaa.u_power, p.power);
			gl.uniform1f(aaa.u_zLengthSq, p.zLength ** 2);
			gl.uniform1i(aaa.u_maxIters, p.maxIters);
			gl.uniform1i(aaa.u_colSteps, p.colSteps);
			gl.uniform2fv(aaa.u_scale, splitDouble(p.scale));
			const cx = p.centerX - canvasGl.width / 2 * p.scale;
			const cy = p.centerY - canvasGl.height / 2 * p.scale;
			gl.uniform4fv(aaa.u_corner, splitDouble(cx, cy));
			gl.uniform4fv(aaa.u_julia, splitDouble(p.juliaX, p.juliaY));

			// render frame
			gl.viewport(0, 0, canvasGl.width, canvasGl.height);
			gl.clearColor(0, 0, 0, 1);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
		}

		// https://stackoverflow.com/a/74793219/3877503
		function splitDouble(...v: number[]) {
			const arr = new Float32Array(v.length * 2);
			v.forEach((v2, i) => {
				arr[i * 2] = v2; // hi, same as Math.fround, https://stackoverflow.com/a/54472740/3877503
				arr[i * 2 + 1] = v2 - arr[i * 2]; // lo
			});
			return arr;
		}



		////////////////////////////////////////////////////////////////////////////////////////////////////////////

		async function drawCpu() {
			const ctx = canvas2d.getContext("2d", { willReadFrequently: true })!;
			const id = ctx.getImageData(0, 0, canvas2d.width, canvas2d.height);
			let p2 = 0;
			let t = new Date();

			const cornerX = p.centerX - (canvas2d.width - 1) / 2 * p.scale;
			const cornerY = p.centerY + (canvas2d.height - 1) / 2 * p.scale;
			for (let j = 0; j < canvas2d.height; j++) {

				if (redraw)
					return;
				const t2 = new Date();
				if (t2.getTime() - t.getTime() > TSpan.fromSeconds(0.2)) {
					t = t2;
					ctx.putImageData(id, 0, 0);
					await requestAnimationFrameA();
				}

				for (let i = 0; i < canvas2d.width; i++) {
					[id.data[p2++], id.data[p2++], id.data[p2++],] = compSample(cornerX + i * p.scale, cornerY - j * p.scale);
					id.data[p2++] = 255;
				}
			}

			ctx.putImageData(id, 0, 0);
		}

		function getItersNon2(x: number, y: number, x0: number, y0: number) {
			let rSqPrev = 0;
			for (let iters = 0; iters < p.maxIters; iters++) {
				const rSq = x * x + y * y;
				//if (rSq > zLength * zLength)
				if (iters > 0 && rSqPrev < rSq && rSq > p.zLength * p.zLength)
					return iters;
				rSqPrev = rSq;

				const r = Math.pow(rSq, p.power / 2); 			// z^n = r^n * (cos fi*n + i sin fi*n)
				const fi = Math.atan2(y, x) * p.power;
				x = r * Math.cos(fi) + x0;
				y = r * Math.sin(fi) + y0;
			}
			return p.maxIters;
		}
		function getIters(x: number, y: number, x0: number, y0: number) {
			for (let iters = 0; iters < p.maxIters; iters++) {
				if (x * x + y * y > p.zLength * p.zLength)
					return iters;

				const xPrev = x;
				x = x * x - y * y + x0;				// z^2 + c,  x^2-y^2 + 2xyi
				y = 2 * xPrev * y + y0;
			}
			return p.maxIters;
		}
		function getIters2(x: number, y: number) {
			return p.drawMandelbrot
				? p.power === 2 ? getIters(x, y, x, y) : getItersNon2(x, y, x, y)
				: p.power === 2 ? getIters(x, y, p.juliaX, p.juliaY) : getItersNon2(x, y, p.juliaX, p.juliaY);
		}

		function compSample(x: number, y: number) {
			const sampleStep = 1. / p.superSamp;
			const acc = [0, 0, 0,];
			for (let i = .0; i < .99; i += sampleStep)
				for (let j = .0; j < .99; j += sampleStep) {
					const acc2 = getColor(getIters2(x + p.scale * i, y + p.scale * j));
					acc[0] += acc2[0];
					acc[1] += acc2[1];
					acc[2] += acc2[2];
				}
			const d = p.superSamp ** -2;
			return [acc[0] * d, acc[1] * d, acc[2] * d,];
		}

		function setupGradientColors() {
			return [
				[15, 2, 66,],
				[191, 41, 12,],
				[222, 99, 11,],
				[229, 208, 14,],
				[255, 255, 255,],
				[102, 173, 183,],
				[14, 29, 104,],
			];
		}
		function getGradientColor(iters: number) {
			//return [255, (10 * iters) % 256, 0,];
			//return [255, Math.floor(iters / maxIters * 255), 0,];

			const numCols = gradientColors.length;
			const col0 = Math.floor(iters / p.colSteps) % numCols;
			const col1 = (col0 + 1) % numCols;
			const step = iters % p.colSteps;
			const color = [0, 0, 0,];
			for (let i = 0; i < 3; i++) {
				const c0 = gradientColors[col0][i];
				const c1 = gradientColors[col1][i];
				color[i] = Math.floor(c0 + (c1 - c0) / p.colSteps * step);
			}
			return color;
		}
		function getColor(iters: number) {
			return p.drawMono
				? iters < p.maxIters ? [0, 0, 0,] : [255, 192, 0,]
				: iters < p.maxIters ? getGradientColor(iters) : [0, 0, 0,];
		}

		////////////////////////////////////////////////////////////////////////////////////////////////////////////

		async function drawCpuThread() {
			if (workersPool.length === 0) {

				const src = `
					let redraw = false;
					onmessage = e => {
						const canvas2d_width = e.data.canvas2d_width;
						const jFrom = e.data.jFrom;
						const jTo = e.data.jTo;
						const cornerX = e.data.cornerX;
						const cornerY = e.data.cornerY;
						const p = e.data.p;
						const gradientColors = setupGradientColors();
						drawCpu();

						async function drawCpu() {
							//const ctx = canvas2d.getContext("2d", { willReadFrequently: true })!;
							//const id = ctx.getImageData(0, 0, canvas2d.width, canvas2d.height);
							//let t = new Date();
							//const arr = Array((jTo - jFrom) * canvas2d_width * 4).fill(0);
							const arr0 = new ArrayBuffer((jTo - jFrom) * canvas2d_width * 4 * 4);
							const arr = new Float32Array(arr0);
							let p2 = 0;
							//const arr = new Float32Array(e.data.sab);
							//let p2 = jFrom * canvas2d_width * 4;

							//const cornerX = p.centerX - (canvas2d.width - 1) / 2 * p.scale;
							//const cornerY = p.centerY + (canvas2d.height - 1) / 2 * p.scale;
							for (let j = jFrom; j < jTo; j++) {

								if (redraw)
									return;
								const t2 = new Date();
								//if (t2.getTime() - t.getTime() > /*TSpan.fromSeconds(0.2)*/200) {
								//	t = t2;
								//	//ctx.putImageData(id, 0, 0);
								//	//await requestAnimationFrameA();
								//	postMessage({ arr, });
								//}

								for (let i = 0; i < canvas2d_width; i++) {
									[arr[p2++], arr[p2++], arr[p2++],] = compSample(cornerX + i * p.scale, cornerY - j * p.scale);
									arr[p2++] = 255;
								}
							}

							//ctx.putImageData(id, 0, 0);
							postMessage({ arr0, }, [arr0,]);
						}

						function getItersNon2(x, y, x0, y0) {
							let rSqPrev = 0;
							for (let iters = 0; iters < p.maxIters; iters++) {
								const rSq = x * x + y * y;
								//if (rSq > zLength * zLength)
								if (iters > 0 && rSqPrev < rSq && rSq > p.zLength * p.zLength)
									return iters;
								rSqPrev = rSq;

								const r = Math.pow(rSq, p.power / 2); 			// z^n = r^n * (cos fi*n + i sin fi*n)
								const fi = Math.atan2(y, x) * p.power;
								x = r * Math.cos(fi) + x0;
								y = r * Math.sin(fi) + y0;
							}
							return p.maxIters;
						}
						function getIters(x, y, x0, y0) {
							for (let iters = 0; iters < p.maxIters; iters++) {
								if (x * x + y * y > p.zLength * p.zLength)
									return iters;

								const xPrev = x;
								x = x * x - y * y + x0;				// z^2 + c,  x^2-y^2 + 2xyi
								y = 2 * xPrev * y + y0;
							}
							return p.maxIters;
						}
						function getIters2(x, y) {
							return p.drawMandelbrot
								? p.power === 2 ? getIters(x, y, x, y) : getItersNon2(x, y, x, y)
								: p.power === 2 ? getIters(x, y, p.juliaX, p.juliaY) : getItersNon2(x, y, p.juliaX, p.juliaY);
						}

						function compSample(x, y) {
							const sampleStep = 1. / p.superSamp;
							const acc = [0, 0, 0,];
							for (let i = .0; i < .99; i += sampleStep)
								for (let j = .0; j < .99; j += sampleStep) {
									const acc2 = getColor(getIters2(x + p.scale * i, y + p.scale * j));
									acc[0] += acc2[0];
									acc[1] += acc2[1];
									acc[2] += acc2[2];
								}
							const d = p.superSamp ** -2;
							return [acc[0] * d, acc[1] * d, acc[2] * d,];
						}

						function setupGradientColors() {
							return [
								[15, 2, 66,],
								[191, 41, 12,],
								[222, 99, 11,],
								[229, 208, 14,],
								[255, 255, 255,],
								[102, 173, 183,],
								[14, 29, 104,],
							];
						}
						function getGradientColor(iters) {
							//return [255, (10 * iters) % 256, 0,];
							//return [255, Math.floor(iters / maxIters * 255), 0,];

							const numCols = gradientColors.length;
							const col0 = Math.floor(iters / p.colSteps) % numCols;
							const col1 = (col0 + 1) % numCols;
							const step = iters % p.colSteps;
							const color = [0, 0, 0,];
							for (let i = 0; i < 3; i++) {
								const c0 = gradientColors[col0][i];
								const c1 = gradientColors[col1][i];
								color[i] = Math.floor(c0 + (c1 - c0) / p.colSteps * step);
							}
							return color;
						}
						${getColor.toString()}
						//function getColor(iters) {
						//	return p.drawMono
						//		? iters < p.maxIters ? [0, 0, 0,] : [255, 192, 0,]
						//		: iters < p.maxIters ? getGradientColor(iters) : [0, 0, 0,];
						//}
					};
					`;
				const workerURL = URL.createObjectURL(new Blob([src], { type: "application/javascript", }));
				const threadsCount = Math.max(1, navigator.hardwareConcurrency - 1);
				workersPool.push(...range(threadsCount).map(() => new Worker(workerURL)));
			}

			const width2 = canvas2d.width;
			const height2 = canvas2d.height;

			const ctx = canvas2d.getContext("2d", { willReadFrequently: true })!;
			const id = ctx.getImageData(0, 0, width2, height2);
			//let t = new Date();
			const cornerX = p.centerX - (width2 - 1) / 2 * p.scale;
			const cornerY = p.centerY + (height2 - 1) / 2 * p.scale;

			//const sab = new SharedArrayBuffer(width2 * height2 * 4 * 4);
			//const arr = new Float32Array(sab);

			// copy original image
			const prevId = new Uint8ClampedArray(id.data);
			for (let j = 0; j < id.data.length / 4; j++) {
				const [x, y,] = [j % width2, Math.floor(j / width2),];
				const worldX = p.centerX + (x - (width2 - 1) / 2) * p.scale;
				const worldY = p.centerY + (y - (height2 - 1) / 2) * -p.scale;
				const prevX = Math.round((worldX - prevP.centerX) / prevP.scale + (width2 - 1) / 2);
				const prevY = Math.round((worldY - prevP.centerY) / -prevP.scale + (height2 - 1) / 2);
				let p2 = j * 4;
				if (prevX >= 0 && prevX < width2 && prevY >= 0 && prevY < height2) {
					let prevP2 = (prevY * width2 + prevX) * 4;
					id.data[p2++] = prevId[prevP2++];
					id.data[p2++] = prevId[prevP2++];
					id.data[p2++] = prevId[prevP2++];
				} else {
					id.data[p2++] = 0;
					id.data[p2++] = 0;
					id.data[p2++] = 0;
				}
			}
			prevP = { ...p, };

			/*
			const promises = workersPool.map((w, i) => {
				const [jFrom, jTo,] = [Math.round(height2 / workersPool.length * i), Math.round(height2 / workersPool.length * (i + 1)),];
				const done = outerPromise();
				w.onmessage = onmessage2;
				w.postMessage({ canvas2d_width: width2, jFrom, jTo, cornerX, cornerY, p, });
				function onmessage2(e: MessageEvent) {
					let p2 = jFrom * width2 * 4;
					const arr = new Float32Array(e.data.arr0);
					for (let j = 0; j < arr.length; j++)
						id.data[p2++] = arr[j];
					//for (let j = jFrom * width2 * 4; j < jTo * width2 * 4; j++)
					//	id.data[j] = arr[j];

					done.resolve({});
				}
				return done.promise;
			});
			await Promise.all(promises);

			ctx.putImageData(id, 0, 0);
			/**/


			//*
			const chunks = workersPool.length * 5;
			let t = new Date();

			await doWork(range(chunks).map(i =>
				w => {
					if (redraw)
						return Promise.resolve({});
					const [jFrom, jTo,] = [Math.round(height2 / chunks * i), Math.round(height2 / chunks * (i + 1)),];
					const done = outerPromise();
					w.onmessage = onmessage2;
					w.postMessage({ canvas2d_width: width2, jFrom, jTo, cornerX, cornerY, p, });
					function onmessage2(e: MessageEvent) {
						let p2 = jFrom * width2 * 4;
						const arr = new Float32Array(e.data.arr0);
						for (let j = 0; j < arr.length; j++)
							id.data[p2++] = arr[j];
						//for (let j = jFrom * width2 * 4; j < jTo * width2 * 4; j++)
						//	id.data[j] = arr[j];
						const t2 = new Date();
						if (t2.getTime() - t.getTime() > TSpan.fromSeconds(0.2)) {
							t = t2;
							ctx.putImageData(id, 0, 0);
						}
						done.resolve({});
					}
					return done.promise;
				}
			), workersPool);
			ctx.putImageData(id, 0, 0);


			function doWork(work: ((w: Worker) => Promise<any>)[], workersPool: Worker[]) {
				if (work.length === 0)
					return Promise.resolve({});
				let i = 0;
				let running = 0;
				const done = outerPromise<{}>();
				while (i < workersPool.length && i < work.length)
					add(i);
				async function add(workerIdx: number) {
					running++;
					await work[i++](workersPool[workerIdx]);
					running--;
					if (i < work.length)
						add(workerIdx);
					else if (running === 0)
						done.resolve({});
				}
				return done.promise;
			}/**/
		}
	}
}

