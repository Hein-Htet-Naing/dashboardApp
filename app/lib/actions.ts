"use server";
import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// To handle type validation, you have a few options.
// While you can manually validate types,
// using a type validation library can save you time and effort.
//  For your example, we'll use Zod,
//  a TypeScript-first validation library that can simplify this task for you.
const sql = postgres(process.env.POSGRES_URL!, { ssl: "require" });
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number().min(0.01),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});
//create Invoice
const CreateInvoice = FormSchema.omit({ id: true, date: true });
export default async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  try {
    await sql`
  INSERT INTO invoices (customer_id,amount,status,date)
  VALUES(${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  } catch (e) {}
  revalidatePath("dashboard/Invoice");
  redirect("/dashboard/Invoice");
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100;

  try {
    await sql` UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (e) {}
  // You need to call revalidatePath every time you update, create,
  // or delete data because Next.js uses data caching and static rendering for routes and
  // components. When you mutate data (like invoices), the cached pages or components won’t automatically update.

  // revalidatePath("/dashboard/invoice") tells Next.js to invalidate the cache for that path,
  // so the next time a user visits or fetches data from that route,
  // it will show the latest data from your database.
  revalidatePath("/dashboard/Invoice");
  redirect("/dashboard/Invoice");
}

export async function deleteInvoice(id: string) {
  throw new Error("Failed to Delete Invoice");
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath("/dashboard/Invoice");
}
