'use client';

import { EditorContent, EditorRoot, JSONContent } from 'novel';
import StarterKit from '@tiptap/starter-kit';

const extensions = [StarterKit];

export default function BlogPostReader({ content }: { content: JSONContent }) {
  return (
    <EditorRoot>
      <EditorContent
        initialContent={content}
        editable={false}
        extensions={extensions}
        className="novel-reader"
      />
    </EditorRoot>
  );
}
