
export const parseMarkdown = (text: string): string => {
    // Helper function to process inline markdown elements like bold, italic, and code.
    const inlineParse = (line: string): string => {
        return line
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Inline code
            .replace(/`([^`]+)`/g, '<code class="bg-slate-200 dark:bg-slate-700 rounded-md px-1.5 py-0.5 font-mono text-sm">$1</code>');
    };

    // Process block-level elements by splitting the text into blocks.
    // A block is separated by one or more empty lines.
    const blocks = text.split(/\n\s*\n/);

    const htmlBlocks = blocks.map(block => {
        const trimmedBlock = block.trim();
        if (!trimmedBlock) return '';

        // Code blocks (must be checked first as they can contain other markdown characters)
        if (trimmedBlock.startsWith('```') && trimmedBlock.endsWith('```')) {
            const lines = trimmedBlock.split('\n');
            const lang = lines[0].substring(3).trim();
            const code = lines.slice(1, -1).join('\n');
            // Basic HTML entity escaping
            const escapedCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return `<pre class="bg-slate-800 text-white p-4 rounded-md my-4 overflow-x-auto"><code class="language-${lang}">${escapedCode}</code></pre>`;
        }
        
        // Headings
        if (trimmedBlock.startsWith('# ')) return `<h1 class="text-3xl font-bold mb-4 mt-6">${inlineParse(trimmedBlock.substring(2))}</h1>`;
        if (trimmedBlock.startsWith('## ')) return `<h2 class="text-2xl font-bold mb-3 mt-6">${inlineParse(trimmedBlock.substring(3))}</h2>`;
        if (trimmedBlock.startsWith('### ')) return `<h3 class="text-xl font-semibold mb-2 mt-4">${inlineParse(trimmedBlock.substring(4))}</h3>`;
        
        // Unordered lists
        if (/^[-*] /.test(trimmedBlock)) {
            const items = trimmedBlock.split('\n').map(item => `<li>${inlineParse(item.replace(/^[-*] /, ''))}</li>`).join('');
            return `<ul class="list-disc pl-6 space-y-2 mb-4">${items}</ul>`;
        }
        
        // Ordered lists
        if (/^\d+\. /.test(trimmedBlock)) {
            const items = trimmedBlock.split('\n').map(item => `<li>${inlineParse(item.replace(/^\d+\. /, ''))}</li>`).join('');
            return `<ol class="list-decimal pl-6 space-y-2 mb-4">${items}</ol>`;
        }
        
        // Paragraphs (default case)
        // Convert single newlines inside a paragraph block to <br> for intended line breaks
        const paragraphContent = inlineParse(trimmedBlock).replace(/\n/g, '<br />');
        return `<p class="leading-relaxed mb-4">${paragraphContent}</p>`;
    });

    return htmlBlocks.join('');
};
