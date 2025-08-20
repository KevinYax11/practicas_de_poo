import { PostTitle } from './post-title';
import { PostDescription } from './post-description';
import { PostAuthor } from './post-author';

export class Post {
    private constructor(
        private id: string | null,
        private title: PostTitle,
        private description: PostDescription,
        private author: PostAuthor
    ) {}

    static create(title: string, description: string, author: string): Post {
        const postTitle = PostTitle.create(title);
        const postDescription = PostDescription.create(description);
        const postAuthor = PostAuthor.create(author);

        return new Post(null, postTitle, postDescription, postAuthor);
    }

    static withId(id: string, title: string, description: string, author: string): Post {
        return new Post(
            id,
            PostTitle.create(title),
            PostDescription.create(description),
            PostAuthor.create(author)
        );
    }

    getId(): string | null {
        return this.id;
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
