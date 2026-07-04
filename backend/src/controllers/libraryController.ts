import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { IssueStatus } from '@prisma/client';

export async function getAllBooks(req: Request, res: Response, next: NextFunction) {
  try {
    const books = await prisma.libraryBook.findMany({
      orderBy: { title: 'asc' }
    });
    return res.status(200).json(books);
  } catch (error) {
    next(error);
  }
}

export async function createBook(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, author, isbn, quantity, location } = req.body;
    if (!title || !author || !isbn || !quantity) {
      return res.status(400).json({ message: 'Title, author, isbn, and quantity are required.' });
    }

    const book = await prisma.libraryBook.create({
      data: {
        title,
        author,
        isbn,
        quantity: parseInt(quantity, 10),
        availableQuantity: parseInt(quantity, 10),
        location,
      }
    });

    return res.status(201).json(book);
  } catch (error) {
    next(error);
  }
}

export async function updateBook(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { title, author, isbn, quantity, location } = req.body;

    const currentBook = await prisma.libraryBook.findUnique({ where: { id } });
    if (!currentBook) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    const qtyDiff = parseInt(quantity, 10) - currentBook.quantity;
    const newAvailable = currentBook.availableQuantity + qtyDiff;

    if (newAvailable < 0) {
      return res.status(400).json({ message: 'Cannot reduce quantity below currently issued books.' });
    }

    const updated = await prisma.libraryBook.update({
      where: { id },
      data: {
        title,
        author,
        isbn,
        quantity: parseInt(quantity, 10),
        availableQuantity: newAvailable,
        location,
      }
    });

    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
}

export async function deleteBook(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.libraryBook.delete({ where: { id } });
    return res.status(200).json({ message: 'Book deleted successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function getLibraryIssues(req: Request, res: Response, next: NextFunction) {
  try {
    const issues = await prisma.bookIssue.findMany({
      include: {
        book: true,
        student: {
          include: {
            user: { select: { name: true } }
          }
        }
      },
      orderBy: { issueDate: 'desc' }
    });
    return res.status(200).json(issues);
  } catch (error) {
    next(error);
  }
}

export async function issueBook(req: Request, res: Response, next: NextFunction) {
  try {
    const { bookId, studentId, dueDate } = req.body;
    if (!bookId || !studentId || !dueDate) {
      return res.status(400).json({ message: 'BookId, studentId, and dueDate are required.' });
    }

    const book = await prisma.libraryBook.findUnique({ where: { id: bookId } });
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    if (book.availableQuantity <= 0) {
      return res.status(400).json({ message: 'This book is currently out of stock.' });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Decrement available count
      await tx.libraryBook.update({
        where: { id: bookId },
        data: { availableQuantity: book.availableQuantity - 1 }
      });

      // Create issue entry
      const issue = await tx.bookIssue.create({
        data: {
          bookId,
          studentId,
          dueDate: new Date(dueDate),
          status: IssueStatus.ISSUED
        },
        include: {
          book: true
        }
      });
      return issue;
    });

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function returnBook(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params; // BookIssue ID

    const issue = await prisma.bookIssue.findUnique({
      where: { id },
      include: { book: true }
    });

    if (!issue) {
      return res.status(404).json({ message: 'Book issue record not found.' });
    }

    if (issue.status === IssueStatus.RETURNED) {
      return res.status(400).json({ message: 'Book has already been returned.' });
    }

    const returnDate = new Date();
    const dueDate = new Date(issue.dueDate);
    let fineAmount = 0;

    // Standard daily fine calculation: e.g. 10 rupees per day overdue
    if (returnDate.getTime() > dueDate.getTime()) {
      const diffTime = Math.abs(returnDate.getTime() - dueDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fineAmount = diffDays * 10.0;
    }

    const result = await prisma.$transaction(async (tx) => {
      // Increment available count
      await tx.libraryBook.update({
        where: { id: issue.bookId },
        data: { availableQuantity: issue.book.availableQuantity + 1 }
      });

      // Update issue record
      const updatedIssue = await tx.bookIssue.update({
        where: { id },
        data: {
          returnDate,
          status: IssueStatus.RETURNED,
          fineAmount
        },
        include: {
          book: true
        }
      });
      return updatedIssue;
    });

    return res.status(200).json({
      message: 'Book returned successfully.',
      fineAmount,
      issue: result
    });
  } catch (error) {
    next(error);
  }
}
