



function isNullOrUndefined<T>(o: T | null | undefined): o is null | undefined { return o === undefined || o === null; }		// https://stackoverflow.com/a/52097700/3877503
function isNullOrEmpty(s: string | null | undefined): s is null | undefined | "" { return isNullOrUndefined(s) || s.length === 0; }

////type TFunc<Ret> = () => Ret;
//type TFunc1<A, Ret> = (a: A) => Ret;
type TFunc2<A1, A2, Ret> = (a1: A1, a2: A2) => Ret;
function toDictionary<T, TKey extends keyof any, TValue>(arr: T[], keySelector: TFunc2<T, number, TKey>, valueSelector: TFunc2<T, number, TValue>) {
	const ret: Record<TKey, TValue> = {} as Record<TKey, TValue>;
	arr.forEach((p, i) => ret[keySelector(p, i)] = valueSelector(p, i));
	return ret;
}


function linInp(x: number, xFrom: number, xTo: number, yFrom: number, yTo: number) { return (x - xFrom) / (xTo - xFrom) * (yTo - yFrom) + yFrom; }

function range(n: number) { return Array(n).fill(0).map((_, i) => i); }




function setAttr(element: Element, attrs: { [k: string]: string | number | boolean | (() => any) | React.CSSProperties }) {
	Object.keys(attrs).forEach(k => {
		const v = attrs[k];
		//if (element.hasAttribute(k) && typeof v === "string")
		//	element.setAttribute(k, v);
		//else
		if (!(k in element))
			console.error(`${k} is not a valid property of a <${element.tagName}>`);
		else if (typeof v === "string")
			(element as any)[k] = v;
		else if (typeof v === "number")
			(element as any)[k] = v.toString();
		else if (v === undefined) { }
		else if (v === null)
			console.error(`${v} is not a valid property value, <${element.tagName} ${k}={${v}}>`);
		else if (typeof v === "object")
			Object.keys(v).forEach(k2 => {
				if (k2 in (element as any)[k])
					(element as any)[k][k2] = (v as any)[k2];
				else
					console.error(`${k2} is not a valid ${k} for a <${element.tagName} ${k}='..'>`);
			});
		else if (typeof v === "boolean" && typeof (element as any)[k] === "boolean")
			(element as any)[k] = v;
		else if (typeof v === "function" && ["onclick", "onmouseenter", "onchange", "ontouchstart", "ontouchend", "onkeypress", "onload", "onerror",].indexOf(k) !== -1)
			(element as any)[k] = v;
		else
			console.error(`${v} is not a valid property value of a <${element.tagName} ${k}=..>`, v);
	});
}
function setStyle(element: HTMLElement, styles: React.CSSProperties) {
	setAttr(element, { style: styles });
}
function setAttrSvg(element: SVGElement, attrs: { [k: string]: string | number | boolean | (() => any) | React.CSSProperties }) {
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
				if (k2 in (element as any)[k])
					(element as any)[k][k2] = (v as any)[k2];
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


type TChild = string | number | Node | TChild[];
function ac<T extends Element>(element: T, ...children: TChild[]) {
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
			console.warn(`${c} is not a valid child of a <${element.tagName}>`, c);	// ${new Error().stack}
	});
	return element;
}


function myCreateElement<T extends keyof HTMLElementTagNameMap/*, U*/>(tag: T/* | ((props: any) => U)*/, attrs: { [k: string]: string | number | boolean | (() => any) | React.CSSProperties } | null, ...children: TChild[]) {
	//if (typeof tag === "function")
	//	return tag({ ...attrs, children });
	if (["svg", "path", "circle", "rect", "polyline", "text", "g", "clipPath", "defs", "filter", "feGaussianBlur",].indexOf(tag) >= 0) {
		const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
		if (attrs !== null)
			setAttrSvg(element, attrs);
		return ac(element, ...children);
	} else {
		const element = document.createElement(tag);
		if (attrs !== null)
			setAttr(element, attrs);
		return ac(element, ...children);
	}
}


function replaceContent(parent: HTMLElement, ...newContent: TChild[]) {
	parent.innerText = "";
	ac(parent, newContent);
}


//type TDelegate = ReturnType<typeof delegate>;
type TAction = () => void;
type TAction1<T> = (arg1: T) => void;
function delegate() {
	const arr: TAction[] = [];
	return { add, invoke, clear, };
	function add(f: TAction) { arr.push(f); }
	function invoke() { arr.forEach(f => f()); }
	function clear() { arr.splice(0); }
}

function outerPromise<T>() {
	let resolve2: TAction1<T>;
	const promise = new Promise<T>((resolve, reject) => resolve2 = resolve);
	return { promise, resolve: resolve2!, };
}


