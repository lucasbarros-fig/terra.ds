/** Máscara financeira pt-BR (modo caixa: digitar `1234` → `12,34`). */

export function formatCurrencyDisplay(value: number): string {
	const safe = Number.isFinite(value) ? value : 0;
	const [integerPart, decimalPart] = Math.abs(safe).toFixed(2).split(".");
	const withThousands = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	const sign = safe < 0 ? "-" : "";
	return `${sign}${withThousands},${decimalPart}`;
}

export function currencyFromFinancialInput(raw: string | number): {
	display: string;
	value: number;
} {
	if (typeof raw === "number") {
		const value = Number.isFinite(raw) ? raw : 0;
		return { display: formatCurrencyDisplay(value), value };
	}

	const digits = String(raw ?? "").replace(/\D/g, "");
	const cents = digits ? Number(digits) : 0;
	const value = cents / 100;
	return { display: formatCurrencyDisplay(value), value };
}
