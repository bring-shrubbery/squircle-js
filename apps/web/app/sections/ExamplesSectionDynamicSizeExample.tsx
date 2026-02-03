"use client";

import { Squircle } from "@squircle-js/react";
import Image from "next/image";
import Prism from "prismjs";
import { Card, CardContent } from "@/components/ui/card";
import { Code } from "@/components/ui/code";

import "prismjs/components/prism-jsx";

import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

const usage = `<Squircle
  cornerRadius={24}
  cornerSmoothing={1}
  className="bg-slate-100 p-4"
>
  {/* Cards fetched from API will be rendered here */}
</Squircle>`;

const highlightedUsage =
  "jsx" in Prism.languages
    ? Prism.highlight(
        ["...", usage, "..."].join("\n"),
        Prism.languages.jsx,
        "jsx"
      )
    : "";

export const ExamplesSectionDynamicSizeExample = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=3")
      .then((res) => res.json())
      .then((data) => {
        setTimeout(() => {
          setProducts(data.products);
          setLoading(false);
        }, 2000); // 2 seconds delay
      })
      .catch((_err) => {
        setError("Failed to fetch products");
        setLoading(false);
      });
  }, []);

  return (
    <Card className="w-full max-w-[480px] sm:max-w-[508px]">
      <CardContent className="w-full space-y-4 py-6">
        <h3 className="font-semibold text-lg">Code:</h3>
        <p>
          This example demonstrates fetching products from an API and displaying
          them as cards inside a <Kode>Squircle</Kode> container.
          <br />
          <br />
          The Squircle container now adapts its height and width dynamically
          based on the size of its children, thanks to{" "}
          <Kode>ResizeObserver</Kode>. This ensures the layout remains
          responsive and visually balanced no matter how many cards are rendered
          or how their content changes.
        </p>
        <Code dangerousHTML={highlightedUsage} raw={usage} />
        <h3 className="font-semibold text-lg">Result:</h3>
        <Squircle
          className="bg-slate-100 p-4"
          cornerRadius={24}
          cornerSmoothing={1}
        >
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="grid gap-4">
              {products.map((product) => (
                <Squircle
                  className="bg-white p-3 shadow"
                  cornerRadius={16}
                  cornerSmoothing={1}
                  key={product.id}
                >
                  <div className="flex items-center gap-4">
                    <Image
                      alt={product.title}
                      className="h-16 w-16 rounded border object-cover"
                      height={64}
                      src={product.thumbnail}
                      width={64}
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{product.title}</div>
                      <div className="line-clamp-2 text-gray-500 text-sm">
                        {product.description}
                      </div>
                      <div className="mt-1 font-medium text-sm">
                        ${product.price}
                      </div>
                    </div>
                  </div>
                </Squircle>
              ))}
            </div>
          )}
        </Squircle>
      </CardContent>
    </Card>
  );
};

const Kode = ({ children }: PropsWithChildren) => (
  <code className="rounded-md bg-slate-200/50 px-1.5 py-0.5 text-sm">
    {children}
  </code>
);
