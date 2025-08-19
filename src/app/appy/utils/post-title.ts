export class PostTitle {
    private constructor(private readonly value: string) {}

    static create(title: string): PostTitle {
        if (typeof title !== 'string' || title.trim().length < 5 || title.trim().length > 100) {
            throw new Error('Invalid Title. Must be between 5 and 100 characters.');
        }
        return new PostTitle(title.trim());
    }

    getValue(): string {
        return this.value;
    }
}
