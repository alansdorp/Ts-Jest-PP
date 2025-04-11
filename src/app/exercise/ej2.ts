export interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
}

const CACHE_EXPIRATION_TIME = 60 * 1000; // 1 minuto en milisegundos

export class ProductService {
    async getProducts(): Promise<Product[]> {
        const cachedData = localStorage.getItem('products_cache');
        const cacheTimestamp = localStorage.getItem('products_cache_timestamp');

        if (cachedData && cacheTimestamp && (Date.now() - parseInt(cacheTimestamp, 10)) < CACHE_EXPIRATION_TIME) {
            return JSON.parse(cachedData);
        }

        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        localStorage.setItem('products_cache', JSON.stringify(products));
        localStorage.setItem('products_cache_timestamp', Date.now().toString());
        return products;
    }

    async getProductDetails(productId: string): Promise<Product> {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    addProductToFavorites(productId: string): void {
        const favorites = localStorage.getItem('favorite_products');
        const favoriteList = favorites ? JSON.parse(favorites) : [];
        if (!favoriteList.includes(productId)) {
            favoriteList.push(productId);
            localStorage.setItem('favorite_products', JSON.stringify(favoriteList));
        }
    }

    getFavoriteProducts(): string[] {
        const favorites = localStorage.getItem('favorite_products');
        return favorites ? JSON.parse(favorites) : [];
    }
}

/*
import React, { useState, useEffect } from 'react';

const productService = new ProductService();

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getProducts();
                setProducts(data);
                setLoading(false);
            } catch (err: any) {
                setError('Error al cargar los productos');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <p>Cargando productos...</p>;
    }

    if (error) {
        return <p style={ { color: 'red' } }> { error } </p>;
    }

    return (
        <div>
        <h2>Lista de Productos </h2>
            <ul>
    {
        products.map(product => (
            <li key= { product.id } > { product.name } </li>
        ))
    }
    </ul>
        </div>
  );
};

export default ProductList;*/