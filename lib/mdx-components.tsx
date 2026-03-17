import React from "react";
import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "@/components/blog/mdx/CodeBlock";
import { Admonition } from "@/components/blog/mdx/Admonition";
import { BlogImage } from "@/components/blog/mdx/BlogImage";
import { Anchor } from "@/components/blog/mdx/Anchor";

export function getMdxComponents(): MDXComponents {
  return {
    pre: ({ children }) => {
      // Pass data-block prop to child code element to distinguish from inline code
      if (React.isValidElement(children) && children.type === CodeBlock) {
        return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, { "data-block": true });
      }
      return <>{children}</>;
    },
    code: CodeBlock as MDXComponents["code"],
    h1: (props) => <Anchor level={1} {...props} />,
    h2: (props) => <Anchor level={2} {...props} />,
    h3: (props) => <Anchor level={3} {...props} />,
    h4: (props) => <Anchor level={4} {...props} />,
    img: BlogImage as MDXComponents["img"],
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto rounded-xl border border-border bg-[rgba(255,255,255,0.02)]">
        <table className="w-full text-sm border-collapse">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-[rgba(255,255,255,0.05)] border-b border-border">{children}</thead>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70">{children}</th>
    ),
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-b border-border last:border-b-0">{children}</tr>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-muted-strong">{children}</td>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-accent pl-6 my-6 text-muted italic">
        {children}
      </blockquote>
    ),
    Note: ({ children, title }: { children: React.ReactNode; title?: string }) => (
      <Admonition type="note" title={title}>{children}</Admonition>
    ),
    Warning: ({ children, title }: { children: React.ReactNode; title?: string }) => (
      <Admonition type="warning" title={title}>{children}</Admonition>
    ),
    Tip: ({ children, title }: { children: React.ReactNode; title?: string }) => (
      <Admonition type="tip" title={title}>{children}</Admonition>
    ),
    Danger: ({ children, title }: { children: React.ReactNode; title?: string }) => (
      <Admonition type="danger" title={title}>{children}</Admonition>
    ),
    p: ({ children }) => (
      <p className="text-muted leading-relaxed mb-4">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-outside pl-6 mb-4 space-y-1 text-muted">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-outside pl-6 mb-4 space-y-1 text-muted">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    iframe: (props: React.IframeHTMLAttributes<HTMLIFrameElement>) => (
      <div className="my-8 p-4 aspect-video w-full max-w-2xl">
        <iframe
          src={props.src}
          title={props.title}
          allow={props.allow}
          loading={props.loading as "lazy" | "eager" | undefined}
          allowFullScreen
          className="w-full h-full rounded-lg border border-border"
        />
      </div>
    ),
    hr: () => <hr className="border-border my-8" />,
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-accent hover:text-accent-hover underline underline-offset-2 transition-colors"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
  };
}
