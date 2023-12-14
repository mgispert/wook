import Image from 'next/image';
import { UpdateBook, DeleteBook } from '@/app/ui/books/buttons';
import BookStatus from '@/app/ui/books/status';
// import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredBooks } from '@/app/lib/data';

export default async function BooksTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const books = await fetchFilteredBooks(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {books?.map((book) => (
              <div
                key={book.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      {/* <Image
                        src={book.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${book.title}'s profile picture`}
                      /> */}
                      <p>{book.title}</p>
                    </div>
                  </div>
                  <BookStatus status={book.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <UpdateBook id={book.id} />
                    <DeleteBook id={book.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Author
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Title
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Type
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {books?.map((book) => (
                <tr
                  key={book.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      {/* <Image
                        src={book.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${book.title}'s profile picture`}
                      /> */}
                      <p>{book.title}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <BookStatus status={book.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateBook id={book.id} />
                      <DeleteBook id={book.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
