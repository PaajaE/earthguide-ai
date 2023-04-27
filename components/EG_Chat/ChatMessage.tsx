import { Message, TypeOfPrompt } from "@/types";
import { FC, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "../Markdown/CodeBlock";
import { Button } from "../Shared/Button";
import { EarthGuideReactMarkdown } from "./EarthGuideReactMarkdown";

interface Props {
  message: Message;
  lightMode: "light" | "dark";
  onAnotherPromptClick?: (typeOfPrompt: TypeOfPrompt, id: string) => void;
  onSampleClick?: (content: string) => void;
}

export const ChatMessage: FC<Props> = ({
  message,
  lightMode,
  onAnotherPromptClick,
  onSampleClick,
}) => {
  // console.log("message", message);
  return (
    <>
      {message.role === "assistant" || message.role === "earth.guide" ? (
        <div className="text-black font-semibold pl-4 mt-4 mb-2">
          {message.role === "assistant"
            ? "Answer from ChatGPT:"
            : "Answer from Earth.Guide:"}
        </div>
      ) : (
        <></>
      )}
      <div
        className={`flex flex-row justify-start items-start gap-2.5 w-100 px-[17px] py-3 mb-3 box-border ${
          message.role === "assistant" || message.role === "starter"
            ? "bg-[rgba(236,236,236,1)] rounded-t-[10px] rounded-r-[10px] mr-8"
            : ""
        }
        ${
          message.role === "user"
            ? "bg-[rgba(255,86,0,1)] rounded-t-[10px] rounded-bl-[10px] ml-8"
            : ""
        }
        ${
          message.role === "earth.guide"
            ? "bg-[#3000FF] rounded-t-[10px] rounded-r-[10px] mr-8"
            : ""
        }
        ${
          message.role === "sample"
            ? "bg-white rounded-t-[10px] rounded-r-[10px] mr-4"
            : ""
        }
        `}
        style={{
          cursor:
            message.role === "sample" && onSampleClick ? "pointer" : "default",
        }}
        onClick={() => {
          if (message.role === "sample") {
            onSampleClick && onSampleClick(message.content);
          }
        }}
      >
        <div
          className={`border-[#000000ff] leading-6  font-plus jakarta sans  font-[400]
      ${
        message.role === "assistant" ||
        message.role === "sample" ||
        message.role === "starter"
          ? "text-black"
          : "text-white"
      }`}
        >
          {message.role === "user" && <>{message.content}</>}
          {message.role === "sample" && <>{message.content}</>}
          {message.role === "starter" && <>{message.content}</>}
          {message.role === "assistant" && (
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
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
          {message.role === "earth.guide" && (
            <EarthGuideReactMarkdown
              content={message.content}
              lightMode={lightMode}
              onAnotherPromptClick={onAnotherPromptClick}
            />
          )}
        </div>
      </div>
      {message.role === "earth.guide" && (
        <div className="flex mt-4 mb-2">
          <Button
            text="More places like these"
            iconUrl="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/ye8nsqm0bdc-825%3A578?alt=media&token=24521707-8435-44ee-82ca-d15de9e01b9f"
            bgColor="#d4845c"
            typeOfPrompt={TypeOfPrompt.MORE_PLACES}
            onClick={(typeOfPrompt: TypeOfPrompt) => {
              onAnotherPromptClick &&
                onAnotherPromptClick(typeOfPrompt, message.id ?? "");
            }}
          />
          <Button
            text="Show me lesser-known places"
            iconUrl="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/ye8nsqm0bdc-825%3A578?alt=media&token=24521707-8435-44ee-82ca-d15de9e01b9f"
            bgColor="#d4845c"
            typeOfPrompt={TypeOfPrompt.LESSER_KNOWN}
            onClick={(typeOfPrompt: TypeOfPrompt) => {
              onAnotherPromptClick &&
                onAnotherPromptClick(typeOfPrompt, message.id ?? "");
            }}
          />
        </div>
      )}
    </>
  );
};
