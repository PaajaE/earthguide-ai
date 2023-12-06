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
    flightIcon: '/flightIcons/flight_icon.svg',
    logo: '/earth-guide.svg',
    icon: '/earth-guide.ico',
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
    flightIcon: '/flightIcons/flight_icon_austrian.svg',
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
    flightIcon: '/flightIcons/flight_icon_kiwi.svg', // toto si udělám sám
    logo: '/kiwi-logo.svg', // logo na stránce
    icon: '/kiwi-logo.svg', // favicon v záložce
    starterMessage:
      'I am AI travel advisor. With my help, you can quickly discover the perfect flights to your dream destinations.',
    styles: [
      // tady jsou všechny barvy používané, hoď mi tam prosím jen ty první tři. Ostatní bývají stejné nebo je v případě potřeby jen prohodím
      {
        key: '--primary',
        value: '#00a991',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#ececec',
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
    flightIcon: '/flightIcons/flight_icon_wizzair.svg',
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
    flightIcon: '/flightIcons/flight_icon_vueling.svg',
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
  smartwings: {
    title: 'Smartwings AI Advisor',
    flightIcon: '/flightIcons/flight_icon_smartwings.svg',
    logo: '/logo-smartwings.svg',
    icon: '/smartwings.ico',
    starterMessage:
      'I am AI travel advisor. With my help, you can quickly discover the perfect flights to your dream destinations.',
    styles: [
      {
        key: '--primary',
        value: '#ff7300',
      },
      {
        key: '--secondary',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#4a86c0',
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
  lufthansa: {
    title: 'Lufthansa AI Advisor',
    flightIcon: '/flightIcons/flight_icon_lufthansa.svg',
    logo: '/lufthansa-logo.svg',
    icon: '/lufthansa.ico',
    starterMessage:
      'I am AI travel advisor. With my help, you can quickly discover the perfect flights to your dream destinations.',
    styles: [
      {
        key: '--primary',
        value: '#05164d',
      },
      {
        key: '--secondary',
        value: 'white',
      },
      {
        key: '--tertiary',
        value: '#ffad01',
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
  american: {
    title: 'American AI Advisor',
    flightIcon: '/flightIcons/flight_icon_american.svg',
    logo: '/american-logo.png',
    icon: '/american-favi.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with American Airlines. After being properly implemented with American Airlines’ specific features, I can offer much more.',
    styles: [
      {
        key: '--primary',
        value: '#0078d2',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#e38f90',
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
  azair: {
    title: 'AZair AI Advisor',
    flightIcon: '/flightIcons/flight_icon_azair.svg',
    logo: '/azair-logo.png',
    icon: '/azair-favi.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with AZair. After being properly implemented with AZair’s specific features, I can offer much more. At the moment, I am using API of Kiwi, but I can use AZair’s search results.',
    styles: [
      {
        key: '--primary',
        value: '#07b2fe',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#b5b5b5',
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
  british: {
    title: 'British AI Advisor',
    flightIcon: '/flightIcons/flight_icon_british.svg',
    logo: '/british-logo.png',
    icon: '/british-favi.jpeg',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with British Airlines. After being properly implemented with British Airlines’ specific features, I can offer much more.',
    styles: [
      {
        key: '--primary',
        value: '#2E5C99',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#ACBCD4',
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
  easyjet: {
    title: 'easyJet AI Advisor',
    flightIcon: '/flightIcons/flight_icon_easyjet.svg',
    logo: '/easyjet-logo.png',
    icon: '/easyjet-favi.jpeg',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with easyJet. After being properly implemented with easyJet’s specific features, I can offer much more.',
    styles: [
      {
        key: '--primary',
        value: '#FC6404',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#FDAE7B',
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
  edreams: {
    title: 'eDreams AI Advisor',
    flightIcon: '/flightIcons/flight_icon_edreams.svg',
    logo: '/edreams-logo.png',
    icon: '/edreams-favi.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with eDreams. After being properly implemented with eDream’s specific features, I can offer much more. At the moment, I am using API of Kiwi, but I can use eDream’s search results.',
    styles: [
      {
        key: '--primary',
        value: '#162E98',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#FCE19C',
      },
      {
        key: '--tertiary',
        value: '#9DA9D3',
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
  emirates: {
    title: 'Emirates AI Advisor',
    flightIcon: '/flightIcons/flight_icon_emirates.svg',
    logo: '/emirates-logo.png',
    icon: '/emirates-logo.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Emirates. After being properly implemented with Emirate’s specific features, I can offer much more.',
    styles: [
      {
        key: '--primary',
        value: '#DC0414',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#DC0414',
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
  etihad: {
    title: 'Etihad AI Advisor',
    flightIcon: '/flightIcons/flight_icon_ethiad.svg',
    logo: '/ethiad-logo.png',
    icon: '/ethiad-favi.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Etihad. After being properly implemented with Etihad’s specific features, I can offer much more.',
    styles: [
      {
        key: '--primary',
        value: '#BC8C12',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#E4D0A0',
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
  eurowings: {
    title: 'Eurowings AI Advisor',
    flightIcon: '/flightIcons/flight_icon_eurowings.svg',
    logo: '/eurowings-logo.png',
    icon: '/eurowings-favi.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Eurowings. After being properly implemented with Eurowing’s specific features, I can offer much more.',
    styles: [
      {
        key: '--primary',
        value: '#8C164D',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#24A3CA',
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
  finnair: {
    title: 'Finnair AI Advisor',
    flightIcon: '/flightIcons/flight_icon_finnair.svg',
    logo: '/finnair-logo.png',
    icon: '/finnair-favi.jpeg',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Finnair. After being properly implemented with Finnair’s specific features, I can offer much more.',
    styles: [
      {
        key: '--primary',
        value: '#040C64',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#7F89F9',
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
  gotogate: {
    title: 'Gotogate AI Advisor',
    flightIcon: '/flightIcons/flight_icon_gotogate.svg',
    logo: '/gotogate-logo.png',
    icon: '/gotogate-favi.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Gotogate. After being properly implemented with Gotogate’s specific features, I can offer much more. At the moment, I am using API of Kiwi, but I can use Gotogate’s search results.',
    styles: [
      {
        key: '--primary',
        value: '#0C9CF4',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: 'black',
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
  hopper: {
    title: 'Hopper AI Advisor',
    flightIcon: '/flightIcons/flight_icon_hopper.svg',
    logo: '/hopper-logo.png',
    icon: '/hopper-favi.jpeg',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Hopper. After being properly implemented with Hopper’s specific features, I can offer much more. At the moment, I am using API of Kiwi, but I can use Hopper’s search results.',
    styles: [
      {
        key: '--primary',
        value: '#FC6B6C',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#FC6B6C',
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
  jetblue: {
    title: 'jetBlue AI Advisor',
    flightIcon: '/flightIcons/flight_icon_jetblue.svg',
    logo: '/jetblue-logo.png',
    icon: '/jetblue-favi.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with jetBlue. After being properly implemented with jetBlue’s specific features, I can offer much more.',
    styles: [
      {
        key: '--primary',
        value: '#00205b',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#fe6532',
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
  klm: {
    title: 'KLM AI Advisor',
    flightIcon: '/flightIcons/flight_icon_klm.svg',
    logo: '/klm-logo.png',
    icon: '/klm-logo.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with KLM. After being properly implemented with KLM’s specific features, I can offer much more.',
    styles: [
      {
        key: '--primary',
        value: '#04A4E4',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#7CD8FC',
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
  lastminute: {
    title: 'Lastminute.com AI Advisor',
    flightIcon: '/flightIcons/flight_icon_lastminute.svg',
    logo: '/lastminute.com-logo.png',
    icon: '/lastminute-favi.jpeg',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Lastminute.com. After being properly implemented with Lastminute.com specific features, I can offer much more. At the moment, I am using API of Kiwi, but I can use Lastminute.com search results.',
    styles: [
      {
        key: '--primary',
        value: '#EC2C91',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#4972D1',
      },
      {
        key: '--tertiary',
        value: '#b5b5b5',
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
  letuska: {
    title: 'Letuska.cz AI Advisor',
    flightIcon: '/flightIcons/flight_icon_letuska.svg',
    logo: '/letuska-logo.png',
    icon: '/letuska-favi.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Letuska.cz. After being properly implemented with Letuska.cz specific features, I can offer much more. At the moment, I am using API of Kiwi, but I can use Letuska.cz search results.',
    styles: [
      {
        key: '--primary',
        value: '#2f5572',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#D45C24',
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
  liligo: {
    title: 'Liligo AI Advisor',
    flightIcon: '/flightIcons/flight_icon_liligo.svg',
    logo: '/liligo-logo.png',
    icon: '/liligo-favi.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Liligo. After being properly implemented with Liligo’s specific features, I can offer much more. At the moment, I am using API of Kiwi, but I can use Liligo’s search results.',
    styles: [
      {
        key: '--primary',
        value: '#00223e',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#C4EC04',
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
  norvegian: {
    title: 'Norvegian AI Advisor',
    flightIcon: '/flightIcons/flight_icon_norvegian.svg',
    logo: '/norwegian-logo.png',
    icon: '/norwegian-favi.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Norvegian. After being properly implemented with Norvegian’s specific features, I can offer much more.',
    styles: [
      {
        key: '--primary',
        value: '#002a3a',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#D41839',
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
  pelikan: {
    title: 'Pelikán AI Advisor',
    flightIcon: '/flightIcons/flight_icon_pelikan.svg',
    logo: '/pelikan-logo.png',
    icon: '/pelikan-favi.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Pelikán. After being properly implemented with Pelikán’s specific features, I can offer much more. At the moment, I am using API of Kiwi, but I can use Pelikán’s search results.',
    styles: [
      {
        key: '--primary',
        value: '#EC7404',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#F4BC8C',
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
  qantas: {
    title: 'Qantas AI Advisor',
    flightIcon: '/flightIcons/flight_icon_qantas.svg',
    logo: '/qantas-logo.png',
    icon: '/qantas-favi.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Qantas. After being properly implemented with Qanta’s specific features, I can offer much more.',
    styles: [
      {
        key: '--primary',
        value: '#e40000',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#323232',
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
  qatar: {
    title: 'Qatar AI Advisor',
    flightIcon: '/flightIcons/flight_icon_qatar.svg',
    logo: '/qatar-logo.png',
    icon: '/qatar-favi.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Qatar. After being properly implemented with Qatar’s specific features, I can offer much more.',
    styles: [
      {
        key: '--primary',
        value: '#5c0931',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#ffa903',
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
  ryanair: {
    title: 'Ryanair AI Advisor',
    flightIcon: '/flightIcons/flight_icon_ryanair.svg',
    logo: '/ryanair-logo.png',
    icon: '/ryanair-favi.jpeg',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Ryanair. After being properly implemented with Ryanair’s specific features, I can offer much more.',
    styles: [
      {
        key: '--primary',
        value: '#073590',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: ' #F4D75F',
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
  sas: {
    title: 'SAS AI Advisor',
    flightIcon: '/flightIcons/flight_icon_sas.svg',
    logo: '/sas-logo.png',
    icon: '/sas-favi.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with SAS. After being properly implemented with SAS’s specific features, I can offer much more.',
    styles: [
      {
        key: '--primary',
        value: '#2C3484',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#e1bf93',
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
  skiplagged: {
    title: 'Skiplagged AI Advisor',
    flightIcon: '/flightIcons/flight_icon_skiplagged.svg',
    logo: '/skiplagged-logo.png',
    icon: '/skiplagged-favi.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Skiplagged. After being properly implemented with Skiplagged’s specific features, I can offer much more. At the moment, I am using API of Kiwi, but I can use Skiplagged’s search results.',
    styles: [
      {
        key: '--primary',
        value: '#14648C',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#96B9CD',
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
  skyscanner: {
    title: 'Skyscanner AI Advisor',
    flightIcon: '/flightIcons/flight_icon_skyscanner.svg',
    logo: '/skyscanner-logo.png',
    icon: '/skyscanner-favi.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Skyscanner. After being properly implemented with Skyscanner’s specific features, I can offer much more. At the moment, I am using API of Kiwi, but I can use Skyscanner’s search results.',
    styles: [
      {
        key: '--primary',
        value: '#05203c',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#0062e3',
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
  southwest: {
    title: 'Southwest AI Advisor',
    flightIcon: '/flightIcons/flight_icon_southwest.svg',
    logo: '/southwest-logo.png',
    icon: '/southwest-favi.jpeg',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Southwest. After being properly implemented with Southwest’s specific features, I can offer much more.',
    styles: [
      {
        key: '--primary',
        value: '#2C4BB3',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#ffbf27',
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
  studentagency: {
    title: 'Student Agency AI Advisor',
    flightIcon: '/flightIcons/flight_icon_studentagency.svg',
    logo: '/student-logo.png',
    icon: '/student-logo.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Student Agency. After being properly implemented with specific features of Student Agency, I can offer much more. At the moment, I am using API of Kiwi, but I can use Student Agency’s search results.',
    styles: [
      {
        key: '--primary',
        value: '#044C9C',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#FFDC7E',
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
  travala: {
    title: 'Travala AI Advisor',
    flightIcon: '/flightIcons/flight_icon_travala.svg',
    logo: '/travala-logo.svg',
    icon: '/travala-favi.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Travala. After being properly implemented with Travala’s specific features, I can offer much more. At the moment, I am using API of Kiwi, but I can use Travala’s search results.',
    styles: [
      {
        key: '--primary',
        value: '#2D2D4F',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#006bba',
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
  traveloka: {
    title: 'Traveloka AI Advisor',
    flightIcon: '/flightIcons/flight_icon_traveloka.svg',
    logo: '/traveloka-logo.png',
    icon: '/traveloka-favi.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Traveloka. After being properly implemented with Traveloka’s specific features, I can offer much more. At the moment, I am using API of Kiwi, but I can use Traveloka’s search results.',
    styles: [
      {
        key: '--primary',
        value: '#323232',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#249CCE',
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
  tripadvisor: {
    title: 'Tripadvisor AI Advisor',
    flightIcon: '/flightIcons/flight_icon_tripadvisor.svg',
    logo: '/tripadvisor-logo.png',
    icon: '/tripadvisor-favi.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Tripadvisor. After being properly implemented with Tripadvisor’s specific features, I can offer much more. At the moment, I am using API of Kiwi, but I can use Tripadvisor’s search results.',
    styles: [
      {
        key: '--primary',
        value: '#35E4A4',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: 'black',
      },
      {
        key: '--primary-text',
        value: 'black',
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
  united: {
    title: 'United AI Advisor',
    flightIcon: '/flightIcons/flight_icon_united.svg',
    logo: '/united-logo.png',
    icon: '/united-favi.png',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with United. After being properly implemented with United’s specific features, I can offer much more.',
    styles: [
      {
        key: '--primary',
        value: '#002244',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#b5b5b5',
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
  virginatlantic: {
    title: 'Virgin Atlantic AI Advisor',
    flightIcon: '/flightIcons/flight_icon_virginatlantic.svg',
    logo: '/virgin-logo.png',
    icon: '/virgin-favi.jpeg',
    starterMessage:
      'Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Virgin Atlantic. After being properly implemented with Virgin Atlantic’s specific features, I can offer much more.',
    styles: [
      {
        key: '--primary',
        value: '#723080',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#e1163c',
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
  wow: {
    title: 'Wow Air AI Advisor',
    flightIcon: '/flightIcons/flight_icon_wow.svg',
    logo: '/wow-logo.png',
    icon: '/wow-logo.png',
    starterMessage:
      ' Hello, I am your AI travel advisor. I will assist you in discovering dream destinations with Wow Air. After being properly implemented with Wow Air’s specific features, I can offer much more.',
    styles: [
      {
        key: '--primary',
        value: '#9C238C',
      },
      {
        key: '--secondary',
        // value: '#e8edf1',
        value: '#f4f6f9',
      },
      {
        key: '--tertiary',
        value: '#9C238C',
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
};
