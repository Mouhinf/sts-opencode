import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { Calendar, User, Tag, Share2, MessageCircle, ArrowLeft, Clock, Send } from "lucide-react";
import { getPublishedBlogPosts } from "@/lib/firebase/collections";
import { db, adminInitialized } from "@/lib/firebase/admin";
import { increment } from "firebase/firestore";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = await getPublishedBlogPosts();
    return posts.map((post) => ({ slug: post.slug || post.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const posts = await getPublishedBlogPosts();
    const post = posts.find(p => (p.slug || p.id) === slug);
    if (!post) return { title: "Article non trouvé" };
    return {
      title: `${post.title} | Blog STS`,
      description: post.excerpt || post.content?.slice(0, 160),
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.coverImage ? [post.coverImage] : [],
      },
    };
  } catch {
    return { title: "Blog STS" };
  }
}

async function incrementViews(slug: string) {
  if (!adminInitialized || !db) return;
  try {
    const posts = await getPublishedBlogPosts();
    const post = posts.find(p => (p.slug || p.id) === slug);
    if (post?.id) {
      const docRef = db.collection("blog_posts").doc(post.id);
      await docRef.update({ views: increment(1) });
    }
  } catch {}
}

const siteUrl = "https://sts-sofitrans.com";

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  let post: any = null;

  try {
    const posts = await getPublishedBlogPosts();
    post = posts.find(p => (p.slug || p.id) === slug);
    if (!post) {
      const allPosts = await getPublishedBlogPosts();
      post = allPosts.find(p => p.id === slug);
    }
  } catch {}

  if (!post) {
    notFound();
  }

  await incrementViews(slug);

  const posts = await getPublishedBlogPosts().catch(() => []);
  const recent = posts.filter(p => (p.slug || p.id) !== slug).slice(0, 3);

  const articleUrl = `${siteUrl}/blog/${slug}`;

  return (
    <main>
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sts-gray hover:text-sts-green">
            <ArrowLeft className="w-4 h-4" /> Retour au blog
          </Link>
        </div>
      </section>

      <article>
        <div className="h-64 md:h-96 bg-sts-green/10 flex items-center justify-center">
          {post.coverImage ? (
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl">📰</span>
          )}
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-4 gap-12">
            <div className="lg:col-span-3">
              {post.category && <span className="inline-block px-3 py-1 bg-sts-green text-white text-sm rounded mb-4">{post.category}</span>}
              <h1 className="text-3xl md:text-4xl font-bold text-sts-black mb-4">{post.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-sts-gray mb-8">
                <span className="flex items-center gap-1"><User className="w-4 h-4" />{post.author || "STS"}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{post.createdAt?.toDate ? new Date(post.createdAt.toDate()).toLocaleDateString("fr-FR") : ""}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.views || 0} vues</span>
              </div>

              <div className="prose max-w-none">
                <ReactMarkdown>{post.content || ""}</ReactMarkdown>
              </div>

              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
                  <Tag className="w-4 h-4 text-sts-gray" />
                  {post.tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-sts-surface text-sts-gray text-sm rounded-full">{tag}</span>
                  ))}
                </div>
              )}

              <div className="flex gap-4 mt-8 pt-8 border-t">
                <span className="text-sts-gray">Partager :</span>
                <a href={`https://wa.me/?text=${encodeURIComponent(post.title + " " + articleUrl)}`} className="text-sts-green" target="_blank" rel="noopener noreferrer" aria-label="Partager sur WhatsApp">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`} className="text-sts-blue" target="_blank" rel="noopener noreferrer" aria-label="Partager sur Facebook">
                  <Share2 className="w-5 h-5" />
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`} className="text-sts-blue" target="_blank" rel="noopener noreferrer" aria-label="Partager sur LinkedIn">
                  <Share2 className="w-5 h-5" />
                </a>
              </div>
            </div>

            <aside className="lg:col-span-1">
              <div className="bg-sts-surface p-4 rounded-lg mb-8">
                <h3 className="font-bold text-sts-black mb-4">Articles récents</h3>
                <div className="space-y-4">
                  {recent.length === 0 ? (
                    <p className="text-sm text-sts-gray">Aucun autre article</p>
                  ) : (
                    recent.map((p: any) => (
                      <Link key={p.id} href={`/blog/${p.slug || p.id}`} className="block hover:text-sts-green">
                        <p className="font-medium text-sm line-clamp-2">{p.title}</p>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-sts-green p-4 rounded-lg mt-8 text-white">
                <h3 className="font-bold mb-2">Newsletter</h3>
                <p className="text-sm text-white/80 mb-4">Recevez nos actualités</p>
                <form action="/api/newsletter" method="POST" className="space-y-2">
                  <input type="email" name="email" placeholder="Votre email" className="w-full px-3 py-2 rounded text-sts-black" required />
                  <button type="submit" className="w-full bg-white text-sts-green font-bold py-2 rounded hover:bg-white/90 flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" /> S'abonner
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </main>
  );
}