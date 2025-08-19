import { Post } from './post';

export interface PostRepositoryInterface {
    save(post: Post): Promise<void>;
    findAll(): Promise<Post[]>;
    findById(id: string): Promise<Post | null>;
}
