'use client';

import React from 'react';
import Image from 'next/image';

const EDITORIAL_ITEMS = [
    {
        title: "The Art of Minimalism",
        description: "In a world of constant noise, we find beauty in the quiet. Our winter collection focuses on essential forms and premium materials.",
        imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80",
        category: "Design Philosophy"
    },
    {
        title: "Craftsmanship in Every Detail",
        description: "Each piece is crafted by artisans who have dedicated their lives to mastering their craft. We don't just make products; we create lasting companions.",
        imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80",
        category: "Our Process"
    }
];

export default function EditorialPage() {
    return (
        <main className="max-w-7xl mx-auto px-6 py-12">
            <header className="mb-20 text-center">
                <p className="text-sm font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">The Journal</p>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8">
                    GRAVITY <br /> EDITORIAL.
                </h2>
                <p className="text-neutral-500 max-w-xl mx-auto text-lg leading-relaxed">
                    A deep dive into our creative process, the stories behind our collections, and the people who make it all possible.
                </p>
            </header>

            <section className="space-y-32">
                {EDITORIAL_ITEMS.map((item, index) => (
                    <article key={item.title} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:direction-rtl' : ''}`}>
                        <div className={`relative aspect-[16/10] lg:aspect-square overflow-hidden rounded-3xl ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                            <Image 
                                src={item.imageUrl} 
                                alt={item.title} 
                                fill 
                                className="object-cover hover:scale-105 transition-transform duration-1000"
                            />
                        </div>
                        <div className="space-y-6">
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-600">{item.category}</span>
                            <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                                {item.title}
                            </h3>
                            <p className="text-neutral-500 text-lg leading-relaxed">
                                {item.description}
                            </p>
                            <button className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-emerald-600 hover:border-emerald-600 transition-all">
                                Read More
                            </button>
                        </div>
                    </article>
                ))}
            </section>

            <footer className="mt-32 py-20 bg-neutral-900 rounded-3xl text-white text-center">
                <h4 className="text-3xl font-black mb-6">Stay Inspired.</h4>
                <p className="text-neutral-400 mb-8">Join our newsletter for weekly updates on design and culture.</p>
                <div className="flex max-w-md mx-auto gap-4">
                    <input type="email" placeholder="Email Address" className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 text-sm outline-none focus:border-white transition-colors" />
                    <button className="px-8 py-3 bg-white text-black rounded-full font-black text-sm uppercase tracking-widest hover:bg-emerald-500 transition-colors">Join</button>
                </div>
            </footer>
        </main>
    );
}