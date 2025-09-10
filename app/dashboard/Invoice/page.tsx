import Table from "@/app/ui/invoices/table";
import { latina } from "@/app/ui/font";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import InvoicesTableSkeleton from "@/app/ui/skeletons";
import { Suspense } from "react";
import Pagination from "@/app/ui/invoices/pagination";
import Search from "@/app/ui/search";
import { fetchInvoicesPages } from "@/app/lib/data";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${latina.className} text-2xl`}></h1>
      </div>
      <div>
        <Search placeholder="Search Invoices.." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