function isTouchEvent(e: MouseEvent | PointerEvent | TouchEvent): e is TouchEvent { return (e as TouchEvent).touches !== undefined; }
function addEventListener2<T extends Event>(elem: Node, types: string, fn: (event: T) => void, options = false) { types.split(" ").forEach(type => elem.addEventListener(type, fn as EventListener, options)); }
function removeEventListener2<T extends Event>(elem: Node, types: string, fn: (event: T) => void, options = false) { types.split(" ").forEach(type => elem.removeEventListener(type, fn as EventListener, options)); }
function setMouseTracking(elem: HTMLElement, ondown: (event: PointerEvent | TouchEvent) => void, onmove: (event: PointerEvent | TouchEvent) => void, onup: (event: PointerEvent | TouchEvent) => void) {
	addEventListener2(elem, "pointerdown touchstart", (e: PointerEvent | TouchEvent) => {
		e.preventDefault();
		//console.log(e.type + "-" + (e as PointerEvent).pointerType);
		if ((e as PointerEvent).pointerType === "touch")
			return;
		ondown(e);
		addEventListener2(document, "pointermove touchmove", onmove2);
		addEventListener2(document, "pointerup touchend", onup2);
	});
	function onmove2(e: PointerEvent | TouchEvent) {
		e.preventDefault();
		//console.log(e.type + "-" + (e as PointerEvent).pointerType);
		if ((e as PointerEvent).pointerType === "touch")
			return;
		onmove(e);
	}
	function onup2(e: PointerEvent | TouchEvent) {
		e.preventDefault();
		//console.log(e.type + "-" + (e as PointerEvent).pointerType);
		if ((e as PointerEvent).pointerType === "touch")
			return;
		if (!isTouchEvent(e) || e.touches.length === 0) {
			onup(e);
			removeEventListener2(document, "pointermove touchmove", onmove2);
			removeEventListener2(document, "pointerup touchend", onup2);
		}
	}
}
function eventPosToElement(e: MouseEvent | PointerEvent | TouchEvent, elem: HTMLElement) {
	const rect = elem.getBoundingClientRect();
	const pos = isTouchEvent(e) ? {
		clientX: avg(range(e.touches.length).map(i => e.touches[i].clientX)),
		clientY: avg(range(e.touches.length).map(i => e.touches[i].clientY)),
	} : e;
	return { x: pos.clientX - rect.left, y: pos.clientY - rect.top, };
	function avg(a: number[]) { return a.reduce((prev, cur) => prev + cur) / a.length; }
}


class TSpan {
	private static readonly second = 1000;
	private static readonly minute = 60 * TSpan.second;
	private static readonly hour = 60 * TSpan.minute;
	private static readonly day = 24 * TSpan.hour;
	private static readonly month = 31 * TSpan.day;
	private static readonly year = 365 * TSpan.day;
	public static fromSeconds(n: number) { return TSpan.second * n; }
	public static fromMinutes(n: number) { return TSpan.minute * n; }
	public static fromHours(n: number) { return TSpan.hour * n; }
	public static fromDays(n: number) { return TSpan.day * n; }
	public static fromMonths(n: number) { return TSpan.month * n; }
	public static fromYears(n: number) { return TSpan.year * n; }
	public static toHms(span_ms: number) {
		const ms = span_ms % 1000; span_ms = Math.round((span_ms - ms) / 1000);
		const s = span_ms % 60; span_ms = Math.round((span_ms - s) / 60);
		const m = span_ms % 60; span_ms = Math.round((span_ms - m) / 60);
		const h = span_ms;
		return { h, m, s, ms, };
	}
}



function readHashParam<T>(name: string, parse: (s: string) => T, isValid: (v: T) => boolean, assign: (v: T) => void) {
	const pars = toDictionary(window.location.hash.substring(1).split("&").map(p => p.split("=")), p => p[0], p => p[1]);
	if (pars[name] === undefined) return;
	const parsed = parse(pars[name]);
	if (!isValid(parsed)) return;
	assign(parsed);
}
function readHashParamDef<T>(name: string, parse: (s: string) => T, isValid: (v: T) => boolean, default2: T) {
	let ret = default2;
	readHashParam(name, parse, isValid, v => ret = v);
	return ret;
}





// https://javascript.info/js-animation, https://cubic-bezier.com
async function animate(draw: (progress: number) => void, duration = TSpan.fromSeconds(.2), timing = bazierEase({ x: .25, y: .1, }, { x: .25, y: 1, })) {
	draw(timing(0));
	const start = await requestAnimationFrameA();	// performance.now: https://stackoverflow.com/questions/38360250
	while (true) {
		const time = await requestAnimationFrameA();
		const timeFraction = Math.min((time - start) / duration, 1);
		draw(timing(timeFraction));
		if (timeFraction === 1)
			break;
	}
}
function animate2(draw: (progress: number) => void, duration = TSpan.fromSeconds(.2), timing = bazierEase({ x: .25, y: .1, }, { x: .25, y: 1, })) {
	const outerPromise2 = outerPromise<void>();
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
	return new Promise<number>((resolve, reject) => requestAnimationFrame(resolve));
}



function bazierEase(p1: { x: number, y: number, }, p2: { x: number, y: number, }) {

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

	return (fraction: number) => {
		const iLeft = Math.min(Math.max(Math.floor(fraction / stepArr), 0), arr.length - 2);
		return linInp(fraction, iLeft * stepArr, (iLeft + 1) * stepArr, arr[iLeft], arr[iLeft + 1]);
	};

	// https://stackoverflow.com/questions/16227300, https://github.com/gre/bezier-easing/blob/master/src/index.js
	function bezierEase0(p1: { x: number, y: number, }, p2: { x: number, y: number, }) {
		const cX = 3 * p1.x;							// const cX = 3 * (p1.x - p0.x);
		const cY = 3 * p1.y;							// const cY = 3 * (p1.y - p0.y);
		const bX = 3 * (p2.x - p1.x) - cX;				// const bX = 3 * (p2.x - p1.x) - cX;
		const bY = 3 * (p2.y - p1.y) - cY;				// const bY = 3 * (p2.y - p1.y) - cY;
		const aX = 1 - cX - bX;							// const aX = p3.x - p0.x - cX - bX;
		const aY = 1 - cY - bY;							// const aY = p3.y - p0.y - cY - bY;
		return (t: number) => {
			const x = ((aX * t + bX) * t + cX) * t;		// const x = ((aX * t + bX) * t + cX) * t + p0.x;
			const y = ((aY * t + bY) * t + cY) * t;		// const y = ((aY * t + bY) * t + cY) * t + p0.y;
			return { x, y, };
		};
	}
}


