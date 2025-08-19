import postgres from 'postgres';
import { Post } from './post';
import { PostRepositoryInterface } from './post-repository-interface';

export class PostRepositoryPostgres implements PostRepositoryInterface {
    private sql = postgres('postgresql://postgres.oholxxvzhdkelmjcgxpq:cFZfgXDrI6tdwuIB@aws-1-us-east-2.pooler.supabase.com:6543/postgres');

    async save(post: Post): Promise<void> {
        await this.sql`
            INSERT INTO post (title, description, author)
            VALUES (${post.getTitle()}, ${post.getDescription()}, ${post.getAuthor()})
        `;
        console.log('Data inserted successfully in PostgreSQL');
    }

    async findAll(): Promise<Post[]> {
        const result = await this.sql`SELECT * FROM post`;
        return result.map(row => Post.create(row.title, row.description, row.author));
    }

    async findById(id: string): Promise<Post | null> {
        const result = await this.sql`SELECT * FROM post WHERE id = ${id}`;
        if (result.length === 0) return null;
        return Post.create(result[0].title, result[0].description, result[0].author);
    }
}
