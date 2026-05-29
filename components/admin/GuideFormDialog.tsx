'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { GUIDE_CATEGORIES, GUIDE_CATEGORY_LABELS } from '@/lib/constants/guides'
import { generateSlug } from '@/lib/utils/generateSlug'
import type { Guide } from '@/types'

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  category: z.enum(GUIDE_CATEGORIES as [string, ...string[]]),
  read_time_minutes: z.number().min(1),
  cover_image: z.string().optional(),
  is_free: z.boolean(),
  tags: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

function toList(value: string | undefined): string[] {
  if (!value) return []
  return value
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

interface GuideFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  guide: Guide | null
}

export default function GuideFormDialog({
  open,
  onOpenChange,
  guide,
}: GuideFormDialogProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const isEdit = !!guide

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'foundation',
      read_time_minutes: 5,
      cover_image: '',
      is_free: true,
      tags: '',
    },
  })

  useEffect(() => {
    if (!open) return
    if (guide) {
      reset({
        title: guide.title,
        slug: guide.slug,
        excerpt: guide.excerpt ?? '',
        content: guide.content ?? '',
        category: guide.category,
        read_time_minutes: guide.read_time_minutes,
        cover_image: guide.cover_image ?? '',
        is_free: guide.is_free,
        tags: (guide.tags ?? []).join(', '),
      })
    } else {
      reset()
    }
  }, [open, guide, reset])

  const titleValue = watch('title')
  function autoSlug() {
    if (!isEdit && titleValue) setValue('slug', generateSlug(titleValue))
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    const payload = {
      ...values,
      tags: toList(values.tags),
      ...(isEdit ? { id: guide!.id } : {}),
    }
    try {
      const res = await fetch('/api/admin/guides', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Request failed')
      toast.success(isEdit ? 'Guide updated' : 'Guide created')
      onOpenChange(false)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Guide' : 'Add Guide'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the guide content below.'
              : 'Create a new DIY / construction guide.'}
          </DialogDescription>
        </DialogHeader>

        <form
          id="guide-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title')} onBlur={autoSlug} />
              {errors.title && (
                <p className="text-xs text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register('slug')} />
              {errors.slug && (
                <p className="text-xs text-destructive">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea id="excerpt" rows={2} {...register('excerpt')} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GUIDE_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {GUIDE_CATEGORY_LABELS[c]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="read_time_minutes">Read time (min)</Label>
              <Input
                id="read_time_minutes"
                type="number"
                {...register('read_time_minutes', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Free</Label>
              <Controller
                control={control}
                name="is_free"
                render={({ field }) => (
                  <div className="h-8 flex items-center">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cover_image">Cover image URL</Label>
            <Input id="cover_image" {...register('cover_image')} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" rows={10} {...register('content')} />
            <p className="text-xs text-text-light">
              Content supports Markdown including tables.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" {...register('tags')} />
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" form="guide-form" disabled={submitting}>
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create guide'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
