"use client";

import { Highlight, themes } from "prism-react-renderer";

export const CodeBlock = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  const language = className?.replace("language-", "") ?? "text";

  return (
    <Highlight
      code={children.trim()}
      language={language}
      theme={themes.oneDark}
    >
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className="mb-4 overflow-x-auto rounded-lg p-4 text-sm"
          style={style}
        >
          {tokens.map((line, i) => (
            <div key={`line-${i}`} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={`token-${key}`} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};
