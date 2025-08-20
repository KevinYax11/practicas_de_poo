import { Post } from './post';
import { PostRepositoryInterface } from './post-repository-interface';

export class PostRepositoryInMemory implements PostRepositoryInterface {
    private posts: Post[] = [];

    async save(post: Post): Promise<void> {
        this.posts.push(post);
        console.log('Data saved in memory');
    }

    async findAll(): Promise<Post[]> {
        return [...this.posts];
    }

    async findById(id: string): Promise<Post | null> {
        return this.posts[parseInt(id)] || null;
    }

    async update(id: string, post: Post): Promise<void> {
        const index = parseInt(id);
        if (this.posts[index]) {
            this.posts[index] = post;
        } else {
            throw new Error('Post not found');
        }
    }
}
