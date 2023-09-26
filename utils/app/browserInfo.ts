import { DeviceTypes } from "@/types";

// function to get user's langauge from navigator object
export const getLanguage = (): string => {
    const browserLanguage = navigator.language;
    const language = browserLanguage.split('-')[0];
    return language;
}

// function to get device type from navigator.usaerAgent
export const getDeviceType = (): DeviceTypes => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return DeviceTypes.TABLET;
    }
    if (
        /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
            ua
        )
    ) {
        return DeviceTypes.MOBILE;
    }
    return DeviceTypes.COMPUTER;
};