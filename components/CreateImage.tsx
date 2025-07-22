"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateImage() {
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [errors, setErrors] = useState({
        title: "",
        description: "",
        image: "",
        submit: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateTitle = (value: string) => {
        if (!value.trim()) {
            return "Title is required";
        }
        if (value.trim().length < 3) {
            return "Title must be at least 3 characters";
        }
        if (value.trim().length > 100) {
            return "Title must be under 100 characters";
        }
        return "";
    };
    const validateDescription = (value: string) => {
        if (value.length > 300) {
            return "Description must be under 300 characters";
        }
        return "";
    };
    const validateImageFile = (file: File) => {
        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/webp",
            "image/gif",
        ];
        const maxSizeInMB = 10;
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            return "Invalid image format. Only PNG, JPG, JPEG, WEBP, and GIF are allowed.";
        }

        if (file.size > maxSizeInBytes) {
            return `Image too large. Maximum size is ${maxSizeInMB}MB.`;
        }

        return "";
    };

    const handleFileSelect = (file: File) => {
        const imageError = validateImageFile(file);
        if (imageError) {
            setErrors((prev) => ({ ...prev, image: imageError }));
            return;
        }
        setErrors((prev) => ({ ...prev, image: "" }));

        const reader = new FileReader();
        reader.onload = (e) => {
            setSelectedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTitle(value);

        const error = validateTitle(value);
        setErrors((prev) => ({ ...prev, title: error }));
    };
    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const value = e.target.value;
        setDescription(value);

        const error = validateDescription(value);
        setErrors((prev) => ({ ...prev, description: error }));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setErrors((prev) => ({ ...prev, image: "" }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const titleError = validateTitle(title);
        const descriptionError = validateDescription(description);
        const imageError = !selectedImage ? "Please select an image" : "";
        setErrors({
            title: titleError,
            description: descriptionError,
            image: imageError,
            submit: "",
        });
        if (titleError || descriptionError || imageError) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/images", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim() || undefined,
                    imageBase64: selectedImage,
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                if (data.error) {
                    setErrors((prev) => ({
                        ...prev,
                        submit: data.error || "Failed to create image",
                    }));
                    return;
                }
                setErrors((prev) => ({
                    ...prev,
                    submit: "An unexpected error occurred. Please try again.",
                }));
                return;
            }

            // show success toast and redirect to the created image
            toast.success("Image uploaded successfully!");
            router.push(`/image/${data.image.id}`);
        } catch (error) {
            console.error("Error creating image:", error);
            toast.error("Failed to create image. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">
                Create Image
            </h1>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col lg:flex-row gap-8"
            >
                {/* left column - image upload */}
                <div className="lg:w-1/2">
                    <div className="sticky top-20">
                        {!selectedImage ? (
                            <div
                                className={`relative w-full h-96 lg:h-[600px] border-2 border-dashed rounded-2xl transition-colors ${
                                    isSubmitting
                                        ? "cursor-not-allowed opacity-50 border-border bg-muted/20"
                                        : isDragging
                                        ? "border-primary bg-primary/10 cursor-pointer"
                                        : "border-border bg-muted/30 hover:bg-muted/50 cursor-pointer"
                                }`}
                                onDragOver={
                                    isSubmitting ? undefined : handleDragOver
                                }
                                onDragLeave={
                                    isSubmitting ? undefined : handleDragLeave
                                }
                                onDrop={isSubmitting ? undefined : handleDrop}
                                onClick={
                                    isSubmitting
                                        ? undefined
                                        : () => fileInputRef.current?.click()
                                }
                            >
                                <div className="flex flex-col items-center justify-center h-full p-8">
                                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                        <Upload className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        Choose a file or drag and drop it here
                                    </h3>
                                    <p className="text-sm text-muted-foreground text-center mb-6">
                                        Supported formats: PNG, JPG, JPEG, WEBP,
                                        GIF
                                        <br />
                                        Maximum size: 10MB
                                    </p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                                    className="hidden"
                                    onChange={handleFileInputChange}
                                    disabled={isSubmitting}
                                />
                                {errors.image && (
                                    <div className="absolute bottom-4 left-4 right-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.image}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="relative w-full">
                                <div className="relative rounded-2xl overflow-hidden bg-muted">
                                    <Image
                                        src={selectedImage}
                                        alt="Selected image"
                                        width={600}
                                        height={800}
                                        className="w-full h-auto object-cover"
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="icon"
                                        className="absolute top-4 right-4 rounded-full"
                                        onClick={removeImage}
                                        disabled={isSubmitting}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* right column - form */}
                <div className="lg:w-1/2">
                    <div className="space-y-6">
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                Title *
                            </label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="Add a title (3-100 characters)"
                                value={title}
                                onChange={handleTitleChange}
                                disabled={isSubmitting}
                                className={`w-full ${
                                    errors.title
                                        ? "border-red-500 focus:border-red-500"
                                        : ""
                                }`}
                            />
                            {errors.title && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.title}
                                </p>
                            )}
                            {!errors.title && title && (
                                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                    ✓ Valid title length
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                Description
                            </label>
                            <Textarea
                                id="description"
                                placeholder="Add a detailed description (optional, max 300 characters)"
                                value={description}
                                onChange={handleDescriptionChange}
                                disabled={isSubmitting}
                                className={`w-full min-h-32 resize-none ${
                                    errors.description
                                        ? "border-red-500 focus:border-red-500"
                                        : ""
                                }`}
                            />
                            <div className="flex justify-between items-center mt-1">
                                <div>
                                    {errors.description && (
                                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                                <p
                                    className={`text-sm ${
                                        description.length > 300
                                            ? "text-red-600 dark:text-red-400"
                                            : "text-muted-foreground"
                                    }`}
                                >
                                    {description.length}/300
                                </p>
                            </div>
                        </div>
                        <div className="pt-6">
                            {errors.submit && (
                                <div className="mb-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.submit}
                                    </p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow font-semibold cursor-pointer"
                                disabled={
                                    !selectedImage ||
                                    !title.trim() ||
                                    errors.title !== "" ||
                                    errors.description !== "" ||
                                    errors.image !== "" ||
                                    isSubmitting
                                }
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create"
                                )}
                            </Button>
                            {(!selectedImage || !title.trim()) && (
                                <p className="text-sm text-muted-foreground mt-2 text-center">
                                    Please select an image and add a title to
                                    continue
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
