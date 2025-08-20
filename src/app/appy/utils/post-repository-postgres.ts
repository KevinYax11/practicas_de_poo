import { Post } from './post';
import { sql } from '@vercel/postgres';

export class PostRepositoryPostgres {
    private sql = sql;

    async save(post: Post): Promise<void> {
        await this.sql`
            INSERT INTO post (title, description, author)
            VALUES (${post.getTitle()}, ${post.getDescription()}, ${post.getAuthor()})
        `;
    }

    async findAll(): Promise<Post[]> {
        const result = await this.sql`SELECT * FROM post`;
        return result.rows.map(row => Post.withId(row.id, row.title, row.description, row.author));
    }

    async findById(id: string): Promise<Post | null> {
        const result = await this.sql`SELECT * FROM post WHERE id = ${id} LIMIT 1`;
        if (result.rowCount === 0) return null;
        const row = result.rows[0];
        return Post.withId(row.id, row.title, row.description, row.author);
    }

    async update(id: string, post: Post): Promise<void> {
        const result = await this.sql`
            UPDATE post
            SET title = ${post.getTitle()},
                description = ${post.getDescription()},
                author = ${post.getAuthor()}
            WHERE id = ${id}
            RETURNING id
        `;

        if (result.rowCount === 0) {
            throw new Error('Post not found');
        }
    }
}
