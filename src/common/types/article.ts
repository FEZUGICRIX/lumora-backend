// TODO: переименовать файл в article.types.ts ???

export interface ArticleContent {
  json: any;                    // Полная структура Tiptap для редактора
  html: string;                 // Очищенный HTML для безопасного рендеринга
  text: string;                 // Текст без форматирования для поиска
  version: string;              // Версия формата для миграций в будущем
  assets?: ArticleAsset[];      // Медиа ресурсы для управления файлами
}

export interface ArticleAsset {
  id: string;                   // Уникальный ID ассета
  type: 'image' | 'video' | 'file'; // Тип для правильной обработки
  url: string;                  // Путь к файлу
  alt?: string;                 // ALT текст для accessibility
  width?: number;               // Размеры для responsive images
  height?: number;              // Размеры для responsive images
  size?: number;                // Размер файла для мониторинга
}

export interface ContentStats {
  wordCount: number;            // Для показателя "X слов"
  characterCount: number;       // Для анализа контента
  readingTime: number;          // Для показателя "Y минут чтения"
  blockCount: number;           // Для анализа структуры статьи
}
