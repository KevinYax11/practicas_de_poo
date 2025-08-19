export class PostAuthor {
    private constructor(private readonly value: string) {}

    static create(author: string): PostAuthor {
        const authorRegex = /^[A-ZÁÉÍÓÚÑÜ][A-Za-záéíóúñü'\-.]+(?: [A-Za-záéíóúñü'\-\.]+)*$/;
        if (typeof author !== 'string' || !authorRegex.test(author.trim())) {
            throw new Error('Invalid Author. Each word must start with uppercase.');
        }
        return new PostAuthor(author.trim());
    }

    getValue(): string {
        return this.value;
    }
}
