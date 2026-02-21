import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, ...productData } = body

    if (!token) {
      return NextResponse.json(
        { message: "Токен не предоставлен" },
        { status: 400 }
      )
    }

    // API endpoint для создания товара в tablecrm.com
    // Используем базовый URL из предоставленной ссылки
    const apiUrl = `https://app.tablecrm.com/api/v1/nomenclature/`
    
    // Формируем payload для API согласно документации
    const payload = {
      name: productData.name,
      type: productData.type || "product",
      description_short: productData.description_short || "",
      description_long: productData.description_long || "",
      code: productData.code || "",
      unit: productData.unit ? parseInt(productData.unit) : 116,
      category: productData.category ? parseInt(productData.category) : 2477,
      cashback_type: productData.cashback_type || "lcard_cashback",
      seo_title: productData.seo_title || "",
      seo_description: productData.seo_description || "",
      seo_keywords: productData.seo_keywords || [],
      global_category_id: productData.global_category_id ? parseInt(productData.global_category_id) : 127,
      marketplace_price: productData.marketplace_price ? parseFloat(productData.marketplace_price) : 0,
      chatting_percent: productData.chatting_percent ? parseFloat(productData.chatting_percent) : 0,
      address: productData.address || "",
      latitude: productData.latitude ? parseFloat(productData.latitude) : null,
      longitude: productData.longitude ? parseFloat(productData.longitude) : null,
    }

    // Отправляем запрос к API tablecrm.com с токеном в query параметрах
    const response = await fetch(`${apiUrl}?token=${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([payload]), // API ожидает массив объектов
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error:", errorText)
      return NextResponse.json(
        { 
          message: "Ошибка при создании товара",
          details: errorText 
        },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { 
        message: "Внутренняя ошибка сервера",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

