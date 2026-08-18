import slugify from "slugify";

export const generateSlug = (text: string): string => {
  return slugify(text, { lower: true, strict: true, trim: true });
};

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HS-${timestamp}-${random}`;
};

export const generateSKU = (category: string, id: number): string => {
  const prefix = category.substring(0, 3).toUpperCase();
  return `${prefix}-${String(id).padStart(5, "0")}`;
};

export const calculateDiscount = (price: number, discount: number): number => {
  return price - (price * discount) / 100;
};

export const paginate = (page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;
  return { skip, limit };
};
