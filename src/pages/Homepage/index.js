export default function Homepage() {
  return (
    <div class=" bg-gray-200">
      <div class="container h-screen flex justify-center items-top">
        <div class="relative">
          <div class="absolute top-4 left-3 ">
            {" "}
            <i class="fa fa-search text-gray-400 z-20 hover:text-gray-500"></i>{" "}
          </div>{" "}
          <input
            type="text"
            class="h-14 w-96 mt-4 pl-10 pr-20 rounded-lg z-0 focus:shadow focus:outline-none"
            placeholder="Search anything..."
          />
          <div class="absolute top-2 right-2">
            {" "}
            <button class="h-10 w-20 mt-4 text-white rounded-lg bg-blue-500 hover:bg-red-600">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
