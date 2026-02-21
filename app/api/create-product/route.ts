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
    const apiUrl = `https://app.tablecrm.com/api/nomenclature`
    
    // Формируем payload для API
    const payload = {
      name: productData.name,
      description: productData.description || "",
      sku: productData.sku || "",
      price: productData.price,
      unit: productData.unit || "",
      category: productData.category || "",
      barcode: productData.barcode || "",
      weight: productData.weight,
      volume: productData.volume,
      tax_rate: productData.tax_rate,
      in_stock: productData.in_stock,
      min_stock: productData.min_stock,
    }

    // Отправляем запрос к API tablecrm.com
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        // Альтернативный вариант, если используется токен в query параметрах
        // "X-Auth-Token": token,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error:", errorText)
      
      // Пробуем альтернативный вариант с токеном в query параметрах
      const altResponse = await fetch(`${apiUrl}?token=${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!altResponse.ok) {
        const altErrorText = await altResponse.text()
        return NextResponse.json(
          { 
            message: "Ошибка при создании товара",
            details: altErrorText || errorText 
          },
          { status: altResponse.status }
        )
      }

      const altResult = await altResponse.json()
      return NextResponse.json(altResult)
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

