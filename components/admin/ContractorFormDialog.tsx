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
import type { Contractor } from '@/types'

const schema = z.object({
  business_name: z.string().min(2, 'Business name is required'),
  owner_name: z.string().optional(),
  description: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  region: z.string().optional(),
  coverage_areas: z.string().optional(),
  specializations: z.string().optional(),
  years_experience: z.number().min(0),
  license_number: z.string().optional(),
  pcab_accredited: z.boolean(),
  prc_licensed: z.boolean(),
  portfolio_images: z.string().optional(),
  contact_phone: z.string().optional(),
  contact_email: z.string().optional(),
  contact_messenger: z.string().optional(),
  facebook_page: z.string().optional(),
  price_range_min: z.number().min(0),
  price_range_max: z.number().min(0),
  is_verified: z.boolean(),
  is_featured: z.boolean(),
  listing_tier: z.enum(['free', 'verified', 'featured']),
})

type FormValues = z.infer<typeof schema>

function toList(value: string | undefined): string[] {
  if (!value) return []
  return value
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

interface ContractorFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contractor: Contractor | null
}

export default function ContractorFormDialog({
  open,
  onOpenChange,
  contractor,
}: ContractorFormDialogProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const isEdit = !!contractor

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      business_name: '',
      owner_name: '',
      description: '',
      city: '',
      province: '',
      region: '',
      coverage_areas: '',
      specializations: '',
      years_experience: 0,
      license_number: '',
      pcab_accredited: false,
      prc_licensed: false,
      portfolio_images: '',
      contact_phone: '',
      contact_email: '',
      contact_messenger: '',
      facebook_page: '',
      price_range_min: 0,
      price_range_max: 0,
      is_verified: false,
      is_featured: false,
      listing_tier: 'free',
    },
  })

  useEffect(() => {
    if (!open) return
    if (contractor) {
      reset({
        business_name: contractor.business_name,
        owner_name: contractor.owner_name ?? '',
        description: contractor.description ?? '',
        city: contractor.city ?? '',
        province: contractor.province ?? '',
        region: contractor.region ?? '',
        coverage_areas: (contractor.coverage_areas ?? []).join(', '),
        specializations: (contractor.specializations ?? []).join(', '),
        years_experience: contractor.years_experience,
        license_number: contractor.license_number ?? '',
        pcab_accredited: contractor.pcab_accredited,
        prc_licensed: contractor.prc_licensed,
        portfolio_images: (contractor.portfolio_images ?? []).join('\n'),
        contact_phone: contractor.contact_phone ?? '',
        contact_email: contractor.contact_email ?? '',
        contact_messenger: contractor.contact_messenger ?? '',
        facebook_page: contractor.facebook_page ?? '',
        price_range_min: contractor.price_range_min,
        price_range_max: contractor.price_range_max,
        is_verified: contractor.is_verified,
        is_featured: contractor.is_featured,
        listing_tier: contractor.listing_tier,
      })
    } else {
      reset()
    }
  }, [open, contractor, reset])

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    const payload = {
      ...values,
      coverage_areas: toList(values.coverage_areas),
      specializations: toList(values.specializations),
      portfolio_images: toList(values.portfolio_images),
      ...(isEdit ? { id: contractor!.id } : {}),
    }
    try {
      const res = await fetch('/api/admin/contractors', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Request failed')
      toast.success(isEdit ? 'Contractor updated' : 'Contractor created')
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
          <DialogTitle>
            {isEdit ? 'Edit Contractor' : 'Add Contractor'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the contractor profile below.'
              : 'Add a new contractor to the marketplace.'}
          </DialogDescription>
        </DialogHeader>

        <form
          id="contractor-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="business_name">Business name</Label>
              <Input id="business_name" {...register('business_name')} />
              {errors.business_name && (
                <p className="text-xs text-destructive">
                  {errors.business_name.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="owner_name">Owner name</Label>
              <Input id="owner_name" {...register('owner_name')} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...register('description')} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register('city')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="province">Province</Label>
              <Input id="province" {...register('province')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="region">Region</Label>
              <Input id="region" {...register('region')} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="coverage_areas">Coverage areas (comma-separated)</Label>
            <Input id="coverage_areas" {...register('coverage_areas')} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="specializations">
              Specializations (comma-separated)
            </Label>
            <Input id="specializations" {...register('specializations')} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="years_experience">Years experience</Label>
              <Input
                id="years_experience"
                type="number"
                {...register('years_experience', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="license_number">License number</Label>
              <Input id="license_number" {...register('license_number')} />
            </div>
            <div className="space-y-1.5">
              <Label>Listing tier</Label>
              <Controller
                control={control}
                name="listing_tier"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="portfolio_images">
              Portfolio images (one URL per line)
            </Label>
            <Textarea
              id="portfolio_images"
              rows={2}
              {...register('portfolio_images')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="contact_phone">Contact phone</Label>
              <Input id="contact_phone" {...register('contact_phone')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact_email">Contact email</Label>
              <Input id="contact_email" {...register('contact_email')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact_messenger">Messenger</Label>
              <Input id="contact_messenger" {...register('contact_messenger')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="facebook_page">Facebook page</Label>
              <Input id="facebook_page" {...register('facebook_page')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="price_range_min">Price range min (₱)</Label>
              <Input
                id="price_range_min"
                type="number"
                {...register('price_range_min', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="price_range_max">Price range max (₱)</Label>
              <Input
                id="price_range_max"
                type="number"
                {...register('price_range_max', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <Controller
              control={control}
              name="pcab_accredited"
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                  PCAB accredited
                </label>
              )}
            />
            <Controller
              control={control}
              name="prc_licensed"
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                  PRC licensed
                </label>
              )}
            />
            <Controller
              control={control}
              name="is_verified"
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                  Verified
                </label>
              )}
            />
            <Controller
              control={control}
              name="is_featured"
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                  Featured
                </label>
              )}
            />
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
          <Button type="submit" form="contractor-form" disabled={submitting}>
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
