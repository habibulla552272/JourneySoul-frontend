'use client'
import { blogUpdate, SingleBlog } from '@/lib/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { BlogData } from '@/types/blog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Image from 'next/image'
import { Label } from '@/components/ui/label'

// ✅ Validation Schema (same as reference)
const formSchema = z.object({
    image: z.string().min(1, "Image is required"),
    category: z.string().min(3, "Category must be at least 3 characters"),
    title: z.string().min(5, "Title must be at least 5 characters"),
    content: z.string().min(10, "Description must be at least 10 characters"),
    status: z.enum(['published', 'draft']),
})

type FormValues = z.infer<typeof formSchema>

interface UpdateBlogModalProps {
    id: string | null
    isOpen: boolean
    onClose: () => void
}

const UpdateBlogModal = ({ id, isOpen, onClose }: UpdateBlogModalProps) => {
    const queryClient = useQueryClient()
    const [preview, setPreview] = React.useState<string>("")

    // Initialize form with react-hook-form
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            image: "",
            category: "",
            title: "",
            content: "",
            status: "published",
        }
    })

    // Fetch single blog data
 
    const { data, isLoading, error } = useQuery({
        queryKey: ['singleBlog'],
        queryFn: async () => {
            if (!id) {
                // Return empty object instead of null/undefined when no id
                return {
                    image: "",
                    category: "",
                    title: "",
                    content: "",
                    status: "published" as const,
                }
            }
            return SingleBlog(id)
        },
        enabled: !!id && isOpen,
    })

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: (updatedData: FormValues) => {
            if (!id) throw new Error('No blog ID provided')
            return blogUpdate(id, updatedData as BlogData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
            queryClient.invalidateQueries({ queryKey: ['singleBlog', id] })
            queryClient.invalidateQueries({ queryKey: ['allBlogs'] })
            onClose()
            form.reset()
            setPreview("")
        },
        onError: (error) => {
            console.error('Failed to update blog:', error)
            alert('Failed to update blog. Please try again.')
        }
    })

    // Handle image upload (same as reference)
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const data = new FormData()
        data.append("file", file)
        data.append("upload_preset", "First_Time_using")

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_URL}`, {
                method: "POST",
                body: data,
            })

            const uploadedImageURL = await res.json()
            const secureUrl =
                uploadedImageURL.secure_url ||
                uploadedImageURL.url.replace(/^http:\/\//, "https://")

            setPreview(secureUrl)
            form.setValue("image", secureUrl)
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Failed to upload image. Please try again.')
        }
    }

    // Reset form when data loads or modal opens/closes
    React.useEffect(() => {
        if (data && isOpen) {
            const formData = {
                image: data.image || "",
                category: data.category || "",
                title: data.title || "",
                content: data.content || "",
                status: data.status || "published",
            }

            form.reset(formData)
            setPreview(data.image || "")
        }
    }, [data, isOpen, form])

    const handleClose = () => {
        form.reset()
        setPreview("")
        onClose()
    }

    const onSubmit = async (values: FormValues) => {
        if (id) {
            try {
                await updateMutation.mutateAsync(values)
            } catch (error) {
                // Error handling is done in mutation
            }
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Blog Post</DialogTitle>
                    <DialogDescription>
                        Update your blog post information. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <p>Loading blog data...</p>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            {/* Image Upload (same as reference) */}
                            <div className="flex flex-col space-y-2">
                                <Label className="font-medium text-gray-700 dark:text-gray-300">
                                    Blog Image
                                </Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={updateMutation.isPending}
                                />
                                {preview && (
                                    <div className="mt-3">
                                        <Image
                                            width={400}
                                            height={200}
                                            src={preview}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg border"
                                        />
                                    </div>
                                )}
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input type="hidden" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {form.formState.errors.image && (
                                    <p className="text-red-500 text-sm">{form.formState.errors.image.message}</p>
                                )}
                            </div>

                            {/* Category (same as reference but with shadcn form) */}
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={updateMutation.isPending}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="adventure">Adventure</SelectItem>
                                                <SelectItem value="travel">Travel</SelectItem>
                                                <SelectItem value="fashion">Fashion</SelectItem>
                                                <SelectItem value="technology">Technology</SelectItem>
                                                <SelectItem value="branding">Branding</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Title */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your blog title"
                                                {...field}
                                                disabled={updateMutation.isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Content/Description (same as reference) */}
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Write your blog content here..."
                                                className="min-h-[120px]"
                                                {...field}
                                                disabled={updateMutation.isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Status */}
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={updateMutation.isPending}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="published">Published</SelectItem>
                                                <SelectItem value="draft">Draft</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-neutral-800">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    disabled={updateMutation.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-5"
                                >
                                    {updateMutation.isPending ? (
                                        <>
                                            <span className="animate-spin mr-2">⟳</span>
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Blog'
                                    )}
                                </Button>
                            </div>

                            {updateMutation.isError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-red-800 text-sm">
                                        Failed to update blog. Please try again.
                                    </p>
                                </div>
                            )}
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default UpdateBlogModal