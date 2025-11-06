// modules/article/services/content-processor.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';
import { generateHTML } from '@tiptap/html/server';
import { StarterKit } from '@tiptap/starter-kit';

import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';

@Injectable()
export class ContentProcessorService {
  private readonly extensions: any[];

  constructor() {
    this.extensions = [
      StarterKit,
      Highlight.configure({
        multicolor: true, // для поддержки цветного highlight
      }),
      Subscript,
      Superscript,
      TaskList,
      TaskItem,
      Image.configure({
        HTMLAttributes: {
          class: 'article-image',
        },
      }),
    ];
  }

  // 🔧 ОСНОВНОЙ МЕТОД - ТРАНСФОРМАЦИЯ КОНТЕНТА
  async processContent(editorContent: any): Promise<{
    json: any;
    html: string;
    text: string;
    // stats: ContentStats;
    // assets: ArticleAsset[];
  }> {
    // Валидация входящего контента
    const validatedContent = this.validateContent(editorContent);

    // Генерация различных форматов
    const json = this.extractJSON(validatedContent);
    const html = this.generateHTML(validatedContent);
    const text = this.extractText(validatedContent);

    // // Извлечение медиаресурсов для управления файлами
    // const assets = this.extractAssets(json);

    // // Расчет метрик для UX и аналитики
    // const stats = this.calculateStats(text, json);

    return {
      json,
      html,
      text,
      // stats, assets
    };
  }

  // 🛡️ ВАЛИДАЦИЯ - ЗАЩИТА ОТ НЕКОРРЕКТНЫХ ДАННЫХ
  private validateContent(content: any): any {
    if (!content || typeof content !== 'object') {
      throw new BadRequestException('Content must be a valid object');
    }

    if (!content.type || content.type !== 'doc') {
      throw new BadRequestException('Invalid Tiptap document format');
    }

    if (!Array.isArray(content.content)) {
      throw new BadRequestException('Content must be an array');
    }

    return content;
  }

  // 🎨 ГЕНЕРАЦИЯ HTML - ДЛЯ БЫСТРОГО РЕНДЕРИНГА
  private generateHTML(content: any): string {
    try {
      const rawHtml = generateHTML(content, this.extensions);

      return sanitizeHtml(rawHtml, {
        allowedTags: [
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'p',
          'br',
          'strong',
          'em',
          'u',
          's',
          'ul',
          'ol',
          'li',
          'a',
          'img',
          'blockquote',
          'code',
          'pre',
          'span',
          'div',
        ],
        allowedAttributes: {
          a: ['href', 'target', 'rel', 'title'],
          img: ['src', 'alt', 'width', 'height', 'class', 'style'],
          '*': ['class', 'style', 'data-*'],
        },
        allowedSchemes: ['http', 'https', 'data'],
        allowedSchemesByTag: {
          img: ['http', 'https', 'data'],
        },
      });
    } catch (error) {
      console.error('HTML generation error:', error);
      console.error(
        'Content that caused error:',
        JSON.stringify(content, null, 2),
      );
      throw new BadRequestException(
        `Failed to generate HTML from content: ${error.message}`,
      );
    }
  }

  // 📝 ИЗВЛЕЧЕНИЕ ТЕКСТА - ДЛЯ ПОИСКА И АНАЛИТИКИ
  private extractText(content: any): string {
    const extractTextFromNode = (node: any): string => {
      if (node.text) return node.text;
      if (node.content && Array.isArray(node.content)) {
        return node.content.map(extractTextFromNode).join(' ');
      }
      return '';
    };

    return content.content
      ? content.content.map(extractTextFromNode).join(' ')
      : '';
  }

  // 📋 ИЗВЛЕЧЕНИЕ JSON - ДЛЯ СОХРАНЕНИЯ ИСХОДНОЙ СТРУКТУРЫ
  private extractJSON(content: any): any {
    // Глубокая копия для избежания мутаций
    return JSON.parse(JSON.stringify(content));
  }

  // // 📊 РАСЧЕТ СТАТИСТИК - ДЛЯ ПОЛЬЗОВАТЕЛЬСКОГО ОПЫТА
  // private calculateStats(text: string, json: any): ContentStats {
  //   const words = text
  //     .trim()
  //     .split(/\s+/)
  //     .filter((word) => word.length > 0);
  //   const characters = text.replace(/\s+/g, '').length;
  //   const blocks = this.countBlocks(json);

  //   return {
  //     wordCount: words.length,
  //     characterCount: characters,
  //     readingTime: Math.max(1, Math.ceil(words.length / 200)), // мин. 1 минута
  //     blockCount: blocks,
  //   };
  // }

  // // 🔍 ПОДСЧЕТ БЛОКОВ - ДЛЯ АНАЛИЗА СТРУКТУРЫ
  // private countBlocks(content: any): number {
  //   if (!content.content) return 0;

  //   const countBlocksRecursive = (nodes: any[]): number => {
  //     return nodes.reduce((count, node) => {
  //       if (
  //         ['paragraph', 'heading', 'blockquote', 'codeBlock'].includes(
  //           node.type,
  //         )
  //       ) {
  //         return count + 1;
  //       }
  //       if (node.content && Array.isArray(node.content)) {
  //         return count + countBlocksRecursive(node.content);
  //       }
  //       return count;
  //     }, 0);
  //   };

  //   return countBlocksRecursive(content.content);
  // }

  // // 🖼️ ИЗВЛЕЧЕНИЕ МЕДИА - ДЛЯ УПРАВЛЕНИЯ ФАЙЛАМИ
  // private extractAssets(content: any): ArticleAsset[] {
  //   const assets: ArticleAsset[] = [];

  //   const extractFromNode = (node: any) => {
  //     if (node.type === 'image' && node.attrs && node.attrs.src) {
  //       assets.push({
  //         id:
  //           node.attrs.id ||
  //           `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  //         type: 'image',
  //         url: node.attrs.src,
  //         alt: node.attrs.alt || '',
  //         width: node.attrs.width || null,
  //         height: node.attrs.height || null,
  //       });
  //     }

  //     if (node.content && Array.isArray(node.content)) {
  //       node.content.forEach(extractFromNode);
  //     }
  //   };

  //   if (content.content) {
  //     content.content.forEach(extractFromNode);
  //   }

  //   return assets;
  // }
}
