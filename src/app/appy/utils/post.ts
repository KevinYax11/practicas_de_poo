export class Post {
    constructor(
        public title: string,
        public description: string,
        public author: string
    ) {}

    static isStringFields(title: any, description: any, author: any): boolean {
        return typeof title === 'string' && typeof description === 'string' && typeof author === 'string';
    }

    static isValidTitle(title: string): boolean {
        const t = title.trim();
        return t.length >= 5 && t.length <= 100;
    }

    static isValidDescription(description: string): boolean {
        const d = description.trim();
        return d.length >= 10 && d.length <= 500;
    }

    static isValidAuthor(author: string): boolean {
        if (!author || author.trim().length === 0) return false;
        const words = author.trim().split(" ");
        return words.every(word => word[0] === word[0].toUpperCase());
    }
}
