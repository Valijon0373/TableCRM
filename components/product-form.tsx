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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Sparkles, Wand2, FileText, MapPin, Search, Loader2 } from "lucide-react"

const productFormSchema = z.object({
  name: z.string().min(2, {
    message: "Название товара должно содержать минимум 2 символа.",
  }),
  type: z.string().optional(),
  description_short: z.string().optional(),
  description_long: z.string().optional(),
  code: z.string().optional(),
  unit: z.string().optional(),
  category: z.string().optional(),
  cashback_type: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(), // храним как строку, преобразуем в массив
  global_category_id: z.string().optional(),
  marketplace_price: z.string().optional(),
  chatting_percent: z.string().optional(),
  address: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

export function ProductForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingFields, setIsGeneratingFields] = useState(false)
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false)
  const [isFormattingText, setIsFormattingText] = useState(false)
  const [isSuggestingCategory, setIsSuggestingCategory] = useState(false)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      type: "product" as string,
      description_short: "",
      description_long: "",
      code: "",
      unit: "",
      category: "",
      cashback_type: "lcard_cashback",
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
      global_category_id: "",
      marketplace_price: "",
      chatting_percent: "",
      address: "",
      latitude: "",
      longitude: "",
    },
  })

  // AI: Генерация всех полей из названия
  async function handleGenerateFromName() {
    const name = form.getValues("name")
    if (!name || name.length < 2) {
      toast({
        title: "Ошибка",
        description: "Сначала введите название товара",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingFields(true)
    try {
      const response = await fetch("/api/ai/generate-fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) throw new Error("Ошибка генерации")

      const data = await response.json()
      
      form.setValue("description_short", data.description_short || "")
      form.setValue("description_long", data.description_long || "")
      form.setValue("code", data.code || "")
      form.setValue("unit", data.unit?.toString() || "")
      form.setValue("category", data.category?.toString() || "")
      form.setValue("global_category_id", data.global_category_id?.toString() || "")
      form.setValue("marketplace_price", data.marketplace_price?.toString() || "")

      toast({
        title: "Успешно!",
        description: "Поля автоматически заполнены на основе названия товара",
      })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сгенерировать поля",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingFields(false)
    }
  }

  // AI: Генерация SEO параметров
  async function handleGenerateSEO() {
    const name = form.getValues("name")
    const description = form.getValues("description_long") || form.getValues("description_short")
    
    if (!name || name.length < 2) {
      toast({
        title: "Ошибка",
        description: "Сначала введите название товара",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingSEO(true)
    try {
      const response = await fetch("/api/ai/generate-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      })

      if (!response.ok) throw new Error("Ошибка генерации SEO")

      const data = await response.json()
      
      form.setValue("seo_title", data.seo_title || "")
      form.setValue("seo_description", data.seo_description || "")
      form.setValue("seo_keywords", Array.isArray(data.seo_keywords) 
        ? data.seo_keywords.join(", ") 
        : data.seo_keywords || "")

      toast({
        title: "Успешно!",
        description: "SEO параметры автоматически сгенерированы",
      })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сгенерировать SEO параметры",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingSEO(false)
    }
  }

  // AI: Форматирование текста
  async function handleFormatText(field: "description_short" | "description_long") {
    const text = form.getValues(field)
    if (!text || text.length < 2) {
      toast({
        title: "Ошибка",
        description: "Сначала введите текст для форматирования",
        variant: "destructive",
      })
      return
    }

    setIsFormattingText(true)
    try {
      const response = await fetch("/api/ai/format-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) throw new Error("Ошибка форматирования")

      const data = await response.json()
      form.setValue(field, data.formatted_text || text)

      toast({
        title: "Успешно!",
        description: "Текст отформатирован для удобного чтения",
      })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отформатировать текст",
        variant: "destructive",
      })
    } finally {
      setIsFormattingText(false)
    }
  }

  // AI: Автоматическое определение категории
  async function handleSuggestCategory() {
    const name = form.getValues("name")
    if (!name || name.length < 2) {
      toast({
        title: "Ошибка",
        description: "Сначала введите название товара",
        variant: "destructive",
      })
      return
    }

    setIsSuggestingCategory(true)
    try {
      const response = await fetch("/api/ai/suggest-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) throw new Error("Ошибка определения категории")

      const data = await response.json()
      
      form.setValue("category", data.category?.toString() || "")
      form.setValue("global_category_id", data.global_category_id?.toString() || "")

      toast({
        title: "Успешно!",
        description: `Категория определена: ${data.category_name || "Неизвестно"}`,
      })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось определить категорию",
        variant: "destructive",
      })
    } finally {
      setIsSuggestingCategory(false)
    }
  }

  async function onSubmit(data: ProductFormValues) {
    setIsSubmitting(true)
    try {
      // Преобразуем seo_keywords из строки в массив
      const seoKeywords = data.seo_keywords
        ? data.seo_keywords.split(",").map(k => k.trim()).filter(k => k.length > 0)
        : []

      const payload = {
        name: data.name,
        type: (data.type || "product") as string,
        description_short: data.description_short || "",
        description_long: data.description_long || "",
        code: data.code || "",
        unit: data.unit || "116",
        category: data.category || "2477",
        cashback_type: data.cashback_type || "lcard_cashback",
        seo_title: data.seo_title || "",
        seo_description: data.seo_description || "",
        seo_keywords: seoKeywords,
        global_category_id: data.global_category_id || "127",
        marketplace_price: data.marketplace_price ? parseFloat(data.marketplace_price) : 0,
        chatting_percent: data.chatting_percent ? parseFloat(data.chatting_percent) : 0,
        address: data.address || "",
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
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
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl">Создание карточки товара</CardTitle>
            <CardDescription className="mt-2">
              Заполните форму для создания новой карточки товара в системе tablecrm.com
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm">
            <Sparkles className="w-3 h-3 mr-1" />
            AI помощник
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Основное</TabsTrigger>
                <TabsTrigger value="description">Описание</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="location">Местоположение</TabsTrigger>
              </TabsList>

              {/* Вкладка: Основное */}
              <TabsContent value="basic" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="flex items-center gap-2">
                          Название товара *
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleGenerateFromName}
                            disabled={isGeneratingFields || !field.value || field.value.length < 2}
                            className="h-6 px-2 text-xs"
                          >
                            {isGeneratingFields ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Wand2 className="w-3 h-3" />
                            )}
                            Заполнить все поля
                          </Button>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Введите название товара" {...field} />
                        </FormControl>
                        <FormDescription>
                          Обязательное поле. Минимум 2 символа. Нажмите кнопку для автоматического заполнения всех полей.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Код товара (Артикул)</FormLabel>
                        <FormControl>
                          <Input placeholder="Автоматически сгенерируется" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тип товара</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите тип" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="product">Товар</SelectItem>
                            <SelectItem value="service">Услуга</SelectItem>
                          </SelectContent>
                        </Select>
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
                              <SelectValue placeholder="Выберите единицу" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="116">Штука (шт)</SelectItem>
                            <SelectItem value="117">Килограмм (кг)</SelectItem>
                            <SelectItem value="118">Грамм (г)</SelectItem>
                            <SelectItem value="119">Литр (л)</SelectItem>
                            <SelectItem value="120">Миллилитр (мл)</SelectItem>
                            <SelectItem value="121">Метр (м)</SelectItem>
                            <SelectItem value="122">Сантиметр (см)</SelectItem>
                            <SelectItem value="123">Квадратный метр (м²)</SelectItem>
                            <SelectItem value="124">Кубический метр (м³)</SelectItem>
                            <SelectItem value="125">Упаковка (упак)</SelectItem>
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
                        <FormLabel className="flex items-center gap-2">
                          Категория
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleSuggestCategory}
                            disabled={isSuggestingCategory || !form.getValues("name") || form.getValues("name")!.length < 2}
                            className="h-6 px-2 text-xs"
                          >
                            {isSuggestingCategory ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Search className="w-3 h-3" />
                            )}
                            Найти
                          </Button>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="ID категории" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="global_category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Глобальная категория ID</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="127" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="marketplace_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Цена на маркетплейсе</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="chatting_percent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Процент чата (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cashback_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тип кешбэка</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите тип" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="lcard_cashback">LCard Cashback</SelectItem>
                            <SelectItem value="none">Нет</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Вкладка: Описание */}
              <TabsContent value="description" className="space-y-6 mt-6">
                <FormField
                  control={form.control}
                  name="description_short"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Краткое описание
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFormatText("description_short")}
                          disabled={isFormattingText || !field.value || field.value.length < 2}
                          className="h-6 px-2 text-xs ml-auto"
                        >
                          {isFormattingText ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Wand2 className="w-3 h-3" />
                          )}
                          Форматировать
                        </Button>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Введите краткое описание товара"
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Краткое описание товара для карточек и списков
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description_long"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Полное описание
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFormatText("description_long")}
                          disabled={isFormattingText || !field.value || field.value.length < 2}
                          className="h-6 px-2 text-xs ml-auto"
                        >
                          {isFormattingText ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Wand2 className="w-3 h-3" />
                          )}
                          Форматировать
                        </Button>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Введите полное описание товара"
                          className="resize-none"
                          rows={8}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Подробное описание товара с характеристиками и преимуществами
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Вкладка: SEO */}
              <TabsContent value="seo" className="space-y-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">SEO параметры</h3>
                    <p className="text-sm text-muted-foreground">
                      Настройте SEO параметры для лучшей индексации в поисковых системах
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateSEO}
                    disabled={isGeneratingSEO || !form.getValues("name") || form.getValues("name")!.length < 2}
                  >
                    {isGeneratingSEO ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Генерация...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Сгенерировать SEO
                      </>
                    )}
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="seo_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO заголовок</FormLabel>
                      <FormControl>
                        <Input placeholder="SEO название товара" {...field} />
                      </FormControl>
                      <FormDescription>
                        Заголовок для поисковых систем (рекомендуется 50-60 символов)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seo_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO описание</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="SEO описание товара"
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Описание для поисковых систем (рекомендуется 150-160 символов)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seo_keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO ключевые слова</FormLabel>
                      <FormControl>
                        <Input placeholder="ключевое слово 1, ключевое слово 2, ..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Введите ключевые слова через запятую
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Вкладка: Местоположение */}
              <TabsContent value="location" className="space-y-6 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5" />
                  <div>
                    <h3 className="text-lg font-semibold">Местоположение</h3>
                    <p className="text-sm text-muted-foreground">
                      Укажите адрес и координаты для товара
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Адрес</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="улица Зайцева 8, Ново-Татарская слобода, Казань, TT, Россия, 420108"
                          className="resize-none"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Широта</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.0000001" placeholder="55.7711953" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Долгота</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.0000001" placeholder="49.10211794999999" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting}
              >
                Очистить
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Создание...
                  </>
                ) : (
                  "Создать карточку товара"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
