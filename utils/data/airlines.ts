interface IAirlinesData {
  [key: string]: IAirlineDataItem;
}

export interface IAirlineDataItem {
  title: string;
  starterMessage: string;
  flightIcon: string;
  logo: string;
  icon: string;
  styles: IStyles[];
}

interface IStyles {
  key: string;
  value: string;
}

export const airlinesData: IAirlinesData = {
  default: {
    title: 'Earth.Guide',
    flightIcon: '/flight_icon.svg',
    logo: '/earth-guide.svg',
    icon: '/favicon.ico',
    starterMessage:
      'I am AI travel advisor. With my help, you can quickly discover the perfect flights to your dream destinations.',
    styles: [
      {
        key: '--primary',
        value: '#ff5600',
      },
      {
        key: '--secondary',
        value: '#ECECEC',
      },
      {
        key: '--tertiary',
        value: '#fc9284',
      },
      {
        key: '--primary-text',
        value: 'white',
      },
      {
        key: '--secondary-text',
        value: 'black',
      },
      {
        key: '--tertiary-text',
        value: 'black',
      },
    ],
  },
  austrian: {
    title: 'Austrian AI Advisor',
    flightIcon: '/flight_icon_austrian.svg',
    logo: '/austrian-logo.svg',
    icon: '/austrian-logo.svg',
    starterMessage:
      "Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Austrian Airlines. After being properly implemented with Austrian Airlines' specific features, I can offer much more.",
    styles: [
      {
        key: '--primary',
        value: '#d81e05',
      },
      {
        key: '--secondary',
        value: '#f1f3f5',
      },
      {
        key: '--tertiary',
        value: '#fc9284',
      },
      {
        key: '--primary-text',
        value: 'white',
      },
      {
        key: '--secondary-text',
        value: 'black',
      },
      {
        key: '--tertiary-text',
        value: 'black',
      },
    ],
  },
  kiwi: {
    title: 'Kiwi AI Advisor',
    flightIcon: '/flight_icon_kiwi.svg',
    logo: '/kiwi-logo.svg',
    icon: '/kiwi-logo.svg',
    starterMessage:
      'I am AI travel advisor. With my help, you can quickly discover the perfect flights to your dream destinations.',
    styles: [
      {
        key: '--primary',
        value: '#00a991',
      },
      {
        key: '--secondary',
        value: '#e8edf1',
      },
      {
        key: '--tertiary',
        value: '#0166b7',
      },
      {
        key: '--primary-text',
        value: 'white',
      },
      {
        key: '--secondary-text',
        value: 'black',
      },
      {
        key: '--tertiary-text',
        value: 'black',
      },
    ],
  },
  wizzair: {
    title: 'Wizzair AI Advisor',
    flightIcon: '/flight_icon_wizzair.svg',
    logo: '/wizzair-logo.png',
    icon: '/wizzair-favicon.png',
    starterMessage:
      'I am AI travel advisor. With my help, you can quickly discover the perfect flights to your dream destinations.',
    styles: [
      {
        key: '--primary',
        value: '#c6007e',
      },
      {
        key: '--secondary',
        value: '#f2f2f2',
      },
      {
        key: '--tertiary',
        value: '#06038d',
      },
      {
        key: '--primary-text',
        value: 'white',
      },
      {
        key: '--secondary-text',
        value: 'black',
      },
      {
        key: '--tertiary-text',
        value: 'black',
      },
    ],
  },
  vueling: {
    title: 'Vueling AI Advisor',
    flightIcon: '/flight_icon_vueling.svg',
    logo: '/vueling-logo.svg',
    icon: '/vueling.ico',
    starterMessage:
      'I am AI travel advisor. With my help, you can quickly discover the perfect flights to your dream destinations.',
    styles: [
      {
        key: '--primary',
        value: '#fc0',
      },
      {
        key: '--secondary',
        value: '#4d4d4d',
      },
      {
        key: '--tertiary',
        value: '#eee',
      },
      {
        key: '--primary-text',
        value: '#4d4d4d',
      },
      {
        key: '--secondary-text',
        value: 'white',
      },
      {
        key: '--tertiary-text',
        value: 'black',
      },
    ],
  },
};
