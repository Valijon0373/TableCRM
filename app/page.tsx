import { ProductForm } from "@/components/product-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
        <div className="mb-4 sm:mb-6 md:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
            TableCRM
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Создание карточки товара
          </p>
        </div>
        <ProductForm />
      </div>
    </div>
  );
}
