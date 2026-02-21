import { NextRequest, NextResponse } from "next/server"

// Симуляция AI для генерации полей из названия товара
// В реальном проекте здесь будет вызов OpenAI API или другой AI сервиса
export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name || name.length < 2) {
      return NextResponse.json(
        { message: "Название товара должно содержать минимум 2 символа" },
        { status: 400 }
      )
    }

    // Симуляция AI генерации (в реальности здесь будет вызов AI API)
    // Для демонстрации используем простую логику на основе ключевых слов
    const nameLower = name.toLowerCase()
    
    // Определяем категорию на основе названия
    let category = 2477 // дефолтная категория
    let globalCategoryId = 127
    let unit = 116 // дефолтная единица измерения
    
    if (nameLower.includes("телефон") || nameLower.includes("смартфон")) {
      category = 2477
      globalCategoryId = 127
      unit = 116
    } else if (nameLower.includes("ноутбук") || nameLower.includes("компьютер")) {
      category = 2477
      globalCategoryId = 127
      unit = 116
    } else if (nameLower.includes("кг") || nameLower.includes("килограмм")) {
      unit = 116
    } else if (nameLower.includes("литр") || nameLower.includes("л")) {
      unit = 116
    }

    // Генерация описаний
    const descriptionShort = `Качественный ${name}. Отличное соотношение цены и качества.`
    const descriptionLong = `Представляем вашему вниманию ${name} - продукт, который сочетает в себе высокое качество и доступную цену. 

Основные преимущества:
• Высокое качество материалов
• Надежность и долговечность
• Удобство в использовании
• Современный дизайн

${name} - это идеальный выбор для тех, кто ценит качество и комфорт.`

    // Генерация кода товара
    const code = `ART-${name.toUpperCase().replace(/\s+/g, "-").substring(0, 10)}-${Date.now().toString().slice(-6)}`

    // Генерация цены (примерная)
    const marketplacePrice = Math.floor(Math.random() * 5000) + 500

    return NextResponse.json({
      description_short: descriptionShort,
      description_long: descriptionLong,
      code,
      unit,
      category,
      global_category_id: globalCategoryId,
      marketplace_price: marketplacePrice,
    })
  } catch (error) {
    console.error("Error generating fields:", error)
    return NextResponse.json(
      { message: "Ошибка при генерации полей", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

