export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Author = {
  id: string;
  name: string;
  image_url: string;
};

export type Book = {
  id: string;
  title: string;
  author_id: string;
  status: 'read' | 'TBR';
  type: 'paperback' | 'kindle';
};

export type BooksRead = {
  month: string;
  book: number;
};

export type LatestBook = {
  id: string;
  title: string;
  type: 'paperback' | 'kindle';
  status: 'read' | 'TBR';
};

export type LatestBookRaw = Omit<LatestBook, 'title'> & {
  title: string;
};

export type BooksTable = {
  id: string;
  author_id: string;
  title: string;
  image_url: string;
  type: 'paperback' | 'kindle';
  status: 'read' | 'TBR';
};

export type AuthorsTableType = {
  id: string;
  name: string;
  image_url: string;
  total_books: number;
  total_TBR: number;
  total_read: number;
};

export type FormattedAuthorsTable = {
  id: string;
  name: string;
  image_url: string;
  total_books: number;
  total_TBR: string;
  total_read: string;
};

export type AuthorField = {
  id: string;
  name: string;
};

export type BookForm = {
  id: string;
  author_id: string;
  type: 'paperback' | 'kindle';
  status: 'TBR' | 'read';
};
