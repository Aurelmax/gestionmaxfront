'use client'

import { useParams } from 'next/navigation'
import { ArticleEditor } from '@/components/admin/ArticleEditor'

export default function EditerArticlePage() {
  const params = useParams()
  const articleId = params['id'] as string

  return <ArticleEditor mode="edit" articleId={articleId} />
}
