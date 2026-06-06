
import { useState } from "react";

import { Modal } from "@/components/ui/Modal";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count?: { products: number };
}

export default function CategoryManager({
  initialCategories,
  onRefresh,
}: {
  initialCategories: Category[];
  onRefresh?: () => void;
}) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "" });
    setEditingCategory(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (cat: Category) => {
    setDeletingCategory(cat);
    setIsDeleteModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!editingCategory) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      setFormData({ ...formData, name, slug });
    } else {
      setFormData({ ...formData, name });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";

      const res = await fetch(url, {
        method: editingCategory ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        onRefresh?.();
      } else {
        const data = await res.json();
        alert(data.error || "Error al guardar categoría");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/${deletingCategory.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setIsDeleteModalOpen(false);
        setDeletingCategory(null);
        onRefresh?.();
      } else {
        const data = await res.json();
        alert(data.error || "Error al eliminar categoría");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6 font-body pb-12">
        <div className="flex justify-between items-start sm:items-center mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestión de Categorías</h1>
            <p className="mt-1 text-sm text-gray-500">Administra las agrupaciones de productos en el catálogo de Refrescana.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create New Category Card */}
          <button 
            onClick={handleOpenCreate}
            className="bg-[#fcfdfc] rounded-2xl border border-dashed border-gray-300 p-6 flex flex-col items-center justify-center min-h-[220px] hover:bg-gray-50 hover:border-gray-400 transition-colors group"
          >
            <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 group-hover:text-gray-600 mb-4 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Crear Nueva Categoría</h3>
            <p className="text-xs text-center text-gray-500 leading-relaxed max-w-[200px]">
              Añade una nueva agrupación para organizar el inventario.
            </p>
          </button>

          {/* Existing Categories */}
          {initialCategories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-6 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#f0fdf4] text-[#1C442A] flex items-center justify-center shrink-0">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-[#ebf8f0] text-[#1e8a4a]">
                    Activa
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">{cat.name}</h3>
                <p className="text-[13px] text-gray-500 line-clamp-3 leading-relaxed">
                  {cat.description || "Sin descripción proporcionada para esta categoría."}
                </p>
              </div>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                <div>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Total Productos</p>
                  <p className="text-xl font-bold text-gray-900">{cat._count?.products || 0}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleOpenEdit(cat)} 
                    className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors" 
                    title="Editar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button 
                    onClick={() => handleOpenDelete(cat)} 
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" 
                    title="Eliminar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingCategory ? "Editar Categoría" : "Crear Categoría"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Categoría</label>
            <input 
              type="text" required value={formData.name} onChange={handleNameChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              placeholder="Ej. Bebidas Calientes"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL amigable)</label>
            <input 
              type="text" required value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea 
              rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              placeholder="Describe los productos de esta categoría..."
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-[#1C442A] hover:bg-[#13301d] rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
              {isLoading ? "Guardando..." : editingCategory ? "Guardar Cambios" : "Guardar Categoría"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setDeletingCategory(null); }} title="Confirmar Eliminación">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div>
              <p className="text-sm font-medium text-red-800">¿Estás seguro de eliminar esta categoría?</p>
              <p className="text-sm text-red-700 mt-1">
                <strong>{deletingCategory?.name}</strong> será eliminada permanentemente.
                {(deletingCategory?._count?.products || 0) > 0 && (
                  <> Esta categoría tiene <strong>{deletingCategory?._count?.products}</strong> producto(s) asociado(s) y no podrá ser eliminada hasta que los muevas.</>
                )}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => { setIsDeleteModalOpen(false); setDeletingCategory(null); }} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              Cancelar
            </button>
            <button onClick={handleDelete} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50">
              {isLoading ? "Eliminando..." : "Sí, Eliminar"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
