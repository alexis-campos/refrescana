
import { useCartStore } from "@/lib/store/useCartStore";
import type { ClientProduct } from "@/components/sections/productos/ProductosContent";

interface AddToCartButtonProps {
  product: ClientProduct;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={product.stock <= 0}
      className="px-8 py-3 bg-[#1C442A] text-white rounded-full font-medium hover:bg-[#13301d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#1C442A]/20"
    >
      Agregar al carrito
    </button>
  );
}
