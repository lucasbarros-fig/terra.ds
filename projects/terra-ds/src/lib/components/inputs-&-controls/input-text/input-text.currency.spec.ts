import { describe, expect, it } from "vitest";
import {
	currencyFromFinancialInput,
	formatCurrencyDisplay,
} from "./input-text.currency";

describe("input-text.currency financial mask", () => {
	it("formats number to pt-BR display", () => {
		expect(formatCurrencyDisplay(12.34)).toBe("12,34");
		expect(formatCurrencyDisplay(1234.56)).toBe("1.234,56");
		expect(formatCurrencyDisplay(0)).toBe("0,00");
	});

	it("maps typed digits like ngx-currency Financial mode", () => {
		expect(currencyFromFinancialInput("1")).toEqual({
			display: "0,01",
			value: 0.01,
		});
		expect(currencyFromFinancialInput("12")).toEqual({
			display: "0,12",
			value: 0.12,
		});
		expect(currencyFromFinancialInput("1234")).toEqual({
			display: "12,34",
			value: 12.34,
		});
		expect(currencyFromFinancialInput("123456")).toEqual({
			display: "1.234,56",
			value: 1234.56,
		});
	});

	it("ignores separators already in the display string", () => {
		expect(currencyFromFinancialInput("12,34")).toEqual({
			display: "12,34",
			value: 12.34,
		});
		expect(currencyFromFinancialInput("1.234,56")).toEqual({
			display: "1.234,56",
			value: 1234.56,
		});
	});
});
