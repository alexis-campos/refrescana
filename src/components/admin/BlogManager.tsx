
import { useState, useRef, useMemo } from "react";

import { Modal } from "@/components/ui/Modal";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  imageUrl: string | null;
  createdAt: string | Date;
}

export default function BlogManager({
  initialPosts,
  onRefresh,
}: {
  initialPosts: BlogPost[];
  onRefresh?: () => void;
}) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    published: false,
  });

  const totalPublished = initialPosts.filter(p => p.published).length;
  const totalDrafts = initialPosts.length - totalPublished;

  // M-01: Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [publishedFilter, setPublishedFilter] = useState("all");

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((p) => {
      const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = publishedFilter === "all" || (publishedFilter === "published" ? p.published : !p.published);
      return matchesSearch && matchesFilter;
    });
  }, [initialPosts, searchQuery, publishedFilter]);

  const resetForm = () => {
    setFormData({ title: "", slug: "", content: "", published: false });
    setSelectedFile(null);
    setPreviewUrl(null);
    setEditingPost(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      published: post.published,
    });
    setPreviewUrl(post.imageUrl || null);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (post: BlogPost) => {
    setDeletingPost(post);
    setIsDeleteModalOpen(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!editingPost) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      setFormData({ ...formData, title, slug });
    } else {
      setFormData({ ...formData, title });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let imageUrl: string | null = editingPost?.imageUrl || null;

      if (selectedFile) {
        const fileData = new FormData();
        fileData.append("file", selectedFile);

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: fileData,
        });

        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          imageUrl = url;
        } else {
          alert("Error al subir la imagen");
          setIsLoading(false);
          return;
        }
      }

      const url = editingPost 
        ? `/api/admin/blog/${editingPost.id}`
        : "/api/admin/blog";

      const res = await fetch(url, {
        method: editingPost ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imageUrl,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        onRefresh?.();
      } else {
        const data = await res.json();
        alert(data.error || "Error al guardar artículo");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPost) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/blog/${deletingPost.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setIsDeleteModalOpen(false);
        setDeletingPost(null);
        onRefresh?.();
      } else {
        const data = await res.json();
        alert(data.error || "Error al eliminar artículo");
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
        <div className="flex justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestión de Blog</h1>
            <p className="mt-1 text-sm text-gray-500">Administra los artículos publicados y borradores.</p>
          </div>
          <button 
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-[#1C442A] text-white rounded-lg text-sm font-medium hover:bg-[#13301d] shadow-sm transition-colors flex items-center gap-2"
          >
            <span>+</span> Nuevo Artículo
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-6 flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#f0fdf4] text-[#1C442A] flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Publicados</p>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-4xl font-bold text-[#1C442A]">{totalPublished}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-6 flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gray-100 text-gray-500 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Borradores</p>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-4xl font-bold text-gray-900">{totalDrafts}</h3>
              <span className="text-xs font-medium text-gray-400 mb-1">Pendientes de revisión</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden mt-6">
          <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Artículos Recientes</h3>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text" placeholder="Buscar artículo..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>
              <select
                value={publishedFilter} onChange={(e) => setPublishedFilter(e.target.value)}
                className="text-sm bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              >
                <option value="all">Todos los estados</option>
                <option value="published">Publicados</option>
                <option value="draft">Borradores</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-1/2">Artículo</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Autor</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                      {initialPosts.length === 0 ? "No hay artículos en el blog." : "No se encontraron artículos con los filtros aplicados."}
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 bg-gray-100 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                            {post.imageUrl ? (
                               <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                               <div className="w-full h-full flex items-center justify-center text-gray-300">
                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                               </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[#1C442A]">{post.title}</div>
                            <div className="text-xs text-gray-500 line-clamp-1">{post.content.replace(/<[^>]+>/g, '').substring(0, 60)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#1C442A] text-white flex items-center justify-center text-[10px] font-bold">A</div>
                          <span className="text-sm text-gray-700 font-medium">Admin</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{new Date(post.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-[10px] font-bold tracking-widest uppercase ${
                          post.published ? 'text-[#1e8a4a]' : 'text-gray-500'
                        }`}>
                          {post.published ? 'Publicado' : 'Borrador'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-3 text-gray-400">
                          <button onClick={() => handleOpenEdit(post)} className="hover:text-gray-700 transition-colors" title="Editar"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                          <button onClick={() => handleOpenDelete(post)} className="hover:text-red-600 transition-colors" title="Eliminar"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingPost ? "Editar Artículo" : "Escribir Artículo"} maxWidth="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input 
                type="text" required value={formData.title} onChange={handleTitleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input 
                type="text" required value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm bg-gray-50"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenido (HTML permitido)</label>
              <textarea 
                rows={6} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen de Portada</label>
              <div className="flex items-center gap-4">
                <div className="w-32 h-20 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" alt="" /> : <span className="text-xs text-gray-400">Sin foto</span>}
                </div>
                <div>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-[#1C442A] hover:file:bg-green-100 transition-colors" />
                </div>
              </div>
            </div>
            <div className="sm:col-span-2 flex items-center mt-2">
              <input 
                type="checkbox" id="published" checked={formData.published} onChange={(e) => setFormData({...formData, published: e.target.checked})}
                className="w-4 h-4 text-[#1C442A] border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="published" className="ml-2 text-sm text-gray-700">Publicar inmediatamente (si no, se guarda como borrador)</label>
            </div>
          </div>
          <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 mt-6">
            <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-[#1C442A] hover:bg-[#13301d] rounded-lg disabled:opacity-50">
              {isLoading ? "Guardando..." : editingPost ? "Guardar Cambios" : "Guardar Artículo"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setDeletingPost(null); }} title="Confirmar Eliminación">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div>
              <p className="text-sm font-medium text-red-800">¿Estás seguro de eliminar este artículo?</p>
              <p className="text-sm text-red-700 mt-1">
                <strong>&ldquo;{deletingPost?.title}&rdquo;</strong> será eliminado permanentemente. Esta acción no se puede deshacer.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => { setIsDeleteModalOpen(false); setDeletingPost(null); }} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
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
