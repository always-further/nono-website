"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { type Testimonial } from "@/types/testimonial";

const AUTOPLAY_MS = 4500;

type TestimonialsProps = {
  testimonials: Testimonial[];
  embedded?: boolean;
};

export default function Testimonials({
  testimonials,
  embedded = false,
}: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length === 0) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  const content = (
    <>
      {!embedded && (
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">What people say</h2>
          <span className="text-accent text-sm md:text-base">Testimonials</span>
        </div>
      )}

      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-[#030716]">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <article
              key={`${testimonial.name}-${index}`}
              className="min-w-full p-6 md:p-8"
            >
              <div className="flex items-start gap-4">
                <Image
                  src={testimonial.avatar}
                  alt={`${testimonial.name} avatar`}
                  width={42}
                  height={42}
                  className="h-[42px] w-[42px] rounded-full border border-border/70 object-cover shrink-0"
                />

                <div>
                  <p className="text-sm md:text-base font-light leading-relaxed text-[#d7dbe8]">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <p className="mt-4 text-sm text-[#b8bfd3]">{testimonial.name}</p>
                  <p className="text-sm text-[#9aa3ba]">{testimonial.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all ${
              activeIndex === index
                ? "w-8 bg-accent"
                : "w-2 bg-white/25 hover:bg-white/40"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </>
  );

  if (embedded) {
    return <div className="mt-8 mx-auto max-w-3xl w-full">{content}</div>;
  }

  return (
    <section className="py-24 px-6 bg-black">
      <div className="max-w-4xl mx-auto">{content}</div>
    </section>
  );
}
