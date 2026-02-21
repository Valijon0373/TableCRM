import { NextRequest, NextResponse } from "next/server"

// Симуляция AI для генерации SEO параметров
export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json()

    if (!name || name.length < 2) {
      return NextResponse.json(
        { message: "Название товара обязательно" },
        { status: 400 }
      )
    }

    // Симуляция AI генерации SEO
    const seoTitle = `${name} - купить в интернет-магазине | TableCRM`
    
    const seoDescription = description 
      ? `Купить ${name}. ${description.substring(0, 120)}... Доставка по всей России. Гарантия качества.`
      : `Купить ${name} по выгодной цене. Широкий ассортимент, быстрая доставка, гарантия качества. Заказывайте прямо сейчас!`

    // Генерация ключевых слов на основе названия
    const keywords: string[] = []
    const nameWords = name.toLowerCase().split(/\s+/)
    
    // Добавляем основные ключевые слова
    keywords.push(name.toLowerCase())
    keywords.push(...nameWords.filter((w: string) => w.length > 3))
    
    // Добавляем дополнительные ключевые слова
    keywords.push("купить")
    keywords.push("интернет-магазин")
    keywords.push("доставка")
    keywords.push("гарантия")
    
    // Убираем дубликаты
    const uniqueKeywords = Array.from(new Set(keywords)).slice(0, 10)

    return NextResponse.json({
      seo_title: seoTitle,
      seo_description: seoDescription,
      seo_keywords: uniqueKeywords,
    })
  } catch (error) {
    console.error("Error generating SEO:", error)
    return NextResponse.json(
      { message: "Ошибка при генерации SEO", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

