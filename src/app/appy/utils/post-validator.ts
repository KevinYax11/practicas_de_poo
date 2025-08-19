import { Post } from './post';

export class PostValidator {
    validate(title: string, description: string, author: string): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!Post.isStringFields(title, description, author)) {
            errors.push('Invalid data types. Title, description and author must be strings.');
        }

        if (!Post.isValidTitle(title)) {
            errors.push('Invalid Title. Must be between 5 and 100 characters.');
        }

        if (!Post.isValidDescription(description)) {
            errors.push('Invalid Description. Must be between 10 and 500 characters.');
        }

        if (!Post.isValidAuthor(author)) {
            errors.push('Invalid Author. Each word must start with uppercase.');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
