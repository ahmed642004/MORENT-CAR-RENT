export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps {
  label: string;
  placeholder: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
}

export type Car = {
  id: number;
  name: string;
  category: string;
  fuel: number;
  transmission: "Manual" | "Automatic";
  people: number;
  price: number;
  oldPrice?: number;
  image: string;
  popular?: boolean;
  title?: string;
  subtitle?: string;
  thumbnail: string[];
  recommended?: boolean;
  slug: string;
  description?: string;
  rating: number;
  reviewCount?: number;
};
