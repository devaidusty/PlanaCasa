import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-8 font-heading text-3xl font-bold" style={{ color: '#1B2A4A' }}>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-7 font-heading text-2xl font-semibold" style={{ color: '#1B2A4A' }}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-6 font-heading text-xl font-semibold" style={{ color: '#1B2A4A' }}>
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-2 mt-5 font-heading text-lg font-semibold" style={{ color: '#1B2A4A' }}>
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 list-disc space-y-1.5 pl-6 text-gray-700">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 list-decimal space-y-1.5 pl-6 text-gray-700">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium underline underline-offset-2"
      style={{ color: '#C9A84C' }}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote
      className="my-4 border-l-4 pl-4 italic text-gray-600"
      style={{ borderColor: '#C9A84C' }}
    >
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold" style={{ color: '#1B2A4A' }}>
      {children}
    </strong>
  ),
  code: ({ children }) => (
    <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800">
      {children}
    </code>
  ),
  hr: () => <hr className="my-8 border-gray-200" />,
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse overflow-hidden rounded-lg border border-gray-200 text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead style={{ backgroundColor: '#1B2A4A' }}>{children}</thead>
  ),
  th: ({ children }) => (
    <th className="border border-gray-200 px-4 py-2.5 text-left font-semibold text-white">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-200 px-4 py-2.5 text-gray-700">{children}</td>
  ),
  tr: ({ children }) => <tr className="even:bg-gray-50">{children}</tr>,
}

export default function GuideMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  )
}
