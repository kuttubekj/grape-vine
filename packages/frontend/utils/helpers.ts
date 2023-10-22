export const beautifyAddress = (addr: string) =>
    `${addr?.substring(0, 5)}...${addr?.substring(37)}`

export const isJson = (item: string): boolean => {
    let value = typeof item !== "string" ? JSON.stringify(item) : item;
    try {
        value = JSON.parse(value);
    } catch (e) {
        return false;
    }

    return typeof value === "object" && value !== null;
}

export const uid = function(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}