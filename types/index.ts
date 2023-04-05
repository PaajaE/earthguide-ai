export interface OpenAIModel {
  id: string;
  name: string;
}

export enum OpenAIModelID {
  GPT_3_5 = "gpt-3.5-turbo",
  GPT_4 = "gpt-4"
}

export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
  [OpenAIModelID.GPT_3_5]: {
    id: OpenAIModelID.GPT_3_5,
    name: "Default (GPT-3.5)"
  },
  [OpenAIModelID.GPT_4]: {
    id: OpenAIModelID.GPT_4,
    name: "GPT-4"
  }
};

export interface Message {
  role: Role;
  content: string;
  id?: string;
}

export type Role = "assistant" | "user" | "earth.guide";

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
  apiKey: string;
  conversationHistory: Conversation[];
  selectedConversation: Conversation;
  theme: "light" | "dark";
}

export interface EarthGuideQuestionBody {
  type_of_prompt: TypeOfPrompt,
  text: string,
  user_identification: string,
  language_of_browser: string,
  city_of_user: string,
  type_of_device: string,
  gps: string
}

export enum WhereToDisplay {
  BODY = 'body',
  PANEL_DESTINATION = 'panel_dest',
  PANEL_FLIGHTS = 'panel_flights'
}

export enum TypeOfPrompt {
  TEXT_PROMPT = 'text_prompt',
  CLICK_ON_LOCATION = 'click_on_location',
  CLICK_ON_PRICE = 'click_on_price',
  MORE_PLACES = 'more_places',
  LESSER_KNOWN = 'lesser-known',
  MORE_LIKE = 'more_like…'
}

export interface EarthGuideQuestionResponse {
  "anwer_datetime": string,
  "formated_text": string,
  "id_answer": string,
  "where_to_display": WhereToDisplay
}

export interface IpData {
  ip: string;
  city: string;
  gps: string;
}

export enum DeviceTypes {
  COMPUTER = 'computer',
  MOBILE = 'mobile',
  TABLET = 'tablet'
}

export interface PanelData {
  type: WhereToDisplay;
  content: string;
}

export interface ToggleItem {
  type: WhereToDisplay;
  label: string;
}