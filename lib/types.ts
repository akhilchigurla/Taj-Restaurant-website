export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_veg: boolean;
  is_featured: boolean;
  is_available: boolean;
  created_at: string;
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total: number;
  status: string;
  delivery_address: string;
  delivery_phone: string;
  created_at: string;
}
