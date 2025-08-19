import postgres from 'postgres';
import { PostValidator } from './post-validator';
import { Post } from './post';

export class PostRegistrer {
    private sql = postgres('postgresql://postgres.oholxxvzhdkelmjcgxpq:cFZfgXDrI6tdwuIB@aws-1-us-east-2.pooler.supabase.com:6543/postgres');

    constructor(private postValidator: PostValidator) {}

    async register(title: string, description: string, author: string): Promise<{ success: boolean; message: string; errors?: string[] }> {
        const validation = this.postValidator.validate(title, description, author);

        if (!validation.isValid) {
            return {
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            };
        }

        const post = Post.create(title, description, author);

        try {
            await this.sql`INSERT INTO post (title, description, author) VALUES (${post.getTitle()}, ${post.getDescription()}, ${post.getAuthor()})`;
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
