interface IAirlinesData {
    [key: string]: IAirlineDataItem
}

export interface IAirlineDataItem {
    title: string;
    starterMessage: string;
    logo: string;
    styles: IStyles[]
}

interface IStyles {
    key: string;
    value: string;
}

export const airlinesData: IAirlinesData = {
    default: {
        title: "Earth Guide",
        logo: "/earth-guide.svg",
        starterMessage: "Hello, I am your AI travel advisor. With my help, you can quickly discover the perfect flight tickets to your dream destinations.",
        styles: [
          {
            key: "--primary",
            value: "#ff5600",
          },
          {
            key: "--secondary",
            value: "#fbae88",
          },
          {
            key: "--tertiary",
            value: "#fc9284",
          },
          {
            key: "--primary-text",
            value: "white",
          },
          {
            key: "--secondary-text",
            value: "black",
          },
          {
            key: "--tertiary-text",
            value: "black",
          },
        ],
      },
  austrian: {
    title: "Austrian",
    logo: "/austrian-logo.svg",
    starterMessage: "Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Austrian Airlines. After being properly implemented with Austrian Airlines' specific features, I can offer much more.",
    styles: [
      {
        key: "--primary",
        value: "#d81e05",
      },
      {
        key: "--secondary",
        value: "#f1f3f5",
      },
      {
        key: "--tertiary",
        value: "#fc9284",
      },
      {
        key: "--primary-text",
        value: "white",
      },
      {
        key: "--secondary-text",
        value: "black",
      },
      {
        key: "--tertiary-text",
        value: "black",
      },
    ],
  },
  kiwi: {
    title: "Kiwi",
    logo: "/kiwi-logo.svg",
    starterMessage: "Hello, I am your AI travel advisor. With my help, you can quickly discover the perfect flight tickets to your dream destinations.",
    styles: [
      {
        key: "--primary",
        value: "#00a991",
      },
      {
        key: "--secondary",
        value: "#e8edf1",
      },
      {
        key: "--tertiary",
        value: "#0166b7",
      },
      {
        key: "--primary-text",
        value: "white",
      },
      {
        key: "--secondary-text",
        value: "black",
      },
      {
        key: "--tertiary-text",
        value: "black",
      },
    ],
  },
};
