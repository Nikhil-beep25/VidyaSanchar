-- Run idempotent checks to update the Payment table safely
DO $$
BEGIN
    -- Rename paymentDate to createdAt if paymentDate exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'Payment' AND column_name = 'paymentDate'
    ) THEN
        ALTER TABLE "Payment" RENAME COLUMN "paymentDate" TO "createdAt";
    END IF;

    -- Add columns if they do not exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'Payment' AND column_name = 'currency'
    ) THEN
        ALTER TABLE "Payment" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'INR';
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'Payment' AND column_name = 'transactionId'
    ) THEN
        ALTER TABLE "Payment" ADD COLUMN "transactionId" TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'Payment' AND column_name = 'razorpayOrderId'
    ) THEN
        ALTER TABLE "Payment" ADD COLUMN "razorpayOrderId" TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'Payment' AND column_name = 'razorpayPaymentId'
    ) THEN
        ALTER TABLE "Payment" ADD COLUMN "razorpayPaymentId" TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'Payment' AND column_name = 'razorpaySignature'
    ) THEN
        ALTER TABLE "Payment" ADD COLUMN "razorpaySignature" TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'Payment' AND column_name = 'paidAt'
    ) THEN
        ALTER TABLE "Payment" ADD COLUMN "paidAt" TIMESTAMP(3);
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'Payment' AND column_name = 'updatedAt'
    ) THEN
        ALTER TABLE "Payment" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Alter column default for paymentMethod if it exists
ALTER TABLE "Payment" ALTER COLUMN "paymentMethod" SET DEFAULT 'ONLINE';

-- Recreate PaymentStatus enum safely
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t 
        JOIN pg_enum e ON t.oid = e.enumtypid 
        WHERE t.typname = 'PaymentStatus' AND e.enumlabel = 'PENDING'
    ) THEN
        ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
        CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');
        ALTER TABLE "Payment" ALTER COLUMN "status" DROP DEFAULT;
        ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "PaymentStatus" USING 'PENDING'::"PaymentStatus";
        ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
        DROP TYPE "PaymentStatus_old";
    END IF;
END $$;

-- Create Unique Constraints safely
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_transactionId_key" ON "Payment"("transactionId");
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_razorpayOrderId_key" ON "Payment"("razorpayOrderId");
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_razorpayPaymentId_key" ON "Payment"("razorpayPaymentId");
