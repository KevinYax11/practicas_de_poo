import postgres from 'postgres';
import { Post } from './post';
import { PostValidator } from './post-validator';

export class PostRegistrer {
    private sql = postgres('postgresql://postgres.oholxxvzhdkelmjcgxpq:cFZfgXDrI6tdwuIB@aws-1-us-east-2.pooler.supabase.com:6543/postgres');
    
    constructor(private postValidator: PostValidator) {}

    async register(title: string, description: string, author: string): Promise<{ success: boolean; message: string; errors?: string[] }> {
        console.log('Received Title: ', title);
        console.log('Received Description: ', description);
        console.log('Received Author: ', author);

        const validation = this.postValidator.validate(title, description, author);

        if (!validation.isValid) {
            return {
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            };
        }

        const post = new Post(title, description, author);

        try {
            await this.sql`INSERT INTO post (title, description, author) VALUES (${post.title}, ${post.description}, ${post.author})`;
            console.log('Data inserted successfully');
            return {
                success: true,
                message: 'Post registered successfully'
            };
        } catch (error) {
            console.error('Database error:', error);
            return {
                success: false,
                message: 'Error saving data to database',
                errors: [String(error)]
            };
        }
    }
}
