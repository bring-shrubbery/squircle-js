"use client";

import { Squircle } from "@squircle-js/react";
import Image from "next/image";
import Prism from "prismjs";
import { Card, CardContent } from "@/components/ui/card";
import { Code } from "@/components/ui/code";
import { Slider } from "@/components/ui/slider";

import "prismjs/components/prism-jsx";

import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  logoAlt: string;
  pricing: string;
  href: string;
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
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [containerWidth, setContainerWidth] = useState(320);
  const [productCount, setProductCount] = useState(3);

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => new Set(prev).add(productId));
  };

  useEffect(() => {
    fetch(
      "https://quassum.com/api/products?id=onedollarchatbot&id=justscribe&id=squircle-js"
    )
      .then((res) => res.json())
      .then((data) => {
        setTimeout(() => {
          setProducts(data);
          setLoading(false);
        }, 1000);
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
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Container Width:</span>
              <span className="font-mono text-sm font-semibold">
                {containerWidth}px
              </span>
            </div>
            <Slider
              value={[containerWidth]}
              onValueChange={([value]) => setContainerWidth(value)}
              min={200}
              max={460}
              step={1}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Products to Show:</span>
              <span className="font-mono text-sm font-semibold">
                {productCount}
              </span>
            </div>
            <Slider
              value={[productCount]}
              onValueChange={([value]) => setProductCount(value)}
              min={1}
              max={3}
              step={1}
              className="w-full"
            />
          </div>
          <div className="flex justify-center">
            <div style={{ width: `${containerWidth}px` }}>
              <Squircle
                className="min-w-0 bg-slate-100 p-4"
                cornerRadius={36}
                cornerSmoothing={1}
              >
                {loading ? (
                  <div>Loading...</div>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : (
                  <div className="grid min-w-0 gap-4">
                    {products.slice(0, productCount).map((product) => (
                      <a
                        className="min-w-0"
                        href={
                          product.href.startsWith("http")
                            ? product.href
                            : `https://quassum.com${product.href}`
                        }
                        key={product.id}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <Squircle
                          className="min-w-0 max-w-full bg-white p-3 shadow transition-shadow hover:shadow-md"
                          cornerRadius={24}
                          cornerSmoothing={1}
                        >
                          <div className="flex min-w-0 items-center gap-4">
                            {imageErrors.has(product.id) ? (
                              <Squircle
                                className="flex size-16 items-center justify-center bg-slate-200 font-bold text-slate-500 text-xl"
                                cornerRadius={16}
                                cornerSmoothing={1}
                              >
                                {product.name.charAt(0).toUpperCase()}
                              </Squircle>
                            ) : (
                              <Squircle
                                className="size-16 overflow-hidden bg-white"
                                cornerRadius={16}
                                cornerSmoothing={1}
                              >
                                <Image
                                  alt={product.logoAlt}
                                  className="h-full w-full object-contain"
                                  height={64}
                                  onError={() => handleImageError(product.id)}
                                  src={product.logo}
                                  width={64}
                                />
                              </Squircle>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-semibold">
                                {product.name}
                              </div>
                              <div className="line-clamp-1 text-gray-500 text-sm">
                                {product.tagline}
                              </div>
                              <div className="mt-1 text-gray-400 text-xs capitalize">
                                {product.pricing}
                              </div>
                            </div>
                          </div>
                        </Squircle>
                      </a>
                    ))}
                  </div>
                )}
              </Squircle>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Kode = ({ children }: PropsWithChildren) => (
  <code className="rounded-md bg-slate-200/50 px-1.5 py-0.5 text-sm">
    {children}
  </code>
);
