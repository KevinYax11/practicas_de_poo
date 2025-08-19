export class PostDescription {
    private constructor(private readonly value: string) {}

    static create(description: string): PostDescription {
        if (typeof description !== 'string' || description.trim().length < 10 || description.trim().length > 500) {
            throw new Error('Invalid Description. Must be between 10 and 500 characters.');
        }
        return new PostDescription(description.trim());
    }

    getValue(): string {
        return this.value;
    }
}
