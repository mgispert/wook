import { sql } from '@vercel/postgres';
import {
  AuthorField,
  AuthorsTableType,
  BookForm,
  BooksTable,
  LatestBookRaw,
  User,
  BooksRead,
} from './definitions';

export async function fetchBooksRead() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching books data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<BooksRead>`SELECT * FROM booksRead`;

    // console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch booksRead data.');
  }
}

export async function fetchLatestBookss() {
  try {
    const data = await sql<LatestBookRaw>`
      SELECT authors.name, authors.image_url, books.id
      FROM books
      JOIN authors ON books.author_id = authors.id
      ORDER BY books.title DESC
      LIMIT 5`;

    const latestBooks = data.rows.map((book) => ({
      ...book,
      title: book.title,
    }));
    return latestBooks;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest books.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const bookCountPromise = sql`SELECT COUNT(*) FROM books`;
    const authorCountPromise = sql`SELECT COUNT(*) FROM authors`;
    const bookStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'read' THEN END) AS "read",
         SUM(CASE WHEN status = 'TBR' THEN END) AS "TBR"
         FROM books`;

    const data = await Promise.all([
      bookCountPromise,
      authorCountPromise,
      bookStatusPromise,
    ]);

    const numberOfBooks = Number(data[0].rows[0].count ?? '0');
    const numberOfAuthors = Number(data[1].rows[0].count ?? '0');
    const totalReadBooks = data[2].rows[0].read ?? '0';
    const totalTBRBooks = data[2].rows[0].TBR ?? '0';

    return {
      numberOfBooks,
      numberOfAuthors,
      totalReadBooks,
      totalTBRBooks,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredBooks(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const books = await sql<BooksTable>`
      SELECT
        books.id,
        books.status,
        books.type,
        books.title,
        authors.name,
        authors.image_url
      FROM books
      JOIN authors ON books.author_id = authors.id
      WHERE
        authors.name ILIKE ${`%${query}%`} OR
        books.status ILIKE ${`%${query}%`}
      ORDER BY books.title DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return books.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch books.');
  }
}

export async function fetchBooksPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM books
    JOIN authors ON books.author_id = authors.id
    WHERE
      authors.name ILIKE ${`%${query}%`} OR
      books.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of books.');
  }
}

export async function fetchBookById(id: string) {
  try {
    const data = await sql<BookForm>`
      SELECT
        books.id,
        books.author_id,
        books.status
      FROM books
      WHERE books.id = ${id};
    `;

    const book = data.rows.map((book) => ({
      ...book,
    }));

    return book[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch book.');
  }
}

export async function fetchAuthors() {
  try {
    const data = await sql<AuthorField>`
      SELECT
        id,
        name
      FROM authors
      ORDER BY name ASC
    `;

    const authors = data.rows;
    return authors;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all authors.');
  }
}

export async function fetchFilteredauthors(query: string) {
  try {
    const data = await sql<AuthorsTableType>`
		SELECT
		  authors.id,
		  authors.name,
		  authors.image_url,
		  COUNT(books.id) AS total_books,
		  SUM(CASE WHEN books.status = 'TBR' THEN END) AS total_TBR,
		  SUM(CASE WHEN books.status = 'read' THEN END) AS total_read
		FROM authors
		LEFT JOIN books ON authors.id = books.author_id
		WHERE
		  authors.name ILIKE ${`%${query}%`}
		GROUP BY authors.id, authors.name, authors.image_url
		ORDER BY authors.name ASC
	  `;

    const authors = data.rows.map((author) => ({
      ...author,
      total_TBR: author.total_TBR,
      total_read: author.total_read,
    }));

    return authors;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch author table.');
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
