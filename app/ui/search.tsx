"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // How Debouncing Works:

  // Trigger Event: When an event that should be debounced (like a keystroke in the search box) occurs, a timer starts.
  // Wait: If a new event occurs before the timer expires, the timer is reset.
  // Execution: If the timer reaches the end of its countdown, the debounced function is executed.

  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`Search Term: ${term}`);

    const params = new URLSearchParams(searchParams.toString());
    //when user types a new search query, we reset the page to 1
    params.set("page", "1");
    //set the query param if
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    //replace the url with the new query param
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
