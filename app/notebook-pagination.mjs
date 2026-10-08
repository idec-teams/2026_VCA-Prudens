// Keep captions with their tables/photos and introductory lines with their content.
function weight(block) {
  if (block.type === 'table') return Math.min(24, block.rows.length * 1.25 + 2);
  if (block.type === 'gallery') return 10;
  if (block.type === 'image') return 8;
  return Math.max(1, Math.ceil((block.text?.length ?? 0) / 110));
}

export function notebookPages(sections) {
  const pages = [];
  sections.forEach((section, sectionIndex) => {
    let blocks = [], size = 0, part = 0;
    const flush = () => {
      if (!blocks.length) return;
      pages.push({ id: part ? `${section.id}-page-${part + 1}` : section.id, sectionIndex, part: part++, blocks });
      blocks = []; size = 0;
    };
    section.blocks.forEach((block, index) => {
      const previous = section.blocks[index - 1];
      const joinsPrevious = block.type === 'caption' && /^Figure/.test(block.text)
        || previous?.type === 'caption' && /^Table/.test(previous.text)
        || /:\s*$/.test(previous?.text ?? '');
      if (size + weight(block) > 26 && !joinsPrevious) flush();
      blocks.push(block); size += weight(block);
    });
    flush();
  });
  return pages;
}

export function notebookPageForHash(pages, hash) {
  let id;
  try { id = decodeURIComponent(hash.replace(/^#/, '')); } catch { return -1; }
  return pages.findIndex(page => page.id === id);
}
