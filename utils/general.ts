export const truncate = (str: string, limit: number = 20) => (str.length > limit ? `${str.slice(0, limit)}...` : str)
