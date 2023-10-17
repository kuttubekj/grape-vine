export const beautifyAddress = (addr: string) =>
    `${addr?.substring(0, 5)}...${addr?.substring(37)}`

