import { PostTitle } from './post-title';
import { PostDescription } from './post-description';
import { PostAuthor } from './post-author';

export class PostValidator {
    validate(title: string, description: string, author: string): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        try {
            PostTitle.create(title);
        } catch (error) {
            errors.push(error instanceof Error ? error.message : 'Invalid Title');
        }

        try {
            PostDescription.create(description);
        } catch (error) {
            errors.push(error instanceof Error ? error.message : 'Invalid Description');
        }

        try {
            PostAuthor.create(author);
        } catch (error) {
            errors.push(error instanceof Error ? error.message : 'Invalid Author');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}