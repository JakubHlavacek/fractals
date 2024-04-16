"use strict";
function isNullOrUndefined(o) { return o === undefined || o === null; } // https://stackoverflow.com/a/52097700/3877503
function isNullOrEmpty(s) { return isNullOrUndefined(s) || s.length === 0; }
function toDictionary(arr, keySelector, valueSelector) {
    const ret = {};
    arr.forEach((p, i) => ret[keySelector(p, i)] = valueSelector(p, i));
    return ret;
}
function linInp(x, xFrom, xTo, yFrom, yTo) { return (x - xFrom) / (xTo - xFrom) * (yTo - yFrom) + yFrom; }
function range(n) { return Array(n).fill(0).map((_, i) => i); }
function setAttr(element, attrs) {
    Object.keys(attrs).forEach(k => {
        const v = attrs[k];
        //if (element.hasAttribute(k) && typeof v === "string")
        //	element.setAttribute(k, v);
        //else
        if (!(k in element))
            console.error(`${k} is not a valid property of a <${element.tagName}>`);
        else if (typeof v === "string")
            element[k] = v;
        else if (typeof v === "number")
            element[k] = v.toString();
        else if (v === undefined) { }
        else if (v === null)
            console.error(`${v} is not a valid property value, <${element.tagName} ${k}={${v}}>`);
        else if (typeof v === "object")
            Object.keys(v).forEach(k2 => {
                if (k2 in element[k])
                    element[k][k2] = v[k2];
                else
                    console.error(`${k2} is not a valid ${k} for a <${element.tagName} ${k}='..'>`);
            });
        else if (typeof v === "boolean" && typeof element[k] === "boolean")
            element[k] = v;
        else if (typeof v === "function" && ["onclick", "onmouseenter", "onchange", "ontouchstart", "ontouchend", "onkeypress", "onload", "onerror",].indexOf(k) !== -1)
            element[k] = v;
        else
            console.error(`${v} is not a valid property value of a <${element.tagName} ${k}=..>`, v);
    });
}
function setStyle(element, styles) {
    setAttr(element, { style: styles });
}
function setAttrSvg(element, attrs) {
    Object.keys(attrs).forEach(k => {
        const v = attrs[k];
        //if (!(k in element))
        //	console.error(`${k} is not a valid property of a <${element.tagName}>`);
        //else
        if (typeof v === "string")
            element.setAttribute(k, v);
        else if (typeof v === "number")
            element.setAttribute(k, v.toString());
        else if (v === null)
            console.error(`${v} is not a valid property value, <${element.tagName} ${k}={${v}}>`);
        else if (typeof v === "object")
            Object.keys(v).forEach(k2 => {
                if (k2 in element[k])
                    element[k][k2] = v[k2];
                else
                    console.error(`${k2} is not a valid ${k} for a <${element.tagName} ${k}='..'>`);
            });
        //else if (typeof v === "boolean" && typeof element[k] === "boolean")
        //	element[k] = v;
        //else if (typeof v === "function" && k === "onclick")
        //	element[k] = v;
        else
            console.error(`${v} is not a valid property value of a <${element.tagName} ${k}=..>`, v);
    });
}
function ac(element, ...children) {
    children.forEach(c => {
        if (typeof c === "string")
            element.appendChild(document.createTextNode(c));
        else if (typeof c === "number")
            element.appendChild(document.createTextNode(c.toString()));
        else if (c instanceof Node)
            element.appendChild(c);
        else if (c instanceof Array)
            ac(element, ...c);
        else
            console.warn(`${c} is not a valid child of a <${element.tagName}>`, c); // ${new Error().stack}
    });
    return element;
}
function myCreateElement(tag /* | ((props: any) => U)*/, attrs, ...children) {
    //if (typeof tag === "function")
    //	return tag({ ...attrs, children });
    if (["svg", "path", "circle", "rect", "polyline", "text", "g", "clipPath", "defs", "filter", "feGaussianBlur",].indexOf(tag) >= 0) {
        const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
        if (attrs !== null)
            setAttrSvg(element, attrs);
        return ac(element, ...children);
    }
    else {
        const element = document.createElement(tag);
        if (attrs !== null)
            setAttr(element, attrs);
        return ac(element, ...children);
    }
}
function replaceContent(parent, ...newContent) {
    parent.innerText = "";
    ac(parent, newContent);
}
function delegate() {
    const arr = [];
    return { add, invoke, clear, };
    function add(f) { arr.push(f); }
    function invoke() { arr.forEach(f => f()); }
    function clear() { arr.splice(0); }
}
function outerPromise() {
    let resolve2;
    const promise = new Promise((resolve, reject) => resolve2 = resolve);
    return { promise, resolve: resolve2, };
}
function isTouchEvent(e) { return e.touches !== undefined; }
function addEventListener2(elem, types, fn, options = false) { types.split(" ").forEach(type => elem.addEventListener(type, fn, options)); }
function removeEventListener2(elem, types, fn, options = false) { types.split(" ").forEach(type => elem.removeEventListener(type, fn, options)); }
function setMouseTracking(elem, ondown, onmove, onup) {
    function onmove2(e) { e.preventDefault(); onmove(e); }
    function onup2(e) {
        if (!isTouchEvent(e) || e.touches.length === 0) {
            onup(e);
            removeEventListener2(document, "mousemove touchmove pointermove", onmove2);
            removeEventListener2(document, "mouseup touchend pointerup", onup2);
        }
    }
    addEventListener2(elem, "mousedown touchstart pointerdown", e => {
        e.preventDefault();
        ondown(e);
        addEventListener2(document, "mousemove touchmove pointermove", onmove2);
        addEventListener2(document, "mouseup touchend pointerup", onup2);
    });
}
function eventPosToElement(e, elem) {
    const rect = elem.getBoundingClientRect();
    const pos = isTouchEvent(e) ? e.touches[0] : e;
    return { x: pos.clientX - rect.left, y: pos.clientY - rect.top, };
}
class TSpan {
    static fromSeconds(n) { return TSpan.second * n; }
    static fromMinutes(n) { return TSpan.minute * n; }
    static fromHours(n) { return TSpan.hour * n; }
    static fromDays(n) { return TSpan.day * n; }
    static fromMonths(n) { return TSpan.month * n; }
    static fromYears(n) { return TSpan.year * n; }
    static toHms(span_ms) {
        const ms = span_ms % 1000;
        span_ms = Math.round((span_ms - ms) / 1000);
        const s = span_ms % 60;
        span_ms = Math.round((span_ms - s) / 60);
        const m = span_ms % 60;
        span_ms = Math.round((span_ms - m) / 60);
        const h = span_ms;
        return { h, m, s, ms, };
    }
}
TSpan.second = 1000;
TSpan.minute = 60 * TSpan.second;
TSpan.hour = 60 * TSpan.minute;
TSpan.day = 24 * TSpan.hour;
TSpan.month = 31 * TSpan.day;
TSpan.year = 365 * TSpan.day;
function readHashParam(name, parse, isValid, assign) {
    const pars = toDictionary(window.location.hash.substring(1).split("&").map(p => p.split("=")), p => p[0], p => p[1]);
    if (pars[name] === undefined)
        return;
    const parsed = parse(pars[name]);
    if (!isValid(parsed))
        return;
    assign(parsed);
}
function readHashParamDef(name, parse, isValid, default2) {
    let ret = default2;
    readHashParam(name, parse, isValid, v => ret = v);
    return ret;
}
// https://javascript.info/js-animation, https://cubic-bezier.com
async function animate(draw, duration = TSpan.fromSeconds(.2), timing = bazierEase({ x: .25, y: .1, }, { x: .25, y: 1, })) {
    draw(timing(0));
    const start = await requestAnimationFrameA(); // performance.now: https://stackoverflow.com/questions/38360250
    while (true) {
        const time = await requestAnimationFrameA();
        const timeFraction = Math.min((time - start) / duration, 1);
        draw(timing(timeFraction));
        if (timeFraction === 1)
            break;
    }
}
function animate2(draw, duration = TSpan.fromSeconds(.2), timing = bazierEase({ x: .25, y: .1, }, { x: .25, y: 1, })) {
    const outerPromise2 = outerPromise();
    let cancelRequest = false;
    let isCancelled = false;
    let isResolved = false;
    aux();
    return { promise: outerPromise2.promise, cancel: () => cancelRequest = true, running: () => !isResolved && !isCancelled, };
    async function aux() {
        draw(timing(0));
        const start = await requestAnimationFrameA();
        while (true) {
            const time = await requestAnimationFrameA();
            const timeFraction = Math.min((time - start) / duration, 1);
            if (cancelRequest) {
                isCancelled = true;
                return;
            }
            draw(timing(timeFraction));
            if (timeFraction === 1)
                break;
        }
        isResolved = true;
        outerPromise2.resolve();
    }
}
//function composeAnimations(anims: (() => ReturnType<typeof animate2>)[]) {
//	const outerPromise2 = outerPromise<void>();
//	let cancelRequest = false;
//	let cur: ReturnType<typeof animate2>;
//	aux();
//	return { promise: outerPromise2.promise, cancel: () => { cancelRequest = true; cur?.cancel(); }, };
//	async function aux() {
//		for (let i = 0; i < anims.length; i++) {
//			if (cancelRequest)
//				return;
//			cur = anims[i]();
//			await cur.promise;
//		}
//		outerPromise2.resolve();
//	}
//}
function requestAnimationFrameA() {
    return new Promise((resolve, reject) => requestAnimationFrame(resolve));
}
function bazierEase(p1, p2) {
    const arr = [0,];
    const stepArr = 0.05;
    const stepBaz = 0.05;
    const baz = bezierEase0(p1, p2);
    let [prevBaz, nextBaz, tBaz,] = [{ x: 0, y: 0, }, baz(stepBaz), stepBaz,];
    for (let x = stepArr; x <= 1 - stepArr / 2; x += stepArr) {
        while (x > nextBaz.x && tBaz < 2) {
            prevBaz = nextBaz;
            tBaz += stepBaz;
            nextBaz = baz(tBaz);
        }
        arr.push(linInp(x, prevBaz.x, nextBaz.x, prevBaz.y, nextBaz.y));
    }
    arr.push(1);
    return (fraction) => {
        const iLeft = Math.min(Math.max(Math.floor(fraction / stepArr), 0), arr.length - 2);
        return linInp(fraction, iLeft * stepArr, (iLeft + 1) * stepArr, arr[iLeft], arr[iLeft + 1]);
    };
    // https://stackoverflow.com/questions/16227300, https://github.com/gre/bezier-easing/blob/master/src/index.js
    function bezierEase0(p1, p2) {
        const cX = 3 * p1.x; // const cX = 3 * (p1.x - p0.x);
        const cY = 3 * p1.y; // const cY = 3 * (p1.y - p0.y);
        const bX = 3 * (p2.x - p1.x) - cX; // const bX = 3 * (p2.x - p1.x) - cX;
        const bY = 3 * (p2.y - p1.y) - cY; // const bY = 3 * (p2.y - p1.y) - cY;
        const aX = 1 - cX - bX; // const aX = p3.x - p0.x - cX - bX;
        const aY = 1 - cY - bY; // const aY = p3.y - p0.y - cY - bY;
        return (t) => {
            const x = ((aX * t + bX) * t + cX) * t; // const x = ((aX * t + bX) * t + cX) * t + p0.x;
            const y = ((aY * t + bY) * t + cY) * t; // const y = ((aY * t + bY) * t + cY) * t + p0.y;
            return { x, y, };
        };
    }
}
function t19_julia_gl64() {
    const items = initializeComponents();
    fill();
    return items.ret;
    function initializeComponents() {
        let btnResetSettings;
        let btnToggleMode;
        let btnToggleView;
        let rangeSuperSamp;
        let spanSuperSamp;
        let rangeRenderMode;
        let spanRenderMode;
        let rangePower;
        let spanPower;
        let rangeZLength;
        let spanZLength;
        let rangeMaxIters;
        let spanMaxIters;
        let rangeColSteps;
        let spanColSteps;
        let spanScale;
        const juliaPlot = createJuliaPlot();
        let canvasGl;
        let canvas2d;
        const ret = myCreateElement("div", null,
            myCreateElement("h4", null, "Fractals"),
            myCreateElement("div", { style: { position: "relative", } }, btnResetSettings = myCreateElement("button", { style: { position: "absolute", left: "470px", bottom: "5px", whiteSpace: "nowrap", } }, "Reset settings")),
            myCreateElement("table", { style: { whiteSpace: "nowrap", } },
                myCreateElement("tr", null,
                    myCreateElement("td", null, btnToggleMode = myCreateElement("button", { style: { minWidth: "90px", } })),
                    myCreateElement("td", { style: { paddingLeft: "15px", } }, "Supersampling"),
                    myCreateElement("td", null, rangeSuperSamp = myCreateElement("input", { type: "range", min: "1", max: "8", style: { width: "80px", } })),
                    myCreateElement("td", null, spanSuperSamp = myCreateElement("span", null)),
                    myCreateElement("td", { style: { paddingLeft: "15px", } }, "Speed vs accuracy"),
                    myCreateElement("td", null, rangeRenderMode = myCreateElement("input", { type: "range", min: "0", max: "2", style: { width: "60px", } })),
                    myCreateElement("td", null, spanRenderMode = myCreateElement("span", null)))),
            myCreateElement("table", { style: { whiteSpace: "nowrap", } },
                myCreateElement("tr", null,
                    myCreateElement("td", null, "Color steps"),
                    myCreateElement("td", null, rangeColSteps = myCreateElement("input", { type: "range", min: "1", max: "100", style: { width: "400px", } })),
                    myCreateElement("td", null, spanColSteps = myCreateElement("span", null)),
                    myCreateElement("td", null,
                        myCreateElement("label", { style: { userSelect: "none", } },
                            btnToggleView = myCreateElement("input", { type: "checkbox" }),
                            " gradient"))),
                myCreateElement("tr", null,
                    myCreateElement("td", null, "Iterations"),
                    myCreateElement("td", null, rangeMaxIters = myCreateElement("input", { type: "range", min: "1", max: "1000", style: { width: "400px", } })),
                    myCreateElement("td", null, spanMaxIters = myCreateElement("span", null)),
                    myCreateElement("td", null,
                        myCreateElement("button", { onclick: inc, style: { width: "20px", } }, "+"),
                        " ",
                        myCreateElement("button", { onclick: dec, style: { width: "20px", } }, "-"))),
                myCreateElement("tr", null,
                    myCreateElement("td", null, "Power of z"),
                    myCreateElement("td", null, rangePower = myCreateElement("input", { type: "range", style: { width: "400px", } })),
                    myCreateElement("td", null, spanPower = myCreateElement("span", null)),
                    myCreateElement("td", null)),
                myCreateElement("tr", null,
                    myCreateElement("td", null, "Length of z"),
                    myCreateElement("td", null, rangeZLength = myCreateElement("input", { type: "range", min: "1", max: "20", step: "0.1", style: { width: "400px", } })),
                    myCreateElement("td", null, spanZLength = myCreateElement("span", null)),
                    myCreateElement("td", null))),
            "Scale: ",
            spanScale = myCreateElement("span", null),
            juliaPlot.el,
            myCreateElement("div", { style: { backgroundColor: "white", resize: "both", overflow: "hidden", border: "1px solid", width: "602px", height: "402px", } },
                canvasGl = myCreateElement("canvas", { style: { width: "100%", height: "100%", } }),
                canvas2d = myCreateElement("canvas", { style: { width: "100%", height: "100%", display: "none", } })),
            myCreateElement("div", { style: { marginTop: "15px", } }, "Controls:"),
            "- Move: ",
            myCreateElement("b", null, "Left mouse button drag"),
            ".",
            myCreateElement("br", null),
            "- Zoom: ",
            myCreateElement("b", null, "Mouse wheel"),
            ". ",
            myCreateElement("b", null, "Shift"),
            " to speed up.",
            myCreateElement("br", null),
            "- Julia c parameter: ",
            myCreateElement("b", null, "Right mouse button drag"),
            ". ",
            myCreateElement("b", null, "Shift"),
            " to speed up. ",
            myCreateElement("b", null, "Ctrl"),
            " to speed down. ",
            myCreateElement("b", null, "Ctrl + Shift"),
            " to speed down more.",
            myCreateElement("br", null),
            "- Reset settings button adds history entry, so browser back button can be used to revert reset.",
            myCreateElement("br", null));
        const rangePower2 = inputRange2(rangePower, [-5, -4, -3, ...range(11).map(i => i / 10 - 2), ...range(10).map(i => i / 10 + 1), 2, 3, 4, 5,]);
        return { ret, btnResetSettings, btnToggleMode, btnToggleView, rangeSuperSamp, spanSuperSamp, rangeRenderMode, spanRenderMode, rangePower2, spanPower, rangeZLength, spanZLength, rangeMaxIters, spanMaxIters, rangeColSteps, spanColSteps, spanScale, juliaPlot, canvasGl, canvas2d, };
        function inc() { rangeMaxIters.max = `${+rangeMaxIters.max * 2}`; }
        function dec() { rangeMaxIters.max = `${+rangeMaxIters.max / 2}`; }
    }
    function inputRange2(el, values) {
        [el.min, el.max, el.step,] = ["0", `${values.length - 1}`, "1",];
        const oninput = delegate();
        el.oninput = () => oninput.invoke();
        return { getValue, setValue, oninput, };
        function getValue() { return values[+el.value]; }
        function setValue(n) {
            const idx = values.findIndex(n2 => n2 === n);
            if (idx >= 0)
                el.value = `${idx}`;
        }
    }
    function createJuliaPlot() {
        let cross;
        const el = myCreateElement("div", { style: { position: "relative", } },
            myCreateElement("span", { style: { display: "inline-block", position: "absolute", left: "535px", bottom: "20px", width: "50px", height: "50px", border: "1px solid #ccc", borderRadius: "100px", } }, cross = myCreateElement("span", { style: { position: "absolute", pointerEvents: "none", } }, "+")));
        return { el, setPos, };
        function setPos(x, y) {
            setStyle(cross, { left: `${25 + x * 25 - 5}px`, top: `${25 - y * 25 - 13}px`, });
        }
    }
    function fill() {
        // maybe sometime
        //		support phone
        //		animate change of power (without interval -1..1), fullscreen, edit palette
        //		enhance animation. animation is not smooth, when drawing is slow (part slow and part fast. as if animation handler get wrong time). take into account the expected rendering length. don't render frame 0. is it possible to interrupt rendering on gpu?
        //		creating flyovers
        // more fractals: http://usefuljs.net/fractals/docs/index.html, https://en.wikipedia.org/wiki/Mandelbrot_set
        // more implementations of float64: https://github.com/clickingbuttons/jeditrader/blob/a921a0e/shaders/src/fp64.wgsl (https://github.com/visgl/luma.gl/blob/291a2fdfb1cfdb15405032b3dcbfbe55133ead61/modules/shadertools/src/modules/math/fp64/fp64-arithmetic.glsl.ts)
        // sources
        //		https://matthias-research.github.io/pages/tenMinutePhysics
        //		https://gpfault.net/posts/mandelbrot-webgl.txt.html
        //		https://blog.cyclemap.link/2011-06-09-glsl-part2-emu, https://blog.cyclemap.link/2012-02-12-part5, https://www.davidhbailey.com/dhbsoftware
        const canvasGl = items.canvasGl;
        const canvas2d = items.canvas2d;
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
        async function update(t) {
            //if (lastUpdateTime)
            //	console.log(myRound(t - lastUpdateTime, 4));
            if (redraw) {
                redraw = false;
                lastUpdateTime = t;
                if (resizeCanvas(p.renderMode === 2 ? canvas2d : canvasGl))
                    return;
                if (p.renderMode === 2)
                    //const t = new Date();
                    await drawCpu();
                //console.log("redraw end", new Date().getTime() - t.getTime());
                else
                    drawGpu();
            }
            else
                lastUpdateTime = 0;
            requestAnimationFrame(update);
        }
        function resizeCanvas(canv) {
            const displayWidth = canv.clientWidth;
            const displayHeight = canv.clientHeight;
            if (displayWidth === 0 || displayHeight === 0) {
                redraw = true;
                requestAnimationFrame(update);
                return true;
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
                items.juliaPlot.el.style.display = p.drawMandelbrot ? "none" : null;
                items.btnToggleView.checked = !p.drawMono;
                items.rangeColSteps.disabled = p.drawMono;
                items.rangeSuperSamp.value = `${p.superSamp}`;
                items.spanSuperSamp.innerText = `${p.superSamp ** 2}`;
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
                writeTimeoutId = setTimeout(writeHashParams0, TSpan.fromSeconds(.2));
            }
            items.btnToggleMode.onclick = () => {
                p.drawMandelbrot = !p.drawMandelbrot;
                items.btnToggleMode.innerText = p.drawMandelbrot ? "Mandelbrot" : "Julia";
                items.juliaPlot.el.style.display = p.drawMandelbrot ? "none" : null;
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
                if (prev !== 2 && p.renderMode === 2) {
                    setStyle(canvasGl, { display: "none", });
                    setStyle(canvas2d, { display: null, });
                }
                if (prev === 2 && p.renderMode !== 2) {
                    setStyle(canvas2d, { display: "none", });
                    setStyle(canvasGl, { display: null, });
                }
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
            function setupInteraction2(canv) {
                new ResizeObserver(() => { redraw = true; }).observe(canv);
                let prevPos = { x: 0, y: 0, };
                setMouseTracking(canv, event => prevPos = eventPosToElement(event, canv), event => {
                    const pos = eventPosToElement(event, canv);
                    const dx = pos.x - prevPos.x;
                    const dy = -(pos.y - prevPos.y);
                    prevPos = pos;
                    const [left, right,] = [1, 2,].map(i => (event.buttons & i) === i);
                    if (left) {
                        p.centerX -= dx * p.scale;
                        p.centerY -= dy * p.scale;
                        redraw = true;
                        writeHashParams();
                    }
                    if (!p.drawMandelbrot && right) {
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
                }, () => { lastMouseUp = new Date(); });
                canv.oncontextmenu = () => false;
                let mousePos;
                document.addEventListener("mousemove", event => mousePos = event);
                let anim = null;
                let [againDir, againFast, againEvent,] = [0, false, { clientX: 0, clientY: 0, },];
                canv.addEventListener("wheel", event => {
                    event.preventDefault();
                    if (anim === null || anim === void 0 ? void 0 : anim.running())
                        [againDir, againFast, againEvent,] = [Math.sign(event.deltaY), event.shiftKey, event,];
                    else if (event.deltaY !== 0)
                        auxScale(Math.sign(event.deltaY), event.shiftKey, event);
                });
                async function auxScale(dir, fast, event) {
                    const prevScale = p.scale;
                    const clientRect = canv.getBoundingClientRect();
                    anim = animate2(p2 => {
                        const prevScale2 = p.scale;
                        p.scale = prevScale * 2 ** (dir * (fast ? 2 : 1) * p2);
                        items.spanScale.innerText = (p.scale * spanScaleMultiplier).toExponential(1);
                        const dx = Math.min(Math.max((mousePos !== null && mousePos !== void 0 ? mousePos : event).clientX - clientRect.left, 0), clientRect.width) - clientRect.width / 2;
                        const dy = -(Math.min(Math.max((mousePos !== null && mousePos !== void 0 ? mousePos : event).clientY - clientRect.top, 0), clientRect.height) - clientRect.height / 2);
                        p.centerX += dx * prevScale2 - dx * p.scale;
                        p.centerY += dy * prevScale2 - dy * p.scale;
                        redraw = true;
                        writeHashParams();
                    }, TSpan.fromSeconds(0.5), x => x); // bazierEase({ x: .0, y: .0, }, { x: 1., y: 1., }));
                    await anim.promise;
                    if (againDir !== 0) {
                        auxScale(againDir, againFast, againEvent);
                        againDir = 0;
                    }
                }
            }
        }
        function myRound(x, decimalPlaces = 14) { return Math.round(x * 10 ** decimalPlaces) / 10 ** decimalPlaces; }
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
            const gl = canvasGl.getContext("webgl2" /*, { powerPreference: "low-power", }*/);
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
        function createShader(gl, vertexShaderSrc, fragmentShaderSrc) {
            const vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, vertexShaderSrc);
            gl.compileShader(vertexShader);
            if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
                console.error("vertex shader compile error: " + gl.getShaderInfoLog(vertexShader));
            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, fragmentShaderSrc);
            gl.compileShader(fragmentShader);
            if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
                console.error("fragment shader compile error: " + gl.getShaderInfoLog(fragmentShader));
            const shader = gl.createProgram();
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
        function splitDouble(...v) {
            const arr = new Float32Array(v.length * 2);
            v.forEach((v2, i) => {
                arr[i * 2] = v2; // hi, same as Math.fround, https://stackoverflow.com/a/54472740/3877503
                arr[i * 2 + 1] = v2 - arr[i * 2]; // lo
            });
            return arr;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        async function drawCpu() {
            const ctx = canvas2d.getContext("2d", { willReadFrequently: true });
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
        function getItersNon2(x, y, x0, y0) {
            let rSqPrev = 0;
            for (let iters = 0; iters < p.maxIters; iters++) {
                const rSq = x * x + y * y;
                //if (rSq > zLength * zLength)
                if (iters > 0 && rSqPrev < rSq && rSq > p.zLength * p.zLength)
                    return iters;
                rSqPrev = rSq;
                const r = Math.pow(rSq, p.power / 2); // z^n = r^n * (cos fi*n + i sin fi*n)
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
                x = x * x - y * y + x0; // z^2 + c,  x^2-y^2 + 2xyi
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
        function getColor(iters) {
            return p.drawMono
                ? iters < p.maxIters ? [0, 0, 0,] : [255, 192, 0,]
                : iters < p.maxIters ? getGradientColor(iters) : [0, 0, 0,];
        }
    }
}
/// <reference path="csstype.d.ts" />
/// <reference path="react.d.ts" />
/// <reference path="tools.tsx" />
/// <reference path="19-julia-gl64.tsx" />
app();
function app() {
    setStyle(document.body, { padding: "30px 10px 20px 80px", });
    ac(document.body, myCreateElement("a", { href: "https://github.com/JakubHlavacek/fractals", style: { display: "block", float: "right", width: "24px", height: "24px", }, title: "GitHub", target: "_blank" }, githubIcon()));
    ac(document.body, t19_julia_gl64());
}
function githubIcon() {
    return myCreateElement("svg", { viewBox: "0 0 24 24" },
        myCreateElement("path", { fill: "#888", d: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" }));
}
//# sourceMappingURL=app.js.map