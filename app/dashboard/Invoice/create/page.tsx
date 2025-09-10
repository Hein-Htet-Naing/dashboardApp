import Form from "@/app/ui/invoices/create-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchCustomers } from "@/app/lib/data";

export default async function page() {
  const customers = await fetchCustomers();
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoice", href: "/dashboard/Invoice" },
          {
            label: "Create Invoice",
            href: "/dashboard/Invoice/create",
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
