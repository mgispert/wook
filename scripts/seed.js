const { db } = require('@vercel/postgres');
const { books, authors, booksRead, users } = require('../app/lib/db-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedBooks(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "Books" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS books (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id UUID NOT NULL,
    status VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
  );
`;

    console.log(`Created "books" table`);

    // Insert data into the "books" table
    const insertedBooks = await Promise.all(
      books.map(
        (book) => client.sql`
          INSERT INTO books (id, title, author_id, status, type)
          VALUES (${book.id}, ${book.title}, ${book.author_id}, ${book.status}, ${book.type})
          ON CONFLICT (id) DO NOTHING;
        `,
      ),
    );

    console.log(`Seeded ${insertedBooks.length} books`);

    return {
      createTable,
      books: insertedBooks,
    };
  } catch (error) {
    console.error('Error seeding books:', error);
    throw error;
  }
}

async function seedAuthors(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "authors" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS authors (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "authors" table`);

    // Insert data into the "authors" table
    const insertedAuthors = await Promise.all(
      authors.map(
        (author) => client.sql`
        INSERT INTO authors (id, name,image_url)
        VALUES (${author.id}, ${author.name}, ${author.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedAuthors.length} authors`);

    return {
      createTable,
      authors: insertedAuthors,
    };
  } catch (error) {
    console.error('Error seeding authors:', error);
    throw error;
  }
}

async function seedBooksRead(client) {
  try {
    // Create the "booksRead" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS booksRead (
        month VARCHAR(4) NOT NULL UNIQUE,
        books INT NOT NULL
      );
    `;

    console.log(`Created "booksRead" table`);

    // Insert data into the "booksRead" table
    const insertedBooksRead = await Promise.all(
      booksRead.map(
        (booksRead) => client.sql`
        INSERT INTO booksRead (month, book)
        VALUES (${booksRead.month}, ${booksRead.books})
        ON CONFLICT (month) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedBooksRead.length} booksRead`);

    return {
      createTable,
      booksRead: insertedBooksRead,
    };
  } catch (error) {
    console.error('Error seeding booksRead:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedAuthors(client);
  await seedBooks(client);
  await seedBooksRead(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
