const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User1',
    email: 'user1@nextmail.com',
    password: '123456',
  },
  {
    id: '62018bf3-8651-4e01-837f-33c7800d9e4a',
    name: 'User2',
    email: 'user2@nextmail.com',
    password: 'password123',
  },
];

const authors = [
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Rick Riordan',
    image_url: '../../public/rick.jpg',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442b',
    name: 'J.C Cervantes',
    image_url: '../../public/cervantes.jpeg',
  },
  {
    id: '3958dc9e-737f-4377-85e9-fec4b6a6442c',
    name: 'Roshani Chokshi',
    image_url: '../../public/roshani.jpg',
  },
];

const books = [
  {
    id: 'some-unique-id-1',
    author_id: authors[0].id,
    title: 'The Kane Chronicles 1',
    type: 'paperback',
    status: 'read',
  },
  {
    id: 'some-unique-id-2',
    author_id: authors[1].id,
    title: 'Storm Runner',
    type: 'paperback',
    status: 'read',
  },
];

const booksRead = [
  { month: 'Jan', books: 6 },
  { month: 'Feb', books: 5 },
  { month: 'Mar', books: 4 },
  { month: 'Apr', books: 7 },
  { month: 'May', books: 9 },
  { month: 'Jun', books: 11 },
  { month: 'Jul', books: 16 },
  { month: 'Aug', books: 19 },
  { month: 'Sep', books: 13 },
  { month: 'Oct', books: 10 },
  { month: 'Nov', books: 7 },
  { month: 'Dec', books: 3 },
];

module.exports = {
  users,
  authors,
  books,
  booksRead,
};
