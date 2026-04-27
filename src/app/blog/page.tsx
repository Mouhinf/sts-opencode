"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Calendar, User, ChevronRight, Loader2 } from "lucide-react";
import { getPublishedBlogPosts } from "@/lib/firebase/collections";

const categories = ["Tous", "Immobilier", "Transport", "Agrobusiness", "Formation", "Actualités"];

function BlogSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1,2,3,4,5,6].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-t-xl" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BlogIndex() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Tous");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    setLoading(true);
    getPublishedBlogPosts()
      .then(setBlogs)
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = blogs.filter(b => {
    const matchCat = category === "Tous" || b.category === category;
    const matchSearch = !search || b.title?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <main>
      <section className="relative py-16 bg-gradient-to-br from-sts-black via-[#0F3D1F] to-sts-black">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Notre Blog & Actualités</h1>
          <p className="text-xl text-sts-gray">Conseils, actualités et insights</p>
        </div>
      </section>

      <section className="py-8 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sts-gray" />
              <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-sts-green focus:border-transparent" />
            </div>
            {categories.map(cat => (
              <button key={cat} onClick={() => { setCategory(cat); setPage(1); }} className={`px-4 py-2 rounded-lg transition-colors ${category === cat ? "bg-sts-green text-white" : "bg-sts-surface text-sts-gray hover:bg-sts-green/10"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? <BlogSkeleton /> : paginated.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sts-gray text-lg">Aucun article trouvé</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((post, i) => (
                  <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link href={`/blog/${post.slug || post.id}`}>
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:-translate-y-2 transition-transform">
                        <div className="h-48 bg-sts-green/10 flex items-center justify-center">
                          {post.coverImage ? <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" /> : <span className="text-4xl">📰</span>}
                        </div>
                        <div className="p-4">
                          {post.category && <span className="inline-block px-2 py-1 bg-sts-green/10 text-sts-green text-xs rounded mb-2">{post.category}</span>}
                          <h2 className="font-bold text-lg text-sts-black mb-2 line-clamp-2">{post.title}</h2>
                          <p className="text-sts-gray text-sm mb-3 line-clamp-2">{post.excerpt || post.content?.substring(0, 100)}</p>
                          <div className="flex items-center gap-4 text-xs text-sts-gray">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.createdAt?.toDate ? new Date(post.createdAt.toDate()).toLocaleDateString("fr-FR") : ""}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-lg ${page === i + 1 ? "bg-sts-green text-white" : "bg-sts-surface text-sts-gray"}`}>{i + 1}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}