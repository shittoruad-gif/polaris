import BlogClient from './client';

export default function BlogPage() {
  return (
    <div>
      <p className="text-xs tracking-widest text-gray-400">CONTENT</p>
      <h1 className="font-serif text-2xl font-bold mb-6">AIコンテンツ生成</h1>
      <BlogClient />
    </div>
  );
}
