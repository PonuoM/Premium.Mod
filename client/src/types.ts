export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    isNew?: boolean;
    isBestSeller?: boolean;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Pending';

export interface Order {
    id: string;
    customerName: string;
    email: string;
    date: string;
    total: number;
    status: OrderStatus;
    items: number;
}
