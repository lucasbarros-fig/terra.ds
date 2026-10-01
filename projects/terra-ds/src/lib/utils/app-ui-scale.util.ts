const APP_UI_SCALE_VAR = "--app-ui-scale";

export function readAppUiScale(doc?: Document | null): number {
	const root = doc?.documentElement;
	if (!root) {
		return 1;
	}

	const raw = getComputedStyle(root).getPropertyValue(APP_UI_SCALE_VAR).trim();
	const scale = Number.parseFloat(raw);

	return Number.isFinite(scale) && scale > 0 ? scale : 1;
}

export function resolveOverlayPanelMinWidth(triggerElement: HTMLElement): number {
	const visualWidth = triggerElement.getBoundingClientRect().width;

	if (!Number.isFinite(visualWidth) || visualWidth <= 0) {
		return triggerElement.offsetWidth;
	}

	const scale = readAppUiScale(triggerElement.ownerDocument);
	const layoutWidth = scale === 1 ? visualWidth : visualWidth / scale;

	return Math.round(layoutWidth * 100) / 100;
}
