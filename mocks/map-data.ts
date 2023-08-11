interface IDestinationItem {
  title: string;
  gps: { lon: number, lat: number };
  imgUrl: string;

}

export const destinations: IDestinationItem[] = [
  {
    title: 'Algarve',
    gps: {
      lon: -8.2501,
      lat: 37.0902,
    },
    imgUrl:
      'https://ams3.digitaloceanspaces.com/photo-storage/67237b59c0a84701d00712261297a6191b210eaf708a6a979185196100a50a91/computer.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=PTFJM4ES7GEMPT3SMPBV%2F20230804%2Fams3%2Fs3%2Faws4_request&X-Amz-Date=20230804T095314Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=4a22081edd408ae3de18e672662ca5ed39ff148c7bc3a8df717fd11f00928f41',
  },
  {
    title: 'Split',
    gps: {
      lon: 16.4402,
      lat: 43.5081,
    },
    imgUrl:
      'https://ams3.digitaloceanspaces.com/photo-storage/582e396f769a9dcad22085540a3f522eb8f209d49e3122608307b628055ac23c/computer.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=PTFJM4ES7GEMPT3SMPBV%2F20230804%2Fams3%2Fs3%2Faws4_request&X-Amz-Date=20230804T095315Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=d9313fbc700344c26848094d92a8e19dcca30e6b19d51f82fa34fa6884a28580',
  },
  {
    title: 'Crete',
    gps: {
      lon: 24.8093,
      lat: 35.2401,
    },
    imgUrl:
      'https://ams3.digitaloceanspaces.com/photo-storage/67237b59c0a84701d00712261297a6191b210eaf708a6a979185196100a50a91/computer.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=PTFJM4ES7GEMPT3SMPBV%2F20230804%2Fams3%2Fs3%2Faws4_request&X-Amz-Date=20230804T095314Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=4a22081edd408ae3de18e672662ca5ed39ff148c7bc3a8df717fd11f00928f41',
  },
  {
    title: 'Ibiza',
    gps: {
      lon: -1.428,
      lat: 38.9085,
    },
    imgUrl:
      'https://ams3.digitaloceanspaces.com/photo-storage/851a9b3a311f31e2ca8eb2a8a484b66bd0b67236bf7c77a852bfb0c889a1e56f/computer.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=PTFJM4ES7GEMPT3SMPBV%2F20230804%2Fams3%2Fs3%2Faws4_request&X-Amz-Date=20230804T095317Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=67e71dd3378dd3618f7096547111fc66df01d3b5f8f3e406a4507821d5b07294',
  },
  {
    title: 'Tenerife',
    gps: {
      lon: -16.6291,
      lat: 28.2916,
    },
    imgUrl:
      'https://ams3.digitaloceanspaces.com/photo-storage/331e3a4b664aff293f159db3a3cf5016fb292eb0e39d0da0398756b9bfa7e8fb/computer.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=PTFJM4ES7GEMPT3SMPBV%2F20230804%2Fams3%2Fs3%2Faws4_request&X-Amz-Date=20230804T095845Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=fe70e5cef45faf49acde0ed24e40f0b11c82ee656bc0eb1f079103a3ba9aa5b5',
  },
];