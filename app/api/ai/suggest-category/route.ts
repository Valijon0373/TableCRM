import { NextRequest, NextResponse } from "next/server"

// Симуляция AI для автоматического определения категории
export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name || name.length < 2) {
      return NextResponse.json(
        { message: "Название товара обязательно" },
        { status: 400 }
      )
    }

    // Симуляция AI определения категории
    // В реальности здесь будет вызов AI API для классификации товара
    const nameLower = name.toLowerCase()
    
    // Простая логика определения категории (в реальности - AI модель)
    let category = 2477
    let globalCategoryId = 127
    let categoryName = "Другое"
    
    const categoryMap: Record<string, { category: number; globalCategoryId: number; name: string }> = {
      "телефон": { category: 2477, globalCategoryId: 127, name: "Электроника" },
      "смартфон": { category: 2477, globalCategoryId: 127, name: "Электроника" },
      "ноутбук": { category: 2477, globalCategoryId: 127, name: "Электроника" },
      "компьютер": { category: 2477, globalCategoryId: 127, name: "Электроника" },
      "одежда": { category: 2477, globalCategoryId: 128, name: "Одежда" },
      "обувь": { category: 2477, globalCategoryId: 128, name: "Обувь" },
      "еда": { category: 2477, globalCategoryId: 129, name: "Продукты питания" },
      "продукт": { category: 2477, globalCategoryId: 129, name: "Продукты питания" },
      "мебель": { category: 2477, globalCategoryId: 130, name: "Мебель" },
      "книга": { category: 2477, globalCategoryId: 131, name: "Книги" },
    }
    
    for (const [keyword, cat] of Object.entries(categoryMap)) {
      if (nameLower.includes(keyword)) {
        category = cat.category
        globalCategoryId = cat.globalCategoryId
        categoryName = cat.name
        break
      }
    }

    return NextResponse.json({
      category,
      global_category_id: globalCategoryId,
      category_name: categoryName,
    })
  } catch (error) {
    console.error("Error suggesting category:", error)
    return NextResponse.json(
      { message: "Ошибка при определении категории", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

