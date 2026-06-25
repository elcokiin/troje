import type { Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

export const remarkPlugins = [remarkGfm]

export const mdComponents: Components = {
  p: ({ children, ...props }) => (
    <p className="text-sm leading-relaxed" {...props}>{children}</p>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className
    if (isInline) {
      return (
        <code className="bg-muted px-[0.3em] py-[0.15em] rounded text-sm font-mono text-foreground" {...props}>
          {children}
        </code>
      )
    }
    return (
      <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-sm leading-relaxed my-2">
        <code className={cn("font-mono", className)} {...props}>
          {children}
        </code>
      </pre>
    )
  },
  strong: ({ children, ...props }) => (
    <strong className="font-semibold" {...props}>{children}</strong>
  ),
  em: ({ children, ...props }) => <em className="italic" {...props}>{children}</em>,
  h1: ({ children, ...props }) => (
    <h1 className="text-xl font-bold mt-3 mb-1.5 leading-tight" {...props}>{children}</h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-lg font-bold mt-2.5 mb-1 leading-tight" {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-base font-semibold mt-2 mb-1 leading-tight" {...props}>{children}</h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="text-sm font-semibold mt-1.5 mb-0.5" {...props}>{children}</h4>
  ),
  h5: ({ children, ...props }) => (
    <h5 className="text-sm font-medium mt-1.5 mb-0.5" {...props}>{children}</h5>
  ),
  h6: ({ children, ...props }) => (
    <h6 className="text-sm font-medium mt-1.5 mb-0.5 text-muted-foreground" {...props}>{children}</h6>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc pl-5 text-sm space-y-0.5" {...props}>{children}</ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal pl-5 text-sm space-y-0.5" {...props}>{children}</ol>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-2 border-muted-foreground/30 pl-3 italic text-sm text-muted-foreground my-1.5" {...props}>{children}</blockquote>
  ),
  hr: () => <hr className="my-3 border-muted-foreground/20" />,
  a: ({ children, ...props }) => (
    <a className="text-primary underline underline-offset-2 hover:text-primary/80" {...props}>{children}</a>
  ),
  del: ({ children, ...props }) => (
    <del className="line-through text-muted-foreground" {...props}>{children}</del>
  ),
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-2">
      <table className="w-full text-sm border-collapse" {...props}>{children}</table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="border-b border-muted-foreground/20" {...props}>{children}</thead>
  ),
  tbody: ({ children, ...props }) => (
    <tbody {...props}>{children}</tbody>
  ),
  tr: ({ children, ...props }) => (
    <tr className="border-b border-muted-foreground/10" {...props}>{children}</tr>
  ),
  th: ({ children, ...props }) => (
    <th className="text-left py-1.5 px-2 font-semibold" {...props}>{children}</th>
  ),
  td: ({ children, ...props }) => (
    <td className="py-1.5 px-2" {...props}>{children}</td>
  ),
  input: ({ ...props }) => (
    <input className="mr-1.5" {...props} />
  ),
}
