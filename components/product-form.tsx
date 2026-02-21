"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

const productFormSchema = z.object({
  name: z.string().min(2, {
    message: "Название товара должно содержать минимум 2 символа.",
  }),
  description: z.string().optional(),
  sku: z.string().optional(),
  price: z.string().optional(),
  unit: z.string().optional(),
  category: z.string().optional(),
  barcode: z.string().optional(),
  weight: z.string().optional(),
  volume: z.string().optional(),
  tax_rate: z.string().optional(),
  in_stock: z.string().optional(),
  min_stock: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

export function ProductForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      price: "",
      unit: "",
      category: "",
      barcode: "",
      weight: "",
      volume: "",
      tax_rate: "",
      in_stock: "",
      min_stock: "",
    },
  })

  async function onSubmit(data: ProductFormValues) {
    setIsSubmitting(true)
    try {
      // Преобразуем данные в формат для API
      const payload = {
        name: data.name,
        description: data.description || "",
        sku: data.sku || "",
        price: data.price ? parseFloat(data.price) : null,
        unit: data.unit || "",
        category: data.category || "",
        barcode: data.barcode || "",
        weight: data.weight ? parseFloat(data.weight) : null,
        volume: data.volume ? parseFloat(data.volume) : null,
        tax_rate: data.tax_rate ? parseFloat(data.tax_rate) : null,
        in_stock: data.in_stock ? parseFloat(data.in_stock) : null,
        min_stock: data.min_stock ? parseFloat(data.min_stock) : null,
      }

      // Получаем токен из URL или используем дефолтный
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get("token") || "af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77"
      
      const response = await fetch("/api/create-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          token,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Ошибка при создании товара")
      }

      const result = await response.json()

      toast({
        title: "Успешно!",
        description: "Карточка товара успешно создана.",
      })

      // Очищаем форму после успешной отправки
      form.reset()
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось создать карточку товара",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Создание карточки товара</CardTitle>
        <CardDescription>
          Заполните форму для создания новой карточки товара в системе tablecrm.com
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название товара *</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите название товара" {...field} />
                    </FormControl>
                    <FormDescription>
                      Обязательное поле. Минимум 2 символа.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Артикул (SKU)</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите артикул" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цена</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Единица измерения</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите единицу измерения" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="шт">Штука (шт)</SelectItem>
                        <SelectItem value="кг">Килограмм (кг)</SelectItem>
                        <SelectItem value="г">Грамм (г)</SelectItem>
                        <SelectItem value="л">Литр (л)</SelectItem>
                        <SelectItem value="мл">Миллилитр (мл)</SelectItem>
                        <SelectItem value="м">Метр (м)</SelectItem>
                        <SelectItem value="см">Сантиметр (см)</SelectItem>
                        <SelectItem value="м²">Квадратный метр (м²)</SelectItem>
                        <SelectItem value="м³">Кубический метр (м³)</SelectItem>
                        <SelectItem value="упак">Упаковка (упак)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Категория</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите категорию" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Штрих-код</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите штрих-код" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Вес (кг)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="volume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Объем (л)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tax_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Налоговая ставка (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="in_stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Количество на складе</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="min_stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Минимальный остаток</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Введите описание товара"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting}
              >
                Очистить
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Создание..." : "Создать карточку товара"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

