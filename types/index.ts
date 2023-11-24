export interface OpenAIModel {
  id: string;
  name: string;
}

export enum OpenAIModelID {
  GPT_3_5 = 'gpt-3.5-turbo',
  GPT_4 = 'gpt-4',
}

export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
  [OpenAIModelID.GPT_3_5]: {
    id: OpenAIModelID.GPT_3_5,
    name: 'Default (GPT-3.5)',
  },
  [OpenAIModelID.GPT_4]: {
    id: OpenAIModelID.GPT_4,
    name: 'GPT-4',
  },
};

export interface Message {
  role: Role;
  content: string;
  typeOfMessage: TypeOfMessage;
  typeOfPrompt?: TypeOfPrompt;
  id?: string;
  part_id?: number;
  fe_part_id?: number;
  flightParams?: IFlightParamsConverted;
  mapData?: IMapDataConverted[];
}

export type Role = 'user' | 'earth.guide' | 'sample' | 'starter';

export enum TypeOfMessage {
  TEXT = 'text',
  FLIGHT_PARAMS = 'flightParams',
  MAP = 'map',
}

export interface Conversation {
  id: number;
  name: string;
  messages: Message[];
  model: OpenAIModel;
  prompt: string;
}

export interface ChatBody {
  model: OpenAIModel;
  messages: Message[];
  key: string;
  prompt: string;
}

export interface KeyValuePair {
  key: string;
  value: any;
}

// keep track of local storage schema
export interface LocalStorage {
  conversationHistory: Conversation[];
  selectedConversation: Conversation;
  theme: 'light' | 'dark';
  MachineId: string;
}

export interface EarthGuideQuestionBody {
  type_of_prompt: TypeOfPrompt;
  text: string;
  user_identification: string;
  language_of_browser: string;
  city_of_user: string;
  type_of_device: string;
  gps: string;
}

interface Translations<T> {
  en: T;
  translation: T;
}

export interface TranslateRequestBody {
  specific_airlines?: string;
  language_of_browser?: string;
}
export interface TranslateResponseBody<T> {
  [key: string]: Translations<T>;
}

export enum WhereToDisplay {
  BODY = 'body',
  PANEL_DESTINATION = 'panel_dest',
  PANEL_FLIGHTS = 'panel_flights',
}

export enum TypeOfPrompt {
  TEXT_PROMPT = 'text_prompt',
  CLICK_ON_LOCATION = 'click_on_location',
  CLICK_ON_PRICE = 'click_on_price',
  MORE_PLACES = 'more_places',
  LESSER_KNOWN = 'lesser-known',
  MORE_LIKE = 'more_like…',
  FT_BODY = 'flight_tickets_body',
}

export interface EarthGuideQuestionResponse {
  formatted_text: string;
  id_answer: string;
  part_id: number;
  where_to_display: WhereToDisplay;
  done?: boolean;
  end_of_bubble?: boolean;
  json_type?: string;
  additional_data?: string;
  comment?: string;
  promt_text?: string;
}

export interface IpData {
  ip: string;
  city: string;
  gps: string;
  country: string;
  state: string;
}

export enum DeviceTypes {
  COMPUTER = 'computer',
  MOBILE = 'mobile',
  TABLET = 'tablet',
}

export interface PanelData {
  type: WhereToDisplay;
  content: string;
  id: number;
}

export interface ToggleItem {
  type: WhereToDisplay;
  label: string;
}

export enum FeedbackEnum {
  OK = '+',
  NOT_OK = '-',
}

export interface IRateAnswer {
  id_answer: string;
  feedback: FeedbackEnum;
  part_id?: number;
}

export interface IMapDataObtained {
  comment: { chunks: string[] };
  flightickets: string;
  gps: string;
  id: string;
  location: string;
  photos: string;
  price: string;
  flightUrl: string;
}

export interface IMapDataConverted {
  gps: { latitude: number; longitude: number };
  id: string;
  locationTitle: string;
  photos: string[];
  price: string;
  flightUrl: string;
}

export enum FLIGHT_TYPES {
  ONEWAY = 'oneway',
  ROUNDTRIP = 'round',
}

export interface IFlightParamsObtained {
  curr?: string;
  date_from?: string;
  date_to?: string;
  departure_airport?: string;
  flight_type?: FLIGHT_TYPES;
  fly_from_lat?: string;
  fly_from_lon?: string;
  fly_from_radius?: string;
  nights_in_dst_from?: number;
  nights_in_dst_to?: number;
  return_from?: string;
  return_to?: string;
}

export interface IFlightParamsConverted {
  curr: string;
  date_from?: Date;
  date_to?: Date;
  departure_airport?: string;
  departure_airport_set?: boolean;
  flight_type: FLIGHT_TYPES;
  locality?: string;
  fly_from_lat?: number;
  fly_from_lon?: number;
  fly_from_radius: number;
  nights_in_dst_from?: number;
  nights_in_dst_to?: number;
  return_from?: Date;
  return_to?: Date;
  comment?: string;
}
