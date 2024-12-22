
import { z, ZodError, ZodRawShape } from "zod";
import { Availability, DaySlug } from ".";

export class Validator<T> {

    data: T;
    rules: ZodRawShape;
    errors: Partial<Record<keyof T, string>> = {};
    private isValidData: boolean = false;

    constructor(data: T, rules: ZodRawShape) {
        this.data = data;
        this.rules = rules;
    }

    async validate(): Promise<boolean> {

        // If we are not picking any values, validate everything.
        let zodValidator: any = z.object(this.rules);

        try {
            await zodValidator.parseAsync(this.data);
            this.isValidData = true;
            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors: Partial<Record<keyof T, string>> = {};
                for (const { path, message } of error.errors) {
                    fieldErrors[path[0] as keyof T] = message;
                }


                this.errors = fieldErrors;
            }
            this.isValidData = false;
            return false;
        }
    }

    async refine(callback: (data: T) => Promise<void>): Promise<void> {
        await callback(this.data)
    }

    addIssue(key: keyof T, message: string): void {
        this.errors[key] = message;
        this.isValidData = false;
    }

    isValid(): boolean { return this.isValidData; }
};

export const isValidAvailablity = (value: any) => {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const availability: Availability = value;

    for (const key in availability) {
        const value: string[] = availability[key as DaySlug];

        // We need at least 1
        if (value.length > 0) return true;
    }

    return false;
};