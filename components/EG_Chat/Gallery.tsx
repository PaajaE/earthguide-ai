import { FC } from 'react'
import { Carousel, Flowbite } from 'flowbite-react'
import type { CustomFlowbiteTheme } from 'flowbite-react';

interface Props {
  galleryItems: string[]
  curIndex: number
}

function reorder(data: string[], index: number): string[] {
  console.log({data, index})
  if(data.length > 0 && index >= 0) {
    console.log('slicing')
    return data.slice(index).concat(data.slice(0, index))
  }
  return []
};

export const Gallery: FC<Props> = ({ galleryItems, curIndex }) => {

  const reorderedItems = reorder(galleryItems, curIndex)
  console.log(reorderedItems)

  const customTheme: CustomFlowbiteTheme = {
    carousel: {
      item: {
        base: "max-h-full rounded object-contain",
        wrapper: "flex justify-center w-full flex-shrink-0 transform cursor-grab snap-center h-full"
      },
      indicators: {
        active: {
          off: "bg-white/50 hover:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-800",
          on: "bg-white dark:bg-gray-800"
        },
      },
      control: {
        base: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/50 group-hover:bg-black/70 group-focus:outline-none sm:h-10 sm:w-10",
        icon: "h-5 w-5 text-[var(--primary-text)] dark:text-gray-800 sm:h-6 sm:w-6"
      },
    },
  };

  return (
    <Flowbite theme={{ theme: customTheme }}>
    <Carousel slide={false}>
      {reorderedItems.map((item, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item} key={index.toString()} alt={index.toString()} />
      ))}
    </Carousel>
    </Flowbite>
  )
}
