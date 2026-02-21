# Настройка API для tablecrm.com

## Текущая реализация

API route находится в `app/api/create-product/route.ts` и настроен для работы с tablecrm.com API.

## Текущие предположения

Поскольку точная структура API не была доступна, реализация основана на стандартных практиках:

1. **Endpoint**: `https://app.tablecrm.com/api/nomenclature`
2. **Метод**: POST
3. **Аутентификация**: 
   - Bearer token в заголовке Authorization
   - Или token в query параметрах (fallback)

## Что нужно проверить/настроить

После получения доступа к документации API из Google Docs, проверьте и при необходимости обновите:

1. **Точный endpoint URL** - возможно, путь отличается
2. **Структуру payload** - поля могут называться по-другому
3. **Метод аутентификации** - может использоваться другой формат токена
4. **Формат ответа** - для корректной обработки успешных/неуспешных ответов

## Текущий payload

```json
{
  "name": "string",
  "description": "string",
  "sku": "string",
  "price": number,
  "unit": "string",
  "category": "string",
  "barcode": "string",
  "weight": number,
  "volume": number,
  "tax_rate": number,
  "in_stock": number,
  "min_stock": number
}
```

## Как обновить API route

1. Откройте `app/api/create-product/route.ts`
2. Обновите `apiUrl` если endpoint отличается
3. Обновите структуру `payload` согласно документации
4. Обновите метод аутентификации если требуется
5. Обновите обработку ответа если формат отличается

## Тестирование

Для тестирования можно использовать токен из URL:
```
https://app.tablecrm.com/nomenclature?token=af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77
```

Токен автоматически извлекается из URL параметров или используется дефолтный.

