import { PostValidator } from './post-validator';
import { Post } from './post';
import { PostRepositoryInterface } from './post-repository-interface';

export class PostRegistrer {
    constructor(
        private postValidator: PostValidator,
        private postRepository: PostRepositoryInterface
    ) {}

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
            await this.postRepository.save(post);
            return {
                success: true,
                message: 'Post registered successfully'
            };
        } catch (error) {
            console.error('Database error:', error);
            return {
                success: false,
                message: 'Error saving data to repository',
                errors: [String(error)]
            };
        }
    }
}
