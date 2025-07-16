"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import Image from "next/image";

export default function CreateImage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // reader.onload is a callback that runs after readAsDataURL() completes its async file reading.
                setSelectedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
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
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ selectedImage, title, description });
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
                                className={`relative w-full h-96 lg:h-[600px] border-2 border-dashed rounded-2xl transition-colors cursor-pointer ${
                                    isDragging
                                        ? "border-primary bg-primary/10"
                                        : "border-border bg-muted/30 hover:bg-muted/50"
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
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
                                    </p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                                    className="hidden"
                                    onChange={handleFileInputChange}
                                />
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
                                Title
                            </label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="Add a title"
                                value={title}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => setTitle(e.target.value)}
                                className="w-full"
                            />
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
                                placeholder="Add a detailed description"
                                value={description}
                                onChange={(
                                    e: React.ChangeEvent<HTMLTextAreaElement>
                                ) => setDescription(e.target.value)}
                                className="w-full min-h-32 resize-none"
                            />
                        </div>
                        <div className="pt-6">
                            <Button
                                type="submit"
                                className={`w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow font-semibold`}
                                disabled={!selectedImage || !title.trim()}
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
