'use client'
import { useParams } from 'next/navigation'
import AdminPostEditor from '../../PostEditor'
export default function EditPostPage() {
  const params = useParams<{ id: string }>()
  return <AdminPostEditor editId={params.id} />
}
