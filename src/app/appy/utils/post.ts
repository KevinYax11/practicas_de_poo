import { PostTitle } from './post-title';
import { PostDescription } from './post-description';
import { PostAuthor } from './post-author';

export class Post {
    constructor(
        private title: PostTitle,
        private description: PostDescription,
        private author: PostAuthor
    ) {}

    static create(title: string, description: string, author: string): Post {
        const postTitle = PostTitle.create(title);
        const postDescription = PostDescription.create(description);
        const postAuthor = PostAuthor.create(author);

        return new Post(postTitle, postDescription, postAuthor);
    }

    getTitle(): string {
        return this.title.getValue();
    }

    getDescription(): string {
        return this.description.getValue();
    }

    getAuthor(): string {
        return this.author.getValue();
    }
}