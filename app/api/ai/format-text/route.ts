import { NextRequest, NextResponse } from "next/server"

// Симуляция AI для форматирования текста для удобного чтения
export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || text.length < 2) {
      return NextResponse.json(
        { message: "Текст должен содержать минимум 2 символа" },
        { status: 400 }
      )
    }

    // Симуляция AI форматирования текста
    // В реальности здесь будет вызов AI API для улучшения читаемости
    
    let formatted = text.trim()
    
    // Убираем лишние пробелы
    formatted = formatted.replace(/\s+/g, " ")
    
    // Добавляем переносы строк после точек, если текст длинный
    if (formatted.length > 100) {
      formatted = formatted.replace(/\.\s+/g, ".\n\n")
    }
    
    // Улучшаем структуру: первая буква заглавная
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1)
    
    // Добавляем точку в конце, если её нет
    if (!formatted.match(/[.!?]$/)) {
      formatted += "."
    }

    return NextResponse.json({
      formatted_text: formatted,
    })
  } catch (error) {
    console.error("Error formatting text:", error)
    return NextResponse.json(
      { message: "Ошибка при форматировании текста", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

