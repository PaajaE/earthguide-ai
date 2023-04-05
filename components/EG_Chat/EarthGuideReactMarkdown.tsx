/* eslint-disable @next/next/no-img-element */
import { TypeOfPrompt } from "@/types";
import { FC, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "../Markdown/CodeBlock";

interface Props {
  content: string;
  lightMode: "light" | "dark";
  onAnotherPromptClick: (typeOfPrompt: TypeOfPrompt, id: string) => void;
}

export const EarthGuideReactMarkdown: FC<Props> = ({
  content,
  lightMode,
  onAnotherPromptClick,
}) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <CodeBlock
              key={Math.random()}
              language={match[1]}
              value={String(children).replace(/\n$/, "")}
              lightMode={lightMode}
              {...props}
            />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        table({ children }) {
          return (
            <table className="border-collapse border border-black dark:border-white py-1 px-3">
              {children}
            </table>
          );
        },
        th({ children }) {
          return (
            <th className="border border-black dark:border-white break-words py-1 px-3 bg-gray-500 text-white">
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className="border border-black dark:border-white break-words py-1 px-3">
              {children}
            </td>
          );
        },
        ol(ref) {
          return <ol className="list-auto pl-4">{ref.children}</ol>;
        },
        a({ children, href }: { children: ReactNode; href?: string }) {
          if (href === "LINK") {
            return (
              <button
                onClick={() => {
                  if (children) {
                    console.log(children.toString());
                    onAnotherPromptClick(
                      TypeOfPrompt.CLICK_ON_LOCATION,
                      children.toString()
                    );
                  }
                }}
                className="text-[#FF5600] cursor-pointer no-underline border-b border-[#FF5600]"
              >
                {children}
              </button>
            );
          } else {
            return (
              <a
                href={href}
                className="text-[#FF5600] cursor-pointer no-underline border-b border-[#FF5600]"
              >
                {children}
              </a>
            );
          }
        },
        ul({ children }) {
          return (
            <div>
              <ul className="flex flex-nowrap list-none">{children}</ul>
            </div>
          );
        },
        img(ref) {
          return (
            <div className="my-1 px-1">
              <img src={ref.src} alt={ref.alt} className="rounded-[10px]" />
            </div>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
