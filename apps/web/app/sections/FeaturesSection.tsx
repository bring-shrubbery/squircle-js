export const FeaturesSection = () => {
  return (
    <div className="container mx-auto mb-36 w-fit">
      <h2 className="mx-auto mb-4 w-fit font-semibold text-2xl">
        {"Features 👑"}
      </h2>

      <ul className="list-inside list-none space-y-2">
        <li>{"💃 Easy to use primitive for building your own components."}</li>
        <li>{"🚀 Available for React, (other libraries coming soon)"}</li>
        <li>{"😏 React 18 support (server components)"}</li>
        <li>
          {"🙏 Fallback for no JavaScript (try disabling JS for this page)"}
          <noscript>
            <br />
            <div className="ml-[22px] pt-2">
              <span className="font-bold">{"Well done!"}</span>
              {' Notice the "Element" above is still rounded.'}
            </div>
          </noscript>
        </li>
        <li>{"🐁 Just 2.1kB gzipped."}</li>
        <li>{"👌 CommonJS and ES6"}</li>
      </ul>
    </div>
  );
};
