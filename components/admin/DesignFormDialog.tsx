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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DESIGN_STYLES, DESIGN_STYLE_LABELS } from '@/lib/constants/designStyles'
import { generateSlug } from '@/lib/utils/generateSlug'
import type { Design } from '@/types'

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  style: z.enum(DESIGN_STYLES as [string, ...string[]]),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  floor_area_sqm: z.number().min(0),
  lot_area_sqm: z.number().min(0),
  estimated_build_cost_min: z.number().min(0),
  estimated_build_cost_max: z.number().min(0),
  plan_price: z.number().min(0),
  floors: z.number().min(1),
  garage: z.boolean(),
  featured: z.boolean(),
  climate_notes: z.string().optional(),
  preview_images: z.string().optional(),
  floor_plan_images: z.string().optional(),
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

interface DesignFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  design: Design | null
}

export default function DesignFormDialog({
  open,
  onOpenChange,
  design,
}: DesignFormDialogProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [createDefaultPackages, setCreateDefaultPackages] = useState(true)
  const isEdit = !!design

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
      description: '',
      style: 'modern_filipino',
      bedrooms: 3,
      bathrooms: 2,
      floor_area_sqm: 100,
      lot_area_sqm: 150,
      estimated_build_cost_min: 1000000,
      estimated_build_cost_max: 2000000,
      plan_price: 1999,
      floors: 1,
      garage: false,
      featured: false,
      climate_notes: '',
      preview_images: '',
      floor_plan_images: '',
      tags: '',
    },
  })

  useEffect(() => {
    if (!open) return
    if (design) {
      reset({
        title: design.title,
        slug: design.slug,
        description: design.description ?? '',
        style: design.style,
        bedrooms: design.bedrooms,
        bathrooms: design.bathrooms,
        floor_area_sqm: design.floor_area_sqm,
        lot_area_sqm: design.lot_area_sqm,
        estimated_build_cost_min: design.estimated_build_cost_min,
        estimated_build_cost_max: design.estimated_build_cost_max,
        plan_price: design.plan_price,
        floors: design.floors,
        garage: design.garage,
        featured: design.featured,
        climate_notes: design.climate_notes ?? '',
        preview_images: (design.preview_images ?? []).join('\n'),
        floor_plan_images: (design.floor_plan_images ?? []).join('\n'),
        tags: (design.tags ?? []).join(', '),
      })
    } else {
      reset()
      setCreateDefaultPackages(true)
    }
  }, [open, design, reset])

  const titleValue = watch('title')
  function autoSlug() {
    if (!isEdit && titleValue) setValue('slug', generateSlug(titleValue))
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    const payload = {
      ...values,
      preview_images: toList(values.preview_images),
      floor_plan_images: toList(values.floor_plan_images),
      tags: toList(values.tags),
      ...(isEdit
        ? { id: design!.id }
        : { createDefaultPackages }),
    }

    try {
      const res = await fetch('/api/admin/designs', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Request failed')
      toast.success(isEdit ? 'Design updated' : 'Design created')
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
          <DialogTitle>{isEdit ? 'Edit Design' : 'Add New Design'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the design details below.'
              : 'Fill in the details to create a new house plan listing.'}
          </DialogDescription>
        </DialogHeader>

        <form
          id="design-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title')} onBlur={autoSlug} />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
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
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...register('description')} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Style</Label>
              <Controller
                control={control}
                name="style"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DESIGN_STYLES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {DESIGN_STYLE_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                {...register('bedrooms', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                {...register('bathrooms', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="floor_area_sqm">Floor area (sqm)</Label>
              <Input
                id="floor_area_sqm"
                type="number"
                {...register('floor_area_sqm', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lot_area_sqm">Lot area (sqm)</Label>
              <Input
                id="lot_area_sqm"
                type="number"
                {...register('lot_area_sqm', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="floors">Floors</Label>
              <Input
                id="floors"
                type="number"
                {...register('floors', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="estimated_build_cost_min">Build cost min (₱)</Label>
              <Input
                id="estimated_build_cost_min"
                type="number"
                {...register('estimated_build_cost_min', {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="estimated_build_cost_max">Build cost max (₱)</Label>
              <Input
                id="estimated_build_cost_max"
                type="number"
                {...register('estimated_build_cost_max', {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="plan_price">Plan price (₱)</Label>
              <Input
                id="plan_price"
                type="number"
                {...register('plan_price', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <Controller
              control={control}
              name="garage"
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  Garage
                </label>
              )}
            />
            <Controller
              control={control}
              name="featured"
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  Featured
                </label>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="climate_notes">Climate notes</Label>
            <Textarea id="climate_notes" rows={2} {...register('climate_notes')} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="preview_images">
              Preview images (one URL per line or comma-separated)
            </Label>
            <Textarea
              id="preview_images"
              rows={2}
              {...register('preview_images')}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="floor_plan_images">
              Floor plan images (one URL per line or comma-separated)
            </Label>
            <Textarea
              id="floor_plan_images"
              rows={2}
              {...register('floor_plan_images')}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" {...register('tags')} />
          </div>

          {!isEdit && (
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={createDefaultPackages}
                onCheckedChange={(c) => setCreateDefaultPackages(!!c)}
              />
              Create default packages (Basic / Standard / Premium)
            </label>
          )}
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
          <Button type="submit" form="design-form" disabled={submitting}>
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create design'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
