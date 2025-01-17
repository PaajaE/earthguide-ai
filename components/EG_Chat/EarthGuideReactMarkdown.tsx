/* eslint-disable @next/next/no-img-element */
import { TypeOfPrompt } from '@/types';
import { airlinesData } from '@/utils/data/airlines';
import { usePathname } from 'next/navigation';
import { FC, ReactNode, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { text } from 'stream/consumers';
// import { content } from "@/mocks/md-content-mock";
interface Props {
  content: string;
  lightMode: 'light' | 'dark';
  withPadding?: boolean;
  onAnotherPromptClick?: (
    typeOfPrompt: TypeOfPrompt,
    id: string
  ) => void;
  onDisplayGallery?: (imgSrcs: string[], curIndex: number) => void;
}

export const EarthGuideReactMarkdown: FC<Props> = ({
  lightMode,
  content,
  withPadding,
  onAnotherPromptClick,
  onDisplayGallery,
}) => {
  const path = usePathname()?.substring(1);

  const getAllImgSrc = (elem: HTMLDivElement): string[] => {
    const srcArr: string[] = [];
    const imgs = elem.querySelectorAll('img');

    imgs.forEach((img) => {
      srcArr.push(img.src);
    });

    return srcArr;
  };

  const getImgIndex = (
    elem: HTMLDivElement,
    img: HTMLImageElement
  ): number => {
    const imgs = elem.querySelectorAll('img');
    const index = Array.from(imgs).findIndex(
      (imgElement) => imgElement.src === img.src
    );
    return index > -1 ? index : 0;
  };

  const handleImgClick = (e: Event) => {
    const target = e.target as HTMLElement;
    const { nodeName } = target;
    let elem;
    let curIndex = 0;

    if (nodeName === 'IMG') {
      elem = target.parentElement as HTMLDivElement;
      const img = target as HTMLImageElement;
      curIndex = getImgIndex(elem, img);
    } else {
      elem = target as HTMLDivElement;
    }

    const imgSrcs = getAllImgSrc(elem);

    onDisplayGallery && onDisplayGallery(imgSrcs, curIndex);
  };

  useEffect(() => {
    const elements = document.querySelectorAll('.gallery');
    elements.forEach((elem) => {
      elem.addEventListener('click', handleImgClick);
    });
  });
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        pre({ children }) {
          return <>{children}</>;
        },
        code({ node, inline, className, children, ...props }) {
          const div = String(children).replace(/\n$/, '');

          if (div.includes(`class="gallery"`)) {
            return (
              <div
                className={`order-first mb-4 ${
                  withPadding ? '' : '-mt-3 lg:-mt-8 lg:-mx-8'
                }`}
                dangerouslySetInnerHTML={{ __html: div }}
              ></div>
            );
          } else if (div.includes(`class="gallery gallery-small"`)) {
            return (
              <div
                className="w-100 mb-2"
                dangerouslySetInnerHTML={{ __html: div }}
              ></div>
            );
          } else if (div.includes(`class="no-photos"`)) {
            return (
              <div
                className="w-100 order-last px-3 lg:px-4"
                dangerouslySetInnerHTML={{ __html: div }}
              ></div>
            );
          } else if (div.includes(`class="inline-flights"`)) {
            const iconPath = path
              ? airlinesData[path].flightIcon
              : airlinesData.default.flightIcon;
            const replacedIconDiv = div.replaceAll(
              '/flight_icon.svg',
              iconPath
            );
            return (
              <div
                className={`w-100 relative -top-1 lg:-top-3 mb-1 lg:mb-3 lg:text-justify px-3 lg:px-0`}
                dangerouslySetInnerHTML={{ __html: replacedIconDiv }}
              ></div>
            );
          } else {
            return <></>;
          }
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
            <th className="border border-black dark:border-white break-words py-1 px-3 bg-gray-500 text-[var(--primary-text)]">
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
          // console.log(ref);
          return (
            <ol className="list-auto pl-4" start={ref.start}>
              {ref.children}
            </ol>
          );
        },
        a({
          children,
          href,
        }: {
          children: ReactNode;
          href?: string;
        }) {
          if (href === 'LINK') {
            return (
              <button
                onClick={() => {
                  if (children) {
                    // console.log(children.toString());
                    !airlinesData[path] &&
                      onAnotherPromptClick &&
                      onAnotherPromptClick(
                        TypeOfPrompt.CLICK_ON_LOCATION,
                        children.toString()
                      );
                  }
                }}
                className={`text-[var(--primary)] ${
                  !airlinesData[path]
                    ? 'cursor-pointer border-b border-[var(--primary)]'
                    : 'cursor-default'
                } no-underline `}
              >
                {children}
              </button>
            );
          } else {
            return (
              <a
                href={href}
                className="text-[var(--primary)] cursor-pointer no-underline border-b border-[var(--primary)]"
              >
                {children}
              </a>
            );
          }
        },
        ul({ children }) {
          return (
            <div>
              <ul className="flex flex-nowrap list-none">
                {children}
              </ul>
            </div>
          );
        },
        img(ref) {
          return (
            <div className="my-1">
              <img
                src={ref.src}
                alt={ref.alt}
                className="rounded-lg"
              />
            </div>
          );
        },
        p({ children }) {
          return (
            <div className="mb-4 last-of-type:mb-0 lg:text-justify px-3 lg:px-0">
              {children}
            </div>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
